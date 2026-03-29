---
title: Multi-user AI chat with RedwoodSDK RSC and Cloudflare agents
date: 2025-06-10
splash:
  image: /images/flowzer.webp
layout: BlogPostLayout
---
# Multi-user AI chat with RedwoodSDK RSC and Cloudflare agents

At a recent event in London, I was excited to learn how [RedwoodSDK](https://rwsdk.com/) makes it easy to run React Server Components (RSC) on Cloudflare.

I decided to learn more about this by building multi-user AI chat. Code on [GitHub](https://github.com/jldec/agents-chat). Deployed at https://agents-chat.jldec.me/.

> - [RSC Chat](https://agents-chat.jldec.me/chat-rsc) - syncs via [RedwoodSDK realtime websockets](https://docs.rwsdk.com/core/realtime/) - stores messages in a separate durable object.
>
> - [OpenAI Chat](https://agents-chat.jldec.me/chat-openai-sdk) - New! Uses [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/)
>
> - [Agent Chat](https://agents-chat.jldec.me/chat-agent) - syncs via [Cloudflare Agents websockets](https://developers.cloudflare.com/agents/api-reference/websockets/) - stores messages in a separate durable object.
>
> - [Agent SDK Chat](https://agents-chat.jldec.me/chat-agent-sdk) - uses [AIChatAgent](https://developers.cloudflare.com/agents/api-reference/agents-api/#aichatagent) with the [useAgentChat](https://developers.cloudflare.com/agents/api-reference/agents-api/#chat-agent-react-api) hook - stores messages in the same (per agent intance) durable object.
>
> - [TinyBase Chat](https://agents-chat.jldec.me/chat-tinybase) - syncs via [TinyBase websockets](https://tinybase.org/) and persists in TinyBase durable object.
>
> - [Agent Agent Chat](https://agents-chat.jldec.me/chat-agent-agent) - More advanced Cloudflare agent with subagents and MCP tool calling (sse only, no auth). Syncs via agent websocket.

Here are just a few of the challenges:

- Live-streaming AI responses back to multiple connected clients
- Subagent creation, lifecycle, identity, sub-threads, approvals
- Conversation persistence, re-use, summaries
- Tool discovery, selective use, approval flow
- User identity, auth, authz
- Long running tasks
- Notifications

## First impressions
- RedwoodSDK (RSCs on Cloudflare workers) is very interesting. The addition of [client-side navigation](https://docs.rwsdk.com/guides/frontend/client-side-nav/) (SPA mode) together with Cloudflare cache integration, will make this stack hard to beat.

- I was a bit surprised to learn that RSC pre-renders `use client` components on the server, on initial load. This can produce errors e.g. running the `useChatAgent()` hook from the agents sdk. The rwsdk team was super-responsive helping to debug the issue, and provided a solution to [disable ssr](https://docs.rwsdk.com/reference/sdk-router/#options). More details in [this PR](https://github.com/jldec/agents-chat/pull/20).

- All implementations rely on Cloudflare [durable objects](https://developers.cloudflare.com/durable-objects/#what-are-durable-objects) with websockets. This is great for runtime performance and makes deployment easy. There are no containers to build or servers to manage.

- React is great for a use case like this where updates are coming from both the server and the client. All implementations use the same [MessageList](https://github.com/jldec/agents-chat/blob/main/src/app/shared/MessageList.tsx) component.

#### RedwoodSK realtime RSC
- Server components are a [succinct](https://github.com/jldec/agents-chat/blob/main/src/app/chat-rsc/ChatRSC.tsx) way to pre-populate JSX with data and then keep clients up to date.

- It's nice to be able to use async data loading inline on the server. Rendering with data from remote storage during streaming can be slower unless data is memoized.

- The scope of the RSC update payload sent to clients may become a problem during streaming, e.g. for pages with a lot of data. Discussion about this in the [rwsdk discord](https://discord.com/channels/679514959968993311/1374715298636238968/1376288266789064734).

- Server functions are convenient, but should be used with care since they generate HTTP APIs which is where auth/authz is commonly required. See [this take](https://www.youtube.com/watch?v=yD-KK4hiULU) from Jack Herrington for more.

#### Cloudflare Agents raw websockets
- Using Cloudflare Agents raw websockets gives us [full control](https://github.com/jldec/agents-chat/blob/main/src/app/chat-agent/WebsocketAgent.ts) over the payloads. This allows for nice optimizations e.g. to send partial data during streaming.

- Rendering chat history on the client via fetch or via websocket makes the initial UX a little janky. (TODO: investigate pre-rendering)

#### Cloudflare Agents SDK with AIChatAgent
- [AIChatAgent](https://developers.cloudflare.com/agents/api-reference/agents-api/#aichatagent) handles multi-user real-time message sync over websockets. This simplifies the implementation.

- The SDK abstracts tool calling and supports different LLMs with Vercel's [AI SDK](https://ai-sdk.dev/docs/introduction).

- [useAgentChat](https://developers.cloudflare.com/agents/api-reference/agents-api/#chat-agent-react-api) which calls AI SDK's [useChat](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat#usechat), manages chat UI interactions with react, however only a single client sees the AI streaming reponse (see [#23](https://github.com/jldec/agents-chat/issues/23)).

#### Agent Agent with subagents and MCP tools
- MCP tools can be added, removed or listed.

- A built-in tool calls [AIChatAgent.saveMessages()](https://github.com/cloudflare/agents/blob/c6d9bf162c26db840f19ba60a48607bc47a3ee00/packages/agents/src/ai-chat-agent.ts#L225) on a named subagent, passing in a new message, as if it were coming from a user. This makes it possible for the main agent to prompt the subagent. Subagent responses currently don't stream (TODO)

#### OpenAI Agents SDK
- OpenAI Agents SDK is less mature and focuses on model APIs, not UI integration.

- It offers APIs for realtime, handoffs, and subagents - not used in this project yet.

- The stateful Agent abstraction assumes long-running server processes with a single conversation per agent.

#### TinyBase sync
- Synchronization is happening between memory and persistance on every node, and between nodes.

- This improves the UX once data is persisted on the client and makes it easy to use React hooks listening for database updates.

- The APIs for [persistence and synchronization](https://github.com/jldec/agents-chat/blob/main/src/app/chat-tinybase/store.ts#L14-L38) feel like they could be consolidated.

- Since store operations run on the client we have to be extra careful with validation e.g. to deal with  clients being compromized.

## What's next?

I'd ❤️ to see if there are ways to combine the best of all the approaches above.

And I believe multi-user AI chat could be the beginning of something much bigger.

> - Agents and humans organize into specialized groups.
> - Universal agents with tools do much of the work.
> - Persisted conversations become the new basis for organizational memory.

Bright futures ahead 🚀