import { handle } from '@astrojs/cloudflare/handler'
import { SessionStoreDO } from './session/store'

export { SessionStoreDO }

export default {
  async fetch(request, env, ctx) {
    return handle(request, env, ctx)
  }
} satisfies ExportedHandler<Cloudflare.Env>
