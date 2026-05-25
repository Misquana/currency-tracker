import Database from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DB_PATH = join(__dirname, '..', 'data', 'rates.db')
const SCHEMA_PATH = join(__dirname, 'schema.sql')

export const db = new Database(DB_PATH)

const schema = readFileSync(SCHEMA_PATH, 'utf-8')
db.exec(schema)
