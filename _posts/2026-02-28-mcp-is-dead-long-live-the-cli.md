---
layout: post
title: MCP is dead. Long live the CLI
---

I'm going to make a bold claim; MCP is already in its death throes. We may not fully realize it yet, but the signs are there. OpenClaw doesn't support it, Pi doesn't support it. And for good reason.

When Anthropic announced the Model Context Protocol, the industry collectively lost its mind. Every company scrambled to ship MCP servers as proof they were "AI first." Massive resources poured into new endpoints, new wire formats, new authorization schemes—all so LLMs could talk to services they could already talk to.

I'll admit—I never fully understood the need for it. You know what LLMs are really good at? Figuring things out on their own. Give them a CLI and some docs and they're off to the races. MCP provides no real world benefit. Let me explain.

## LLMs don't need a special protocol

Here's the thing: LLMs are *really good* at using command-line tools. They've been trained on millions of man pages, Stack Overflow answers, and GitHub repos full of shell scripts. When I tell Claude to use `gh pr view 123`, it just works.

MCP promised a cleaner interface, but in practice I found myself writing the same documentation anyway—what each tool does, what parameters it accepts, when to use it. The LLM didn't need a new protocol. It needed a good `--help` flag.

## CLIs are for humans too

When Claude does something unexpected with Jira, I can run the same `jira issue view` command and see exactly what it saw. Same input, same output, no mystery.

With MCP, the tool only exists inside the LLM conversation. Something goes wrong and now I'm spelunking through JSON transport logs instead of just running the command myself. Debugging shouldn't require a protocol decoder.

## Composability is the killer feature

This is where the gap gets wide. CLIs compose. I can pipe through `jq`, chain with `grep`, redirect to files. This isn't just convenient—it's often the only practical approach.

Consider analyzing a large Terraform plan:

```bash
terraform show -json plan.out | jq '[.resource_changes[] | select(.change.actions[0] == "no-op" | not)] | length'
```

With MCP, your options are dumping the entire plan into the context window (expensive, often impossible) or building custom filtering into the MCP server itself. Either way, you're doing more work to get a worse result. The CLI approach leverages tools that already exist, are well-documented, and that both humans and LLMs can use.

## Auth already works

MCP servers each handle auth their own way. Some use OAuth, some use API keys, some use... creative approaches. Every server has its own token refresh logic and its own way of failing when credentials expire.

CLI tools don't care. `aws` uses profiles and SSO. `gh` uses `gh auth login`. `kubectl` uses kubeconfig. These are battle-tested auth flows that work identically whether I'm at the keyboard or Claude is driving. When auth breaks, I fix it the way I always would—`aws sso login`, `gh auth refresh`—no MCP-specific troubleshooting required.

## No moving parts

MCP servers are processes. They need to start up, stay running, and not silently hang. In Claude Code, they're spawned as child processes, which works until it doesn't.

CLI tools are just binaries on disk. No background processes, no state to manage, no initialization dance. They're there when you need them and invisible when you don't.

## The practical pain

Beyond the design philosophy, MCP has real day-to-day friction:

**Initialization is flaky.** I've lost count of the times I've restarted Claude Code because an MCP server didn't come up. Sometimes it works on retry, sometimes I'm clearing state and starting over.

**Re-auth never ends.** OAuth tokens expire. MCP servers need to be re-authenticated constantly. CLIs with SSO or long-lived credentials just don't have this problem.

**Permissions are all-or-nothing.** Claude Code lets you allowlist MCP tools by name, but that's it. You can't scope to read-only operations or restrict parameters. With CLIs, I can allowlist `gh pr view` but require approval for `gh pr merge`. That granularity matters.

## So when does MCP make sense?

I'm not saying MCP is completely useless. If a tool genuinely has no CLI equivalent, or if you need stateful multi-turn interactions with a service, MCP might be the right call.

But for the vast majority of work—querying Jira, reading docs, managing infrastructure, interacting with GitHub—the CLI is simpler, faster to debug, and more reliable.

## The real lesson

The best tools are the ones that work for both humans and machines. CLIs have had decades of design iteration. They're composable, debuggable, and they piggyback on auth systems that already exist.

MCP tried to build a better abstraction. But sometimes the old one was already pretty damn good.

## A plea to builders

If you're a company investing in an MCP server but you don't have an official CLI—stop and rethink what you're doing. You're building the adapter before the tool. Ship a good API, then ship a good CLI. The LLMs will figure it out. I promise.
