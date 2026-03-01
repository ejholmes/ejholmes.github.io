---
layout: post
title: Keeping AWS secrets secret with ECS
---

> This post was originally published on the [Remind Engineering Blog](https://engineering.remind.com/keeping-aws-secrets-secret-with-ecs/).

One of the most important aspects of our security strategy in the Operations Engineering Team is to mitigate the risk of leaked AWS credentials. Even if you follow AWS best practices of putting your infrastructure within a VPC, leaking AWS credentials provides keys to the castle.

This post describes the strategy that we take to reduce the probability of AWS credentials being leaked, as well as reducing the risk in the event that they are leaked.

## Background

> In the beginning, there were long lived credentials.

The most straight forward way to give an application access to make requests to AWS APIs is to create an IAM user, generate an access key, and then pass the access key id and secret to the application. However, this has a number of problems:

* **Trust**. How do you pass these values to an application securely, so that they can't be accessed by unauthorized parties, and aren't stored in plaintext? In ECS, it would be bad practice to include AWS access keys as plaintext environment variables in task definitions. Any application or service that has the `ecs:DescribeTaskDefinition` permission will have access to all secrets.
* **Credential Lifetime**: IAM access keys don't automatically expire. The longer an access key lives, the higher the probability is that it has been accidentally, or maliciously leaked. Accidental leaks from human error are a [surprisingly common source of incidents](https://medium.com/starting-up-security/learning-from-a-year-of-security-breaches-ed036ea05d9b).

## Instance Profiles

An alternative method is to use [EC2 Instance Profiles](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html). Instance profiles allow you to attach an IAM role to an EC2 instance, and applications running on the host can access an "instance metadata" endpoint to obtain temporary AWS credentials. This solves both trust (The EC2 instance authenticates itself with AWS) and credential expiration (credentials obtained from instance metadata only last for 1 hour, greatly minimizing the impact of a leak).

However, in the context of ECS, instance profiles have their own set of problems:

* **Granularity**: In ECS, you'll likely have many different services and applications running on the same host. To use credentials from an instance profile would require that we give the host a combination of all required permissions needed for each service, instead of giving each service it's own granular permissions. This would be a strict violation of the principle of least privilege.
* **Unprotected Instance Metadata**: It may not initially seem obvious, but instance metadata can be an incredibly dangerous feature. All it takes is an arbitrary GET request to http://169.254.169.254/ to obtain AWS credentials. What happens when software running on the host introduces a feature that downloads files from a URL? This potential exploit is best described in [http://www.daemonology.net/blog/2016-10-09-EC2s-most-dangerous-feature.html](http://www.daemonology.net/blog/2016-10-09-EC2s-most-dangerous-feature.html).

## Enter ECS Task Roles

ECS introduced [Task Roles](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html), which are similar to Instance Profiles, allowing you to attach an IAM role to an ECS task. This seems to solve all of our problems:

* **Granularity**: ECS tasks only get the exact permissions they need.
* **Credential Lifetime**: Credentials expire after 1 hour and are automatically rotated.
* **Unprotected Instance Metadata**: When obtaining credentials from ECS task roles, like instance profiles, the client within the container hits a metadata endpoint (http://169.254.169.254), which routes to the ECS agent running on the host. However, unlike instance metadata, the URL where credentials can be obtained is dynamically generated, and provided to the container via an environment variable. If an attacker gained access to make arbitrary GET requests, they would also need to know the value of the `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI` environment variable within the container.

At Remind, we use [Stacker](https://github.com/remind101/stacker) to manage all of our infrastructure, and then we run our services and applications with [Empire](https://github.com/remind101/empire). Through Stacker, we have a base "blueprint" for each Empire app which (among other things):

* Creates an IAM role that can be assumed by ECS.
* Creates a KMS key that the app can use to encrypt/decrypt SSM parameters (we may talk more about this in a future post).
* Passes the role to the Empire application.

Doing this ensures that we have a common starting point and convention for managing how all of our applications and services access AWS API's.

## Combining the two

Not everything that we run on our ECS container instances gets run with ECS/Docker. We wanted to be able to continue using instance profiles for software running outside of Docker (generally infrastructure processes, like the Amazon SSM/ECS agents), but with the assurance that our Docker containers (user facing applications) would not be able to access userdata, or IAM credentials from the instance profile.

To do this, any requests from Docker containers going to the instance metadata endpoint get re-routed to an nginx proxy on host. This proxy denies the container access to the instance metadata endpoints for userdata and IAM credentials:

```nginx
daemon off;
error_log stderr;

events {
  worker_connections 1024;
}

http {
  log_format request 'method=$request_method uri="$request_uri" host=$host ua="$http_user_agent" remote=$remote_addr status=$status';
  access_log /dev/stdout request;

  server {
    listen 127.0.0.1:7823;

    # Disallow access to credentials obtained from the instance profile.
    location ~ ^\/.*\/meta-data\/iam\/security-credentials\/.* {
      return 403;
    }

    # Disallow access to user data. In general, we shouldn't be putting secrets
    # in user data, but just in case...
    location ~ ^\/.*\/user-data.* {
      return 403;
    }

    # Proxy all other request through to instance metadata.
    location / {
      proxy_pass http://169.254.169.254:80;
    }
  }
}
```

```bash
$ iptables -t nat -I PREROUTING -p tcp -d 169.254.169.254 --dport 80 \
    -j DNAT --to-destination 127.0.0.1:7823
```

This has the added benefit that any requests to instance metadata initiated from a Docker container gets logged and forwarded to our log aggregation service.

With the above in place, if an application or service that we run with ECS were to introduce an exploit that allowed an attacker to make arbitrary GET requests, we can be more confident that the attacker won't be able to obtain AWS credentials.
