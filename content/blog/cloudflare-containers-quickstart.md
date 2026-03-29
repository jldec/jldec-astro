---
title: Cloudflare Containers Quickstart
splash:
  image: /images/big-sunset-dublin.webp
date: 2025-11-10
layout: BlogPostLayout
excerpt: Quick intro to Cloudflare Containers and how they work
---

# Cloudflare Containers Quickstart

You can now use [Cloudflare Containers](https://developers.cloudflare.com/containers/) (Beta) to run processes which require a [full](https://developers.cloudflare.com/containers/pricing/#instance-types) Linux environment including a filesystem.

![Diagram showing image build, workers, durable objects and container instances.](/images/containers3.webp)

## How it works.

- `wrangler dev` builds container images using a Dockerfile. The docker build process runs commands from the Dockerfile to install packages and copy files. The resulting filesystem changes are captured as cacheable layers in the container image.

- The image can run locally during development and gets pushed to the Cloudflare registry on deploy.

- The `containers` key in `wrangler.jsonc` associates the image with a [Durable Object (DO)](https://developers.cloudflare.com/durable-objects/) class. The implementation of this class is exported from your worker code. It extends a `Container` class which itself extends `DurableObject`.

- Container Durable Object instances map 1:1 to running containers. A worker's fetch handler can `get()` a container instance by name/id, and route HTTP requests to it via `container.fetch()`. Those requests are then forwarded by the Durable Object to the exposed port on the running container instance. Containers can spin up lazily, on the first request to the container.

## Example

The example in [github.com/jldec/container-demo-terminal](https://github.com/jldec/container-demo-terminal) provides a minimal implementation of the flow described above.

![Flow diagram from user -> worker -> durable object -> container](/images/container-demo-terminal.webp)

- The [`Dockerfile`](https://github.com/jldec/container-demo-terminal/blob/main/Dockerfile#L5) adds a web-based terminal called tty2web to the image.

- [`wrangler.jsonc`](https://github.com/jldec/container-demo-terminal/blob/main/wrangler.jsonc#L9-L14) associates the image with the `ContainerClass`.

- [`index.ts`](https://github.com/jldec/container-demo-terminal/blob/main/src/index.ts#L3-L14) is the entry point for the worker. It exports `ContainerClass` and uses the `CONTAINER_DO` binding to connect to the container. Adding a query parameter like `?id=xx` will spin up multiple instances with different names.

The worker is deployed at https://container-demo-terminal.jldec.workers.dev. Visitors interact with a bash shell in the container over a websocket. This URL is protected with Cloudflare Access.

![Screenshot of terminal running top in the container](/images/tty.webp)

#### Cloudflare's dashboard provides nice observability.

![Cloudflare Container dashboard](/images/container-dashboard.webp)

## Sandboxes FTW

What if you could provide your users with their own on-demand containers, where they can safely run AI-generated code? 🤖

The Cloudflare [Sandbox SDK](https://sandbox.cloudflare.com/) is built on Cloudflare Containers. It includes a general purpose container with git, Python, nodejs and an API to run commands and streaming responses.

Check out the [documentation](https://developers.cloudflare.com/sandbox/) for more details.

## Conclusion

I hope this quick intro helps to demystify Cloudflare Containers and Durable Objects a little bit. Please reach out on [Twitter](https://x.com/jldec) with questions or feedback.
