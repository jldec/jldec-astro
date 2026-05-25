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
  const state = getState(request)
  const colo = getColo(request)
  const userAgent = getUserAgent(request)

  navLog.push({
    path,
    at: new Date().toISOString()
  })

  const start = Math.max(0, navLog.length - MAX_NAV_LOG_ENTRIES)
  session.set(NAV_LOG_KEY, navLog.slice(start))
  session.set(CLIENT_META_KEY, {
    city,
    state,
    colo,
    userAgent
  })

  return Response.json({ ok: true })
}

function getCity(request: Request): string | null {
  const cfRequest = request as Request & { cf?: { city?: string | null } }
  const city = cfRequest.cf?.city
  return typeof city === 'string' && city.length > 0 ? city : null
}

function getState(request: Request): string | null {
  const cfRequest = request as Request & {
    cf?: {
      region?: string | null
      regionCode?: string | null
    }
  }

  const state = cfRequest.cf?.regionCode ?? cfRequest.cf?.region
  return typeof state === 'string' && state.length > 0 ? state : null
}

function getColo(request: Request): string | null {
  const cfRequest = request as Request & { cf?: { colo?: string | null } }
  const colo = cfRequest.cf?.colo
  return typeof colo === 'string' && colo.length > 0 ? colo : null
}

function getUserAgent(request: Request): string | null {
  const userAgent = request.headers.get('user-agent')
  return typeof userAgent === 'string' && userAgent.length > 0 ? userAgent : null
}
