import type { StorageAdapter } from 'grammy'
import type { SessionData } from '#root/bot/context.js'
import type { Database } from './client.js'
import { eq } from 'drizzle-orm'
import { sessionTable } from './schema.js'

export function createSessionStorage(db: Database): StorageAdapter<SessionData> {
  return {
    read(key) {
      const row = db.select().from(sessionTable).where(eq(sessionTable.key, key)).get()
      return row ? JSON.parse(row.value) as SessionData : undefined
    },
    write(key, value) {
      const json = JSON.stringify(value)
      db.insert(sessionTable)
        .values({ key, value: json })
        .onConflictDoUpdate({ target: sessionTable.key, set: { value: json } })
        .run()
    },
    delete(key) {
      db.delete(sessionTable).where(eq(sessionTable.key, key)).run()
    },
  }
}
