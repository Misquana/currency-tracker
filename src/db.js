import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCHEMA_PATH = join(__dirname, 'schema.sql')

const DEFAULT_DB_PATH = join(__dirname, '..', 'data', 'rates.db')

export function createDatabase(dbPath = DEFAULT_DB_PATH) {
  const db = new Database(dbPath)
  db.pragma('foreign_keys = ON')
  const schema = readFileSync(SCHEMA_PATH, 'utf-8')
  db.exec(schema)
  return db
}

export const db = createDatabase()
