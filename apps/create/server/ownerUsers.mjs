import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl() {
  return (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '')
}

function getServiceRoleKey() {
  return (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
}

function createServiceClient() {
  const url = getSupabaseUrl()
  const key = getServiceRoleKey()
  if (!url || !key) {
    const err = new Error(
      'Сервер не настроен для создания пользователей. Задайте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY.',
    )
    err.status = 503
    throw err
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function generatePassword(length = 14) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  const bytes = randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length]
  }
  return out
}

function readBearerToken(req) {
  const header = req.headers.authorization || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match ? match[1].trim() : ''
}

function mapAuthError(message) {
  const lower = String(message || '').toLowerCase()
  if (lower.includes('already been registered') || lower.includes('already registered') || lower.includes('user already exists')) {
    return 'Пользователь с таким email уже зарегистрирован'
  }
  if (lower.includes('invalid email')) {
    return 'Некорректный email'
  }
  if (lower.includes('password')) {
    return 'Пароль не соответствует требованиям безопасности'
  }
  return message || 'Не удалось создать пользователя'
}

function mapProfileRow(row) {
  return {
    id: String(row.id),
    email: row.email ? String(row.email) : '',
    fullName: row.full_name ? String(row.full_name) : '',
    phone: row.phone ? String(row.phone) : '',
    isAdmin: Boolean(row.is_admin),
    consentAcceptedAt: row.consent_accepted_at ? String(row.consent_accepted_at) : null,
    consentVersion: row.consent_version ? String(row.consent_version) : '',
    createdAt: row.created_at ? String(row.created_at) : '',
    updatedAt: row.updated_at ? String(row.updated_at) : '',
  }
}

async function requirePlatformAdmin(req) {
  const jwt = readBearerToken(req)
  if (!jwt) {
    const err = new Error('Требуется авторизация')
    err.status = 401
    throw err
  }

  const admin = createServiceClient()
  const {
    data: { user },
    error: userError,
  } = await admin.auth.getUser(jwt)

  if (userError || !user) {
    const err = new Error('Сессия недействительна. Войдите снова.')
    err.status = 401
    throw err
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    const err = new Error(profileError.message || 'Не удалось проверить права администратора')
    err.status = 500
    throw err
  }

  if (!profile?.is_admin) {
    const err = new Error('Недостаточно прав. Нужен аккаунт администратора (is_admin).')
    err.status = 403
    throw err
  }

  return { admin, user }
}

/**
 * POST /api/owner/users
 * Body: { fullName, email, phone?, password?, isAdmin? }
 * Auth: Bearer <supabase access_token> of a platform admin
 */
export function registerOwnerUserRoutes(app) {
  app.post('/api/owner/users', async (req, res) => {
    try {
      const { admin } = await requirePlatformAdmin(req)

      const fullName = String(req.body?.fullName || '').trim()
      const email = String(req.body?.email || '').trim().toLowerCase()
      const phone = String(req.body?.phone || '').trim()
      const isAdmin = Boolean(req.body?.isAdmin)
      let password = String(req.body?.password || '')
      let passwordGenerated = false

      if (!email) {
        return res.status(400).json({ error: 'Укажите email' })
      }
      if (!fullName) {
        return res.status(400).json({ error: 'Укажите имя' })
      }

      if (!password) {
        password = generatePassword()
        passwordGenerated = true
      } else if (password.length < 8) {
        return res.status(400).json({ error: 'Пароль должен быть не короче 8 символов' })
      }

      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      })

      if (createError) {
        return res.status(400).json({ error: mapAuthError(createError.message) })
      }

      const userId = created.user?.id
      if (!userId) {
        return res.status(500).json({ error: 'Auth вернул пустого пользователя' })
      }

      const now = new Date().toISOString()
      const { data: profileRows, error: updateError } = await admin
        .from('profiles')
        .update({
          full_name: fullName,
          email,
          phone,
          is_admin: isAdmin,
          updated_at: now,
        })
        .eq('id', userId)
        .select(
          'id,email,full_name,phone,is_admin,consent_accepted_at,consent_version,created_at,updated_at',
        )

      if (updateError) {
        return res.status(500).json({
          error: updateError.message || 'Пользователь создан, но профиль не обновлён',
        })
      }

      let profile = profileRows?.[0]
      if (!profile) {
        const { data: inserted, error: insertError } = await admin
          .from('profiles')
          .upsert(
            {
              id: userId,
              full_name: fullName,
              email,
              phone,
              is_admin: isAdmin,
              updated_at: now,
            },
            { onConflict: 'id' },
          )
          .select(
            'id,email,full_name,phone,is_admin,consent_accepted_at,consent_version,created_at,updated_at',
          )

        if (insertError) {
          return res.status(500).json({
            error: insertError.message || 'Пользователь создан, но профиль не сохранён',
          })
        }
        profile = inserted?.[0]
      }

      return res.status(201).json({
        user: mapProfileRow(
          profile || {
            id: userId,
            email,
            full_name: fullName,
            phone,
            is_admin: isAdmin,
            consent_accepted_at: null,
            consent_version: '',
            created_at: now,
            updated_at: now,
          },
        ),
        passwordOnce: password,
        passwordGenerated,
      })
    } catch (error) {
      const status = error?.status || 500
      return res.status(status).json({
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      })
    }
  })

  /**
   * DELETE /api/owner/users/:id
   * Removes Auth user (profiles cascade via FK). Cannot delete yourself.
   */
  app.delete('/api/owner/users/:id', async (req, res) => {
    try {
      const { admin, user: actor } = await requirePlatformAdmin(req)
      const userId = String(req.params.id || '').trim()

      if (!userId) {
        return res.status(400).json({ error: 'Не указан id пользователя' })
      }
      if (userId === actor.id) {
        return res.status(400).json({ error: 'Нельзя удалить свой собственный аккаунт' })
      }

      const { error: deleteError } = await admin.auth.admin.deleteUser(userId)
      if (deleteError) {
        const msg = deleteError.message || 'Не удалось удалить пользователя'
        const lower = msg.toLowerCase()
        if (lower.includes('not found') || lower.includes('user not found')) {
          return res.status(404).json({ error: 'Пользователь не найден' })
        }
        return res.status(400).json({ error: msg })
      }

      return res.json({ ok: true, id: userId })
    } catch (error) {
      const status = error?.status || 500
      return res.status(status).json({
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      })
    }
  })
}
