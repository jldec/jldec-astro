import { env } from 'cloudflare:workers'
import { unflatten } from 'devalue'

const DEFAULT_BINDING_NAME = 'SESSIONS'
const DEFAULT_OBJECT_NAME = 'SESSIONS'

export interface SessionStoreConfig {
  binding?: string
  objectName?: string
}

export interface StoredSession {
  sessionId: string
  updatedAt: number
  value: string
}

export interface StoredSessionId {
  sessionId: string
  updatedAt: number
}

export interface StoredSessionPage {
  sessions: StoredSession[]
  nextCursor: string | null
}

export interface StoredSessionIdPage {
  sessions: StoredSessionId[]
  nextCursor: string | null
}

export interface StoredSessionSummary extends StoredSessionId {
  city: string | null
  userAgent: string | null
}

export interface StoredSessionSummaryPage {
  sessions: StoredSessionSummary[]
  nextCursor: string | null
}

type SessionStoreNamespace = DurableObjectNamespace

function getNamespace(binding = DEFAULT_BINDING_NAME): SessionStoreNamespace {
  const namespace = (env as Cloudflare.Env & Record<string, unknown>)[binding]

  if (!namespace || typeof (namespace as SessionStoreNamespace).idFromName !== 'function') {
    throw new Error(`Missing Durable Object binding "${binding}"`)
  }

  return namespace as SessionStoreNamespace
}

function getStub(config: SessionStoreConfig = {}) {
  const binding = config.binding ?? DEFAULT_BINDING_NAME
  const objectName = config.objectName ?? DEFAULT_OBJECT_NAME
  const namespace = getNamespace(binding)
  const id = namespace.idFromName(objectName)
  return namespace.get(id)
}

async function fetchStore<T>(path: string, init?: RequestInit, config?: SessionStoreConfig): Promise<T> {
  const stub = getStub(config)
  const response = await stub.fetch(`https://session-store${path}`, init)

  if (!response.ok) {
    throw new Error(`Session store request failed: ${response.status} ${response.statusText}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export async function getStoredSession(sessionId: string, config?: SessionStoreConfig): Promise<StoredSession | null> {
  const encoded = encodeURIComponent(sessionId)
  const { session } = await fetchStore<{ session: StoredSession | null }>(`/session/${encoded}`, undefined, config)
  return session
}

export async function putStoredSession(sessionId: string, value: string, config?: SessionStoreConfig): Promise<void> {
  const encoded = encodeURIComponent(sessionId)
  await fetchStore<void>(
    `/session/${encoded}`,
    {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value })
    },
    config
  )
}

export async function deleteStoredSession(sessionId: string, config?: SessionStoreConfig): Promise<void> {
  const encoded = encodeURIComponent(sessionId)
  await fetchStore<void>(
    `/session/${encoded}`,
    {
      method: 'DELETE'
    },
    config
  )
}

export async function listStoredSessions(cursor?: string | null, limit = 20): Promise<StoredSessionPage> {
  const query = new URLSearchParams()
  if (cursor) query.set('cursor', cursor)
  query.set('limit', String(limit))

  return fetchStore<StoredSessionPage>(`/sessions?${query.toString()}`)
}

export async function listStoredSessionIds(cursor?: string | null, limit = 500): Promise<StoredSessionIdPage> {
  const query = new URLSearchParams()
  if (cursor) query.set('cursor', cursor)
  query.set('limit', String(limit))

  return fetchStore<StoredSessionIdPage>(`/session-ids?${query.toString()}`)
}

export async function listStoredSessionSummaries(
  cursor?: string | null,
  limit = 500
): Promise<StoredSessionSummaryPage> {
  const page = await listStoredSessions(cursor, limit)

  return {
    nextCursor: page.nextCursor,
    sessions: page.sessions.map((session) => {
      const parsed = parseStoredValue(session.value)
      const { city, userAgent } = extractClientMeta(parsed)

      return {
        sessionId: session.sessionId,
        updatedAt: session.updatedAt,
        city,
        userAgent
      }
    })
  }
}

export function parseStoredValue(value: string): unknown {
  try {
    const parsed = JSON.parse(value)

    try {
      const devalued = unflatten(parsed, {
        URL: (href: string) => new URL(href)
      })

      return normalizeForJson(devalued)
    } catch {
      return normalizeForJson(parsed)
    }
  } catch {
    return value
  }
}

function normalizeForJson(value: unknown, seen = new WeakMap<object, unknown>()): unknown {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (value instanceof URL) {
    return value.toString()
  }

  if (Array.isArray(value)) {
    if (seen.has(value)) return seen.get(value)

    const output: unknown[] = []
    seen.set(value, output)

    for (const item of value) {
      output.push(normalizeForJson(item, seen))
    }

    return output
  }

  if (value instanceof Map) {
    if (seen.has(value)) return seen.get(value)

    const output: Record<string, unknown> = {}
    seen.set(value, output)

    for (const [key, item] of value.entries()) {
      output[String(key)] = normalizeForJson(item, seen)
    }

    return output
  }

  if (seen.has(value)) return seen.get(value)

  const output: Record<string, unknown> = {}
  seen.set(value, output)

  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    output[key] = normalizeForJson(item, seen)
  }

  return output
}

function extractClientMeta(value: unknown): { city: string | null; userAgent: string | null } {
  if (!value || typeof value !== 'object') {
    return { city: null, userAgent: null }
  }

  const root = value as Record<string, unknown>
  const clientMeta = unwrapSessionEntry(root.clientMeta)

  if (!clientMeta || typeof clientMeta !== 'object') {
    return { city: null, userAgent: null }
  }

  const meta = clientMeta as Record<string, unknown>
  const city = typeof meta.city === 'string' && meta.city.length > 0 ? meta.city : null
  const userAgent = typeof meta.userAgent === 'string' && meta.userAgent.length > 0 ? meta.userAgent : null

  return { city, userAgent }
}

function unwrapSessionEntry(value: unknown): unknown {
  if (!value || typeof value !== 'object') {
    return value
  }

  const entry = value as Record<string, unknown>
  return Object.prototype.hasOwnProperty.call(entry, 'data') ? entry.data : value
}
