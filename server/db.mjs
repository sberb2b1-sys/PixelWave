import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'data.sqlite')

export const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    project_type TEXT DEFAULT '',
    budget INTEGER DEFAULT 0,
    comment TEXT DEFAULT '',
    source TEXT DEFAULT 'manual',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    contact TEXT DEFAULT '',
    comment TEXT DEFAULT '',
    site_type_id TEXT DEFAULT '',
    site_type_title TEXT DEFAULT '',
    pages INTEGER DEFAULT 0,
    feature_ids TEXT DEFAULT '[]',
    content_ready TEXT DEFAULT 'full',
    design_id TEXT DEFAULT '',
    design_title TEXT DEFAULT '',
    timeline TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    total INTEGER DEFAULT 0,
    breakdown TEXT DEFAULT '[]',
    status TEXT DEFAULT 'new',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`)

const defaultSettings = {
  profileName: 'Алексей Кузнецов',
  profileEmail: 'aleksey@webcalcpro.ru',
  profilePhone: '+7 999 123-45-67',
}

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)')
for (const [key, value] of Object.entries(defaultSettings)) {
  insertSetting.run(key, JSON.stringify(value))
}
