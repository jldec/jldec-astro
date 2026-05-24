import { deleteStoredSession, getStoredSession, putStoredSession, type SessionStoreConfig } from './client'

export default function createSessionDriver(config: SessionStoreConfig = {}) {
  return {
    async getItem(key: string) {
      const session = await getStoredSession(key, config)
      return session?.value ?? null
    },

    async setItem(key: string, value: unknown) {
      if (typeof value !== 'string') {
        throw new Error('Astro session driver expected a string payload')
      }

      await putStoredSession(key, value, config)
    },

    async removeItem(key: string) {
      await deleteStoredSession(key, config)
    }
  }
}
