import type { Database } from './client.js'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

export function runMigrations(db: Database) {
  migrate(db, { migrationsFolder: './drizzle' })
}
