import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const sessionTable = sqliteTable('session', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
})

export const userTable = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  telegramId: text('telegram_id').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at').notNull(),
})
