import type { APIRoute } from 'astro'
import { listStoredSessions, parseStoredValue } from '../../../session/client'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const cursor = url.searchParams.get('cursor')
  const rawLimit = Number.parseInt(url.searchParams.get('limit') ?? '', 10)
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 20

  const page = await listStoredSessions(cursor, limit)

  return Response.json({
    nextCursor: page.nextCursor,
    sessions: page.sessions.map((session) => ({
      sessionId: session.sessionId,
      updatedAt: session.updatedAt,
      value: parseStoredValue(session.value)
    }))
  })
}
