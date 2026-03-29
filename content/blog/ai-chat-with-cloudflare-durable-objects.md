---
title: AI chat with Cloudflare Durable Objects
date: "2024-11-19"
layout: BlogPostLayout
---

# AI chat with Cloudflare Durable Objects
![Architecture diagram showing chat worker durable object with AI and content owner and reader users](/images/chat-worker-durable=object.webp)

### Content owners (editors)
- Use regular WYSIWYG editor controls to edit page content.
- Chat with AI e.g. to make changes or to brainstorm ideas.
- Chat with other users.

### Readers
- Chat with AI and with other users about the content.
- E.g. may provide feedback or ask questions.
- In general are not allowed to edit content.

### AI models
- Receive context and messages from readers and editors.
- Respond with text or with tool calls to edit content.
