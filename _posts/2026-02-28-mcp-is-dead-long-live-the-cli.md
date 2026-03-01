---
layout: post
title: MCP is dead. Long live the CLI
---

<!-- OUTLINE

- LLM's understand how to use CLI's just fine
- CLI's are usable by humans too
- CLI's are composable with other tools (e.g. piping output to `jq`). Sometimes this is necessary for context preservation (e.g. trying to analyze large terraform plans or state files)
  - Try running a "count" on some MCP output
- CLI's are not opinionated about auth
- CLI's require no additional infrastructure
- CC has a bug where MCP don't always initialize
- MCP's need to be re-authed constantly.
- MCP's are really limited in how you can allowlist them in settings.json (can only allowlist the action, not specific parameters used).

-->

---

When Anthropic announced the Model Context Protocol, I was genuinely excited. A standard way for LLMs to interact with external tools and data sources? Sign me up. I integrated MCP servers into my Claude Code workflow for Jira, Confluence, Datadog, and more.

Six months later, I've ripped most of them out. Here's why the humble CLI turned out to be the better abstraction.

## LLMs already understand CLIs

Here's something I didn't fully appreciate at first: LLMs are *really good* at using command-line tools. They've been trained on millions of man pages, Stack Overflow answers, and GitHub repos full of shell scripts. When I tell Claude to use `gh pr view 123`, it knows exactly what to do.

MCP promised a cleaner interface, but in practice, I found myself writing the same kind of documentation anyway—explaining what each tool does, what parameters it accepts, when to use it. The LLM didn't need a special protocol; it needed good documentation.

## CLIs are for humans too

One of the underappreciated benefits of CLI tools is that *I* can use them. When I'm debugging why Claude did something unexpected with Jira, I can run the same `jira issue view` command myself and see exactly what it saw.

With MCP, there's a layer of indirection. The tool exists only in the context of the LLM conversation. If something goes wrong, I'm reading JSON logs instead of just running the command myself.

## Composability matters

This is where CLIs really shine. I can pipe output through `jq`, redirect to files, combine with `grep`, or chain with `&&`. This isn't just convenient—it's often *necessary*.

Consider analyzing a large Terraform plan. The raw output might be thousands of lines. With a CLI, I can do:

```bash
terraform show -json plan.out | jq '[.resource_changes[] | select(.change.actions[0] == "no-op" | not)] | length'
```

Try doing that with an MCP tool. You'd need to either:
1. Dump the entire plan into the context window (expensive and often impossible)
2. Build filtering into the MCP tool itself (now you're maintaining custom tooling)

The CLI approach leverages tools that already exist, are well-documented, and that I can test myself.

## Auth is your problem (in a good way)

MCP servers handle authentication in their own way. Some use OAuth, some use API keys, some use... other things. Each one has its own auth flow, its own token refresh logic, its own way of failing when credentials expire.

CLI tools, by contrast, are unopinionated. They use whatever auth mechanism the underlying service provides. `aws` uses profiles and SSO. `gh` uses `gh auth login`. `kubectl` uses kubeconfig. These are battle-tested auth flows that work the same whether I'm using the CLI directly or Claude is using it for me.

And when auth breaks? I fix it the same way I always would—by re-running `aws sso login` or `gh auth refresh`. No special MCP troubleshooting required.

## No infrastructure required

MCP servers are processes that need to run somewhere. In Claude Code, they're spawned as child processes, which works until it doesn't. I've hit bugs where servers fail to initialize, where they silently hang, where they need to be manually restarted.

CLI tools are just... there. They're already installed on my machine. They don't need to be running in the background. There's no state to manage, no processes to monitor.

## The practical problems

Beyond the philosophical differences, MCP has some real practical issues:

**Initialization is flaky.** I've lost count of the times I've had to restart Claude Code because an MCP server didn't initialize properly. Sometimes it works on the second try, sometimes I need to clear state.

**Re-auth is constant.** OAuth tokens expire. MCP servers need to be re-authenticated. This isn't necessarily MCP's fault, but it's friction that doesn't exist with CLIs that use longer-lived credentials or SSO.

**Permissions are coarse-grained.** In Claude Code's settings.json, you can allowlist MCP tools, but only by name. You can't say "allow read operations but prompt for writes." With CLI tools, I have fine-grained control—I can allowlist `gh pr view` but require approval for `gh pr merge`.

## When MCP makes sense

I don't think MCP is useless. For tools that genuinely don't have good CLI equivalents, or for workflows where the LLM needs to maintain state across calls, MCP can be the right choice.

But for most of my day-to-day work—querying Jira, reading docs, interacting with AWS—the CLI is simpler, more debuggable, and more reliable.

## The takeaway

The best tools are the ones that work for both humans and machines. CLIs have decades of design iteration behind them. They're composable, debuggable, and they leverage auth systems I already have set up.

MCP tried to create a better abstraction, but sometimes the old abstraction was already pretty good.
