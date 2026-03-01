---
layout: post
title: Building Infrastructure in Parallel
---

> This post was originally published on the [Remind Engineering Blog](https://engineering.remind.com/building-infrastructure-in-parallel/).

In the early days of [stacker](https://github.com/remind101/stacker) at Remind, the number of stacks that we were managing was just a handful. CloudFormation stacks were updated sequentially, without any parallelism, and everyone was happy.

Today, stacker manages 153 CloudFormation stacks that build out all of the AWS infrastructure that makes [remind.com](https://remind.com/) work. As you can imagine, attempting to update 153 stacks without any parallelism takes a long time, about 10 minutes to be precise. When you consider that most stacks don't ever change, 10 minutes feels like an eternity, and prevents a quick feedback loop.

Over the last couple of weeks, I took it upon myself to refactor the core issues in stacker that made implementing parallelism difficult, and dropped our total execution time from 10 minutes, to under 1.5 minutes. This work is now included in [stacker 1.2](https://github.com/remind101/stacker/releases/tag/1.2.0) so everyone can benefit.

### Thinking in Graphs

Before I dive into how we implemented parallelism in stacker, I think it's important to take a step back, and look at what stacker is, at it's core; a tool for linking infrastructure together as a dependency graph.

Let's take a look at a hypothetical stacker config to build out some infrastructure.

```yaml
stacks:
  - name: vpc
    class_path: blueprints.VPC
  - name: cluster
    class_path: blueprints.Cluster
    variables:
      VpcId: ${output vpc::Id}
  - name: db
    class_path: blueprints.DB
    variables:
      VpcId: ${output vpc::Id}
  - name: app
    class_path: blueprints.App
    variables:
      DBUrl: ${output db::URL}
      Cluster: ${output cluster::Id}
```

When described in this way, the [output lookup](http://stacker.readthedocs.io/en/latest/lookups.html#output-lookup) creates an explicit dependency relationship between stacks. The "app" stack depends on a "db" stack and a "cluster" stack, the "db" stack depends on a "vpc" stack, etc.

We can visualize the resulting dependency graph using dot.

```
digraph {
  cluster -> vpc;
  db -> vpc;
  app -> db;
  app -> cluster;
}
```

```bash
$ cat graph.dot | dot -Tpng > graph.png
```

![Simple dependency graph](/assets/images/building-infrastructure-in-parallel/simple-graph.png)

In fact, creating dependency graphs like this isn't really a new concept in computing; [make](https://en.wikipedia.org/wiki/Dependency_graph#Examples) does it, [systemd](https://www.freedesktop.org/software/systemd/man/systemd-analyze.html) does it, and [programming](http://bundler.io/) [languages](https://www.npmjs.com/) do it. Graphs have a lot of nice properties, and are a well researched topic in computer science, with defined algorithms for operating on them. They let us ask questions like:

* What does "app" depend on?
* What depends on "vpc"?

A subset of graphs, called [Directed Acyclic Graphs](https://en.wikipedia.org/wiki/Directed_acyclic_graph), also let us ensure that there are no "cyclic dependencies" present, a common case of poorly defined boundaries in software.

There's a lot of ways that you can think about CloudFormation and stacker (and similar projects, like Terraform), but I like to think of it as a tool that can build a "static binary" for a distributed system, and allows you to specify every dependency of that system as a Directed Acyclic Graph (DAG).

### On walking graphs

Once we understand that we're just working on a graph, it opens up opportunities to leverage Graph Theory research to improve performance.

Let's take a look at our example again. When we want to attempt an update to a stack in CloudFormation, we perform the following steps:

1. Upload a template to S3.
2. Call `DescribeStacks` on the CloudFormation stack to determine what parameters are currently defined.
3. Call `UpdateStack` to attempt an update using the (potentially) new template.
4. If the new template produces an update, we start polling `DescribeStacks` until it's done. Otherwise, the response from UpdateStack will let us know if there's no updates required.

With network latency (and AWS API performance), the minimum total time it takes to perform everything above, without taking into account the amount of time an actual update would take, is about 1-5 seconds per stack.

Now, in a naive non-parallel implementation, the total time it takes to execute all 4 stacks is about 20 seconds (5 seconds * 4 stacks). We would perform a "topological sort" to order the stacks in such a way that each stack that executes already has it's dependencies resolved, which would look something like this:

1. Execute "vpc"
2. Execute "db"
3. Execute "cluster"
4. Execute "app"

But, if we look back at our graph, both the "cluster" and "db" stacks don't depend on each other, which means they can theoretically be executed in parallel. In Graph Theory, this is referred to as the "critical chain"; the longest path from the top of the graph to the bottom.

Our algorithm could be doing this:

1. Execute "vpc"
2. Execute "cluster" and "db" in parallel after "vpc" has completed.
3. Execute "app" after "cluster" and "db" have completed.

Which means our total execution would be 15 seconds (5 seconds * critical path). This algorithm is known as "parallel job scheduling", and there's a [great paper](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-042j-mathematics-for-computer-science-spring-2015/readings/MIT6_042JS15_Session17.pdf) from MIT on it.

In our trivial example, this only shaves off 5 seconds (25%), but in a mature infrastructure like Remind, the graph can get extremely large:

![Wide dependency graph](/assets/images/building-infrastructure-in-parallel/wide-graph.png)

### Implementing parallelism with job scheduling

With MIT's paper in hand (figuratively), we can implement a function that will walk the graph in O(N) time, where N is the critical chain, regardless of the total number of nodes in the graph.

In python, using multithreading, that implementation looks roughly like the following:

```python
threads = {}

# Blocks until all of the given nodes have completed execution (whether
# successfully, or errored). Returns True if all nodes returned True.
def wait_for(nodes):
    return all(threads[node].join() for node in nodes)

# For each node in the graph, we're going to allocate a thread of
# execution. The thread will block executing walk_func, until all of the
# nodes dependencies have executed.
for node in nodes:
    def fn(n, deps):
        # Wait for all dependencies to complete.
        wait_for(deps)
        return walk_func(n)

    deps = dag.all_downstreams(node)
    threads[node] = Thread(target=fn, args=(node, deps), name=node)

# Start up all of the threads.
for node in nodes:
    threads[node].start()

# Wait for all threads to complete executing.
return wait_for(nodes)
```

This omits certain caveats and details, like cancellation, limiting the maximum concurrency, and handling API throttling and retries. After swapping out the graph walker with the implementation above, [stacker 1.2](https://github.com/remind101/stacker/releases/tag/1.2.0) can now build infrastructure significantly faster than before.
