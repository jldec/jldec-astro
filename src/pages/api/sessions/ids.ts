import type { APIRoute } from 'astro'
import { listStoredSessionSummaries } from '../../../session/client'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const cursor = url.searchParams.get('cursor')
  const rawLimit = Number.parseInt(url.searchParams.get('limit') ?? '', 10)
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 500) : 500

  const page = await listStoredSessionSummaries(cursor, limit)

  return Response.json({
    nextCursor: page.nextCursor,
    sessions: page.sessions
  })
}
