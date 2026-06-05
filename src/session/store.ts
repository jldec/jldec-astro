import { DurableObject } from 'cloudflare:workers'

interface SessionRow {
  sessionId: string
  updatedAt: number
  value: string
}

interface SessionIdRow {
  sessionId: string
  updatedAt: number
}

interface CursorParts {
  updatedAt: number
  sessionId: string
}

const DEFAULT_SESSIONS_LIMIT = 20
const MAX_SESSIONS_LIMIT = 100
const DEFAULT_IDS_LIMIT = 500
const MAX_IDS_LIMIT = 500

export class SessionStoreDO extends DurableObject {
  private initialized: Promise<void>

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env)

    this.initialized = this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(
        'CREATE TABLE IF NOT EXISTS sessions (session_id TEXT PRIMARY KEY, updated_at INTEGER NOT NULL, value TEXT NOT NULL)'
      )
      this.ctx.storage.sql.exec(
        'CREATE INDEX IF NOT EXISTS sessions_updated_idx ON sessions(updated_at DESC, session_id DESC)'
      )
    })
  }

  async fetch(request: Request): Promise<Response> {
    await this.initialized

    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (request.method === 'GET' && path.startsWith('/session/')) {
      const sessionId = decodeURIComponent(path.slice('/session/'.length))
      return this.getSessionById(sessionId)
    }

    if (request.method === 'PUT' && path.startsWith('/session/')) {
      const sessionId = decodeURIComponent(path.slice('/session/'.length))
      return this.putSessionById(request, sessionId)
    }

    if (request.method === 'DELETE' && path.startsWith('/session/')) {
      const sessionId = decodeURIComponent(path.slice('/session/'.length))
      return this.deleteSessionById(sessionId)
    }

    if (request.method === 'GET' && path === '/sessions') {
      return this.getSessions(url.searchParams)
    }

    if (request.method === 'GET' && path === '/session-ids') {
      return this.getSessionIds(url.searchParams)
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  private getSessionById(sessionId: string): Response {
    const rows = this.ctx.storage.sql
      .exec(
        'SELECT session_id AS sessionId, updated_at AS updatedAt, value FROM sessions WHERE session_id = ?1',
        sessionId
      )
      .toArray() as unknown as SessionRow[]

    return Response.json({ session: rows[0] ?? null })
  }

  private async putSessionById(request: Request, sessionId: string): Promise<Response> {
    const payload = (await request.json().catch(() => null)) as { value?: unknown } | null
    const value = payload?.value

    if (typeof value !== 'string') {
      return Response.json({ error: 'Expected payload with string value' }, { status: 400 })
    }

    const updatedAt = Date.now()

    this.ctx.storage.sql.exec(
      'INSERT INTO sessions (session_id, updated_at, value) VALUES (?1, ?2, ?3) ON CONFLICT(session_id) DO UPDATE SET updated_at = excluded.updated_at, value = excluded.value',
      sessionId,
      updatedAt,
      value
    )

    return new Response(null, { status: 204 })
  }

  private deleteSessionById(sessionId: string): Response {
    this.ctx.storage.sql.exec('DELETE FROM sessions WHERE session_id = ?1', sessionId)
    return new Response(null, { status: 204 })
  }

  private getSessions(searchParams: URLSearchParams): Response {
    const limit = clampLimit(searchParams.get('limit'), DEFAULT_SESSIONS_LIMIT, MAX_SESSIONS_LIMIT)
    const cursor = decodeCursor(searchParams.get('cursor'))
    const rows = this.ctx.storage.sql
      .exec(
        'SELECT session_id AS sessionId, updated_at AS updatedAt, value FROM sessions WHERE (?1 IS NULL OR updated_at < ?2 OR (updated_at = ?2 AND session_id < ?3)) ORDER BY updated_at DESC, session_id DESC LIMIT ?4',
        cursor ? 1 : null,
        cursor?.updatedAt ?? 0,
        cursor?.sessionId ?? '',
        limit
      )
      .toArray() as unknown as SessionRow[]

    return Response.json({
      sessions: rows,
      nextCursor: rows.length === limit ? encodeCursor(rows[rows.length - 1]) : null
    })
  }

  private getSessionIds(searchParams: URLSearchParams): Response {
    const limit = clampLimit(searchParams.get('limit'), DEFAULT_IDS_LIMIT, MAX_IDS_LIMIT)
    const cursor = decodeCursor(searchParams.get('cursor'))
    const rows = this.ctx.storage.sql
      .exec(
        'SELECT session_id AS sessionId, updated_at AS updatedAt FROM sessions WHERE (?1 IS NULL OR updated_at < ?2 OR (updated_at = ?2 AND session_id < ?3)) ORDER BY updated_at DESC, session_id DESC LIMIT ?4',
        cursor ? 1 : null,
        cursor?.updatedAt ?? 0,
        cursor?.sessionId ?? '',
        limit
      )
      .toArray() as unknown as SessionIdRow[]

    return Response.json({
      sessions: rows,
      nextCursor: rows.length === limit ? encodeCursor(rows[rows.length - 1]) : null
    })
  }
}

function clampLimit(value: string | null, fallback: number, max: number): number {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.min(parsed, max)
}

function decodeCursor(value: string | null): CursorParts | null {
  if (!value) return null

  const index = value.indexOf(':')
  if (index < 1 || index === value.length - 1) return null

  const updatedAt = Number.parseInt(value.slice(0, index), 10)
  const sessionId = value.slice(index + 1)

  if (!Number.isFinite(updatedAt) || !sessionId) return null

  return { updatedAt, sessionId }
}

function encodeCursor(row: CursorParts): string {
  return `${row.updatedAt}:${row.sessionId}`
}
