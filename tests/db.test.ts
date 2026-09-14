import { describe, expect, it } from 'vitest'
import { createDatabase } from '../src/db/client.js'
import { createSessionStorage } from '../src/db/session-storage.js'
import { createUserRepository } from '../src/db/user-repository.js'

function createTestDb() {
  const db = createDatabase(':memory:')
  db.run('CREATE TABLE session (key text PRIMARY KEY, value text NOT NULL)')
  db.run('CREATE TABLE user (id integer PRIMARY KEY AUTOINCREMENT, telegram_id text NOT NULL UNIQUE, name text, created_at integer NOT NULL)')
  return db
}

describe('createSessionStorage', () => {
  it('persists, reads, and deletes sessions', () => {
    const storage = createSessionStorage(createTestDb())

    expect(storage.read('chat:1')).toBeUndefined()

    storage.write('chat:1', { foo: 'bar' })
    expect(storage.read('chat:1')).toEqual({ foo: 'bar' })

    storage.delete('chat:1')
    expect(storage.read('chat:1')).toBeUndefined()
  })
})

describe('createUserRepository', () => {
  it('upserts and reads a user', () => {
    const repo = createUserRepository(createTestDb())

    const created = repo.upsert('123', 'Alice')
    expect(created.telegramId).toBe('123')

    expect(repo.getByTelegramId('123')?.name).toBe('Alice')

    const updated = repo.upsert('123', 'Bob')
    expect(updated.name).toBe('Bob')
  })
})
