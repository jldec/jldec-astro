import type { APIRoute } from 'astro'
import { getStoredSession, parseStoredValue } from '../../../session/client'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
  const sessionId = params.id

  if (!sessionId) {
    return Response.json({ error: 'Missing session id' }, { status: 400 })
  }

  const session = await getStoredSession(sessionId)

  if (!session) {
    return Response.json({ error: 'Session not found' }, { status: 404 })
  }

  return Response.json({
    sessionId: session.sessionId,
    updatedAt: session.updatedAt,
    value: parseStoredValue(session.value)
  })
}
