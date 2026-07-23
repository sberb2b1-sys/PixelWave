import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// apps/create/server → apps/create/.env, also repo-root .env when copied flat
const createRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(__dirname, '../..')

dotenv.config({ path: path.join(createRoot, '.env') })
dotenv.config({ path: path.join(repoRoot, '.env') })
dotenv.config({ path: path.join(repoRoot, '../.env') })
