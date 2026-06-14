import express from 'express'
import cors from 'cors'
import { randomUUID } from 'node:crypto'
import { db } from './db.mjs'
import { sendLeadNotification } from './email.mjs'

const app = express()
const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || '127.0.0.1'

app.use(cors())
app.use(express.json({ limit: '2mb' }))

function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all()
  const out = {}
  for (const row of rows) {
    try {
      out[row.key] = JSON.parse(row.value)
    } catch {
      out[row.key] = row.value
    }
  }
  return out
}

function mapLead(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    contact: row.contact,
    comment: row.comment,
    siteTypeId: row.site_type_id,
    siteTypeTitle: row.site_type_title,
    pages: row.pages,
    featureIds: JSON.parse(row.feature_ids || '[]'),
    contentReady: row.content_ready,
    designId: row.design_id,
    designTitle: row.design_title,
    timeline: row.timeline,
    budget: row.budget,
    total: row.total,
    breakdown: JSON.parse(row.breakdown || '[]'),
    status: row.status,
    createdAt: row.created_at,
  }
}

function mapClient(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    projectType: row.project_type,
    budget: row.budget,
    comment: row.comment,
    source: row.source,
    createdAt: row.created_at,
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/clients', (_req, res) => {
  const rows = db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all()
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all().map(mapLead)

  const manual = rows.map(mapClient)
  const byKey = new Map()

  for (const c of manual) {
    const key = c.email || c.phone || c.id
    byKey.set(key, {
      ...c,
      leadsCount: 0,
      totalSpent: c.budget,
      lastActivity: c.createdAt,
    })
  }

  for (const lead of leads) {
    const key = lead.email || lead.contact || lead.id
    const existing = byKey.get(key)
    if (existing) {
      existing.leadsCount += 1
      existing.totalSpent += lead.total || 0
      if (lead.createdAt > existing.lastActivity) existing.lastActivity = lead.createdAt
      if (!existing.projectType && lead.siteTypeTitle) existing.projectType = lead.siteTypeTitle
      continue
    }
    byKey.set(key, {
      id: `lead-${lead.id}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      projectType: lead.siteTypeTitle,
      budget: lead.total,
      comment: lead.comment,
      source: 'lead',
      createdAt: lead.createdAt,
      leadsCount: 1,
      totalSpent: lead.total || 0,
      lastActivity: lead.createdAt,
    })
  }

  res.json([...byKey.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
})

app.post('/api/clients', (req, res) => {
  const { name, email = '', phone = '', projectType = '', budget = 0, comment = '' } = req.body
  if (!name?.trim()) {
    res.status(400).json({ error: 'Name is required' })
    return
  }
  const id = randomUUID()
  const createdAt = new Date().toISOString()
  db.prepare(
    `INSERT INTO clients (id, name, email, phone, project_type, budget, comment, source, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'manual', ?)`,
  ).run(id, name.trim(), email, phone, projectType, Number(budget) || 0, comment, createdAt)
  const row = db.prepare('SELECT * FROM clients WHERE id = ?').get(id)
  res.status(201).json(mapClient(row))
})

app.delete('/api/clients/:id', (req, res) => {
  db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

app.get('/api/leads', (_req, res) => {
  const rows = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all()
  res.json(rows.map(mapLead))
})

const insertLeadStmt = db.prepare(
  `INSERT INTO leads (
    id, name, email, phone, contact, comment, site_type_id, site_type_title, pages,
    feature_ids, content_ready, design_id, design_title, timeline, budget, total,
    breakdown, status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
)

function insertLead(lead) {
  const id = lead.id || randomUUID()
  const createdAt = lead.createdAt || new Date().toISOString()
  insertLeadStmt.run(
    id,
    lead.name,
    lead.email || '',
    lead.phone || '',
    lead.contact || '',
    lead.comment || '',
    lead.siteTypeId || '',
    lead.siteTypeTitle || '',
    lead.pages || 0,
    JSON.stringify(lead.featureIds || []),
    lead.contentReady || 'full',
    lead.designId || '',
    lead.designTitle || '',
    lead.timeline || '',
    lead.budget || '',
    lead.total || 0,
    JSON.stringify(lead.breakdown || []),
    lead.status || 'new',
    createdAt,
  )
  const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id)
  return mapLead(row)
}

app.post('/api/leads', async (req, res) => {
  const { name, contact } = req.body
  if (!name?.trim() || !contact?.trim()) {
    res.status(400).json({ error: 'Name and contact are required' })
    return
  }

  const lead = insertLead(req.body)
  sendLeadNotification(lead).catch(() => {})
  res.status(201).json(lead)
})

app.put('/api/leads', (req, res) => {
  const leads = Array.isArray(req.body) ? req.body : []
  const del = db.prepare('DELETE FROM leads')
  const tx = db.transaction((items) => {
    del.run()
    for (const lead of items) {
      insertLead(lead)
    }
  })
  tx(leads)
  res.json({ ok: true, count: leads.length })
})

app.patch('/api/leads/:id', (req, res) => {
  const { status } = req.body
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, req.params.id)
  const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id)
  res.json(row ? mapLead(row) : null)
})

app.delete('/api/leads/:id', (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

app.get('/api/settings', (_req, res) => {
  res.json(getSettings())
})

app.put('/api/settings', (req, res) => {
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
  const tx = db.transaction((data) => {
    for (const [key, value] of Object.entries(data)) {
      upsert.run(key, JSON.stringify(value))
    }
  })
  tx(req.body)
  res.json(getSettings())
})

app.get('/api/analytics', (_req, res) => {
  const leads = db.prepare('SELECT * FROM leads').all().map(mapLead)
  const clients = db.prepare('SELECT * FROM clients').all().map(mapClient)

  const totalRevenue = leads.reduce((s, l) => s + (l.total || 0), 0)
  const newLeads = leads.filter((l) => l.status === 'new').length
  const inWork = leads.filter((l) => l.status === 'work').length
  const done = leads.filter((l) => l.status === 'done').length
  const totalLeads = leads.length
  const conversion = totalLeads > 0 ? Math.round((done / totalLeads) * 1000) / 10 : 0

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthLeads = leads.filter((l) => new Date(l.createdAt) >= monthStart)
  const monthRevenue = monthLeads.reduce((s, l) => s + (l.total || 0), 0)

  const byStatus = {
    new: leads.filter((l) => l.status === 'new').length,
    work: leads.filter((l) => l.status === 'work').length,
    discussion: leads.filter((l) => l.status === 'discussion').length,
    done: leads.filter((l) => l.status === 'done').length,
  }

  const bySiteType = leads.reduce((acc, l) => {
    const key = l.siteTypeTitle || 'Другое'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  res.json({
    totalRevenue,
    monthRevenue,
    newLeads,
    inWork,
    done,
    totalLeads,
    totalClients: clients.length + new Set(leads.map((l) => l.email || l.contact)).size,
    conversion,
    byStatus,
    bySiteType,
    recentLeads: leads.slice(0, 5),
  })
})

app.listen(PORT, HOST, () => {
  console.log(`API server running at http://${HOST}:${PORT}`)
})
