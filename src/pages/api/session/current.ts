import type { APIRoute } from 'astro'
import { getStoredSession, parseStoredValue } from '../../../session/client'

export const prerender = false

export const GET: APIRoute = async ({ session }) => {
  if (!session) {
    return Response.json({ sessionId: null, session: null, values: {} })
  }

  const entries = await session.entries()
  const values = Object.fromEntries(entries)
  const sessionId = session.sessionID ?? null

  if (!sessionId) {
    return Response.json({ sessionId: null, session: null, values })
  }

  const stored = await getStoredSession(sessionId)

  return Response.json({
    sessionId,
    values,
    session: stored
      ? {
          sessionId: stored.sessionId,
          updatedAt: stored.updatedAt,
          value: parseStoredValue(stored.value)
        }
      : null
  })
}
