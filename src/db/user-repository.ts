import type { Database } from './client.js'
import { eq } from 'drizzle-orm'
import { userTable } from './schema.js'

export function createUserRepository(db: Database) {
  return {
    getByTelegramId(telegramId: string) {
      return db.select().from(userTable).where(eq(userTable.telegramId, telegramId)).get()
    },
    upsert(telegramId: string, name?: string) {
      return db.insert(userTable)
        .values({ telegramId, name, createdAt: Date.now() })
        .onConflictDoUpdate({ target: userTable.telegramId, set: { name } })
        .returning()
        .get()
    },
  }
}

export type UserRepository = ReturnType<typeof createUserRepository>
