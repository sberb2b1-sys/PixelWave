/**
 * When merging into ae-it-platform apps/create/server/index.mjs, add:
 *
 *   import './load-env.mjs'
 *   import { registerOwnerUserRoutes } from './ownerUsers.mjs'
 *   registerOwnerUserRoutes(app)
 *
 * This entry is a standalone API bootstrap for local testing of owner-users only.
 */
import './load-env.mjs'
import express from 'express'
import cors from 'cors'
import { registerOwnerUserRoutes } from './ownerUsers.mjs'

const app = express()
const PORT = Number(process.env.PORT || 3001)
const HOST = process.env.HOST || '127.0.0.1'

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    ownerUsers: true,
    supabaseUrl: Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  })
})

registerOwnerUserRoutes(app)

app.listen(PORT, HOST, () => {
  console.log(`Owner-users API at http://${HOST}:${PORT}`)
})
