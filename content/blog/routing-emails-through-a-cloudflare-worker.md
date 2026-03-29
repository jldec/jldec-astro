---
title: Routing emails through a Cloudflare Worker
date: 2024-10-16
layout: BlogPostLayout
splash:
  image: /images/red-flower.webp
---

# Routing emails through a Cloudflare Worker

This is a quick walkthrough of how to setup [email routing](https://developers.cloudflare.com/email-routing/) on your domain and process emails with a Cloudflare Worker.

The [docs](https://developers.cloudflare.com/email-routing/) and dashboard UI are already really awesome, so I'll be relying on screenshots a lot. 😇

If all you need is to forward emails, you can do this without a worker, but workers are a nice way to handle more complex routing logic or process emails in other ways.

This post assumes that you have a domain name and are using Cloudflare to manage [DNS](https://www.cloudflare.com/learning/dns/dns-records/). It also assumes that the domain is not already configured for another email provider.

_Oct 27, 2024:_ Added POST handler which sends email, [updated](https://github.com/jldec/my-email-worker/pull/4/files) GitHub starter.

## 1. Enable email routing on your domain

Go to `Websites` in your Cloudflare [dashboard](https://dash.cloudflare.com/zones) and select the domain for which you're enabling email (I'm using `jldec.fun`).

Look for `Email > Email Routing` and click the `Get started` button.
![Screenshot of Email Routing page in the Cloudflare Dashboard](/images/cf-email-dashboard.webp)

Provide a new address for receiving, and a destination to forward to.

![Screenshot of Email Routing Getting Started](/images/cf-email-forward-address.webp)

After verifying the forwarding address, confirm the DNS changes.

![Screenshot of Email DNS configuration](/images/cf-email-dns.webp)

Once the DNS changes are done, your first routing rules will take effect.

![Screenshot of Email Routing Rules](/images/cf-email-routing-rules.webp)

## 2. Setup an email Worker

In this step we will add a worker, triggered by incoming email messages.

Go to the `Email Workers` tab, and cick the `Create` button.`

![Screenshot of the Email Workers tab](/images/cf-email-workers-create.webp)

Choose the `Allowlist senders` starter.

![Screenshot of Email Workers starters](/images/cf-email-workers-create-templates.webp)

In the online editor, fix the code to suit your needs, then `Save and Deploy`.

![Screenshot of Email Workers editor](/images/cf-email-workers-create-edit.webp)

Create a custom email address for the worker to receive emails.

![Screenshot of Email Workers custom address](/images/cf-email-worker-address.webp)

Send a test email to the new worker email address.

![Screenshot of Email Workers test email](/images/cf-email-test-email.webp)

You should see the `Live` worker logs in the dashboard for the newly-deployed worker, under `Workers & Pages` in your account. Start the log stream before sending the email.

![Screenshot of Email Workers real time logs](/images/cf-email-worker-real-time-logs.webp)

## 3. Deploy the Worker with Wrangler

[wrangler](https://developers.cloudflare.com/workers/wrangler/) will allow you to configure the worker to persist logs, and can run builds with TypeScript and 3rd-party npm packages.

To make this easier, I created a starter project at [github.com/jldec/my-email-worker](https://github.com/jldec/my-email-worker) with logging enabled.

The sample uses [postal-mime](https://github.com/postalsys/postal-mime#readme) to parse attachments, and [mime-text](https://github.com/muratgozel/MIMEText) to generate a reply. The `mime-text` package requires `nodejs_compat` in wrangler.toml.

To use this starter:

1. `pnpm create cloudflare --template github:jldec/my-email-worker`
2. Modify the worker address and forwarding address in `wrangler.toml`.
3. Deploy the worker with `pnpm wranger deploy`

**wrangler.toml**
```toml
#:schema node_modules/wrangler/config-schema.json
name = "my-email-worker"
main = "src/index.ts"
compatibility_date = "2024-10-11"
compatibility_flags = [ "nodejs_compat" ]

[observability]
enabled = true

[vars]
EMAIL_WORKER_ADDRESS = "my-email-worker@jldec.fun"
EMAIL_FORWARD_ADDRESS = "jurgen@jldec.me"
```

**index.ts**
```ts
/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for an Email Worker: a worker that is triggered by an incoming email.
 * https://developers.cloudflare.com/email-routing/email-workers/
 *
 * - The wrangler development server is not enabled to run email workers locally.
 * - Run `pnpm ship` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `pnpm cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { EmailMessage } from 'cloudflare:email'
import { createMimeMessage } from 'mimetext'
import PostalMime from 'postal-mime'

export default {
  email: async (message, env, ctx) => {
    console.log(`Received email from ${message.from}`)

    // parse for attachments - see postal-mime for additional options
    // https://github.com/postalsys/postal-mime/tree/master?tab=readme-ov-file#postalmimeparse
    const email = await PostalMime.parse(message.raw)
    email.attachments.forEach((a) => {
      if (a.mimeType === 'application/json') {
        const jsonString = new TextDecoder().decode(a.content)
        const jsonValue = JSON.parse(jsonString)
        console.log(`JSON attachment value:\n${JSON.stringify(jsonValue, null, 2)}`)
      }
    })

    // reply to sender must include in-reply-to with message ID
    // https://developers.cloudflare.com/email-routing/email-workers/reply-email-workers/
    const messageId = message.headers.get('message-id')
    if (messageId) {
      console.log(`Replying to ${message.from} with message ID ${messageId}`)
      const msg = createMimeMessage()
      msg.setHeader('in-reply-to', messageId)
      msg.setSender(env.EMAIL_WORKER_ADDRESS)
      msg.setRecipient(message.from)
      msg.setSubject('Auto-reply')
      msg.addMessage({
        contentType: 'text/plain',
        data: `Thanks for the message`
      })
      const replyMessage = new EmailMessage(env.EMAIL_WORKER_ADDRESS, message.from, msg.asRaw())
      ctx.waitUntil(message.reply(replyMessage))
    }

    ctx.waitUntil(message.forward(env.EMAIL_FORWARD_ADDRESS))
  }
} satisfies ExportedHandler<Env>
```

Here are the persisted logs in the Cloudflare dashboard. 🎉

![Screenshot of Email Workers logs](/images/cf-email-worker-persisted-logs.webp)

> Tip: If you use gmail to test forwarding, I suggest using one account to send, and a different account to receive the forwarded emails . Using the same account (even with an alias) has not worked for me.

## 4. Add POST handler to send emails

For a worker to send emails from a fetch handler, you need a `send_email` [binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/#what-is-a-binding) in `wrangler.toml`. E.g.

```toml
[[send_email]]
name = "SEND_EMAIL"
```

The binding `name` is required to expose `env.<NAME>.send()` in the worker.

Additional binding [values](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/#types-of-bindings) for `destination_address` or `allowed_destination_addresses` are optional.

Run `wrangler types` to add the new binding to the `Env` interface in `worker-configuration.d.ts`.

For the binding to work, the `from` address must match a configured [custom address](https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/#custom-addresses), and the `to` address must match a configured [destination address](https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/#destination-addresses). The [docs](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/) are little unclear about this, but this is how I got it to work.

```ts
  // Send email in respose to a POST request
  // TODO: CSRF protection, CORS headers, handle form data encoding
  // https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/#example-worker
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }
    const msg = createMimeMessage()
    msg.setSender(env.EMAIL_WORKER_ADDRESS)
    msg.setRecipient(env.EMAIL_FORWARD_ADDRESS)
    msg.setSubject('Worker POST')
    msg.addMessage({
      contentType: 'text/plain',
      data: (await request.text()) ?? 'No body'
    })

    var message = new EmailMessage(env.EMAIL_WORKER_ADDRESS, env.EMAIL_FORWARD_ADDRESS, msg.asRaw())
    try {
      await env.SEND_EMAIL.send(message)
    } catch (e) {
      return new Response((e as Error).message)
    }

    return new Response('OK')
  }
```

Test with a curl request and look for the email in your inbox.
```sh
$ curl https://my-email-worker.jldec.workers.dev/ -d 'hello worker'
OK
```
![Screenshot of email sent from worker](/images/cf-email-worker-inbox.webp)

> 💌 You've got mail.
