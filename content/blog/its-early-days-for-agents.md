---
title: It's early days for Agents
splash:
  image: images/fall.webp
date: 2025-10-13
layout: BlogPostLayout
excerpt: We're not there yet
---

# It's early days for Agents
[Reasoning](https://openai.com/index/introducing-openai-o1-preview/) and [function calling](https://openai.com/index/function-calling-and-other-api-updates/) both marked significant breakthroughs in the road to making agents more capable.

Developer coding agents like [Amp](https://ampcode.com/home) and [Claude Code](https://www.claude.com/product/claude-code) now leverage those capabilities to generate real value, for which users are willing to pay. They are also pushing the boundaries of what is possible with agents, e.g. by delegating tasks to specialized subagents and carefully managing the context over extended periods.

But coding agents are not general purpose. If we continue to rely on hand-coded agentic apps for specialized domains, that means that we haven't fully grokked the [bitter lesson](https://web.archive.org/web/20251006184925/http://www.incompleteideas.net/IncIdeas/BitterLesson.html).

> To deliver value at scale, Agents need to learn on the job.

Agents should get smarter over time, constantly refining their knowledge based on what they learn from their interactions at inference-time.

## Two approaches
1. AI researchers tend to approach the problem from the perspective of [reinforcement learning](https://deeprlcourse.github.io/guests/richard_sutton/) or other forms post-training. This makes sense coming from the "models-learn" perspective.

2. AI engineers are getting better behavior out of LLMs with [context engineering](https://x.com/karpathy/status/1937902205765607626). Capturing specialized knowledge, and including relevant details in the context used for inference is a natural way for prior conversations to shape the generated output, without additional training of the model.

A combination of both approaches will be required eventually, but in the short term there is lots of room for agent framework providers to innovate without pushing the problem back into the labs

- Remember all conversations.
- Provide search interfaces to map new tasks onto existing knowledge.
- Refine existing knowledge by subjecting it to feedback.

If this is done well, it will also facilitate sharing and learning amongst teams of agents and humans.

## Agents FTW
I am optimistic that even with these modest first steps, we can start shipping agentic systems that are capable of learning and improving over time.

In the meantime, innovations in how users interact with agents (like [solveit](https://solve.it.com)), and how agents interact with their environment (like [codemode](https://blog.cloudflare.com/code-mode/)) are exciting evidence of how fertile this space still is.

## 🚀🚀🚀