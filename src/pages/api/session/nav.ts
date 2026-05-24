import type { APIRoute } from 'astro'

export const prerender = false

interface NavLogEntry {
  path: string
  at: string
}

const NAV_LOG_KEY = 'navLog'
const CLIENT_META_KEY = 'clientMeta'
const MAX_NAV_LOG_ENTRIES = 200

export const POST: APIRoute = async ({ request, session }) => {
  if (!session) {
    return Response.json({ error: 'Session unavailable' }, { status: 500 })
  }

  const payload = (await request.json().catch(() => null)) as { path?: unknown } | null
  const rawPath = payload?.path
  const path = typeof rawPath === 'string' && rawPath.startsWith('/') ? rawPath : null

  if (!path) {
    return Response.json({ error: 'Expected a path beginning with /' }, { status: 400 })
  }

  const existing = await session.get<NavLogEntry[]>(NAV_LOG_KEY)
  const navLog = Array.isArray(existing) ? existing : []
  const city = getCity(request)
  const userAgent = shortUserAgent(request.headers.get('user-agent'))

  navLog.push({
    path,
    at: new Date().toISOString()
  })

  const start = Math.max(0, navLog.length - MAX_NAV_LOG_ENTRIES)
  session.set(NAV_LOG_KEY, navLog.slice(start))
  session.set(CLIENT_META_KEY, {
    city,
    userAgent
  })

  return Response.json({ ok: true })
}

function getCity(request: Request): string | null {
  const cfRequest = request as Request & { cf?: { city?: string | null } }
  const city = cfRequest.cf?.city
  return typeof city === 'string' && city.length > 0 ? city : null
}

function shortUserAgent(userAgent: string | null): string | null {
  if (!userAgent) return null

  const matchers: Array<{ name: string; regex: RegExp }> = [
    { name: 'Edge', regex: /Edg\/(\d+)/i },
    { name: 'Chrome', regex: /Chrome\/(\d+)/i },
    { name: 'Firefox', regex: /Firefox\/(\d+)/i },
    { name: 'Safari', regex: /Version\/(\d+).+Safari\//i }
  ]

  for (const matcher of matchers) {
    const match = userAgent.match(matcher.regex)
    if (match) {
      return `${matcher.name} ${match[1]}`
    }
  }

  return userAgent.slice(0, 40)
}
