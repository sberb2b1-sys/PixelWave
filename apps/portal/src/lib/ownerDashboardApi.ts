import { supabase } from '@/lib/supabase'

export type OwnerUserRow = {
  id: string
  email: string
  fullName: string
  phone: string
  isAdmin: boolean
  consentAcceptedAt: string | null
  consentVersion: string
  createdAt: string
  updatedAt: string
}

export type OwnerUserUpdate = {
  fullName: string
  email: string
  phone: string
  isAdmin: boolean
  consentAcceptedAt: string | null
  consentVersion: string
}

export type CreateOwnerUserInput = {
  fullName: string
  email: string
  phone?: string
  password?: string
  isAdmin?: boolean
}

export type CreateOwnerUserResult = {
  user: OwnerUserRow
  passwordOnce: string
  passwordGenerated: boolean
}

const USERS_SELECT =
  'id,email,full_name,phone,is_admin,consent_accepted_at,consent_version,created_at,updated_at'

function mapUserRow(row: Record<string, unknown>): OwnerUserRow {
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

export function formatOwnerDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function toDatetimeLocalValue(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export async function fetchOwnerUsers(): Promise<OwnerUserRow[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(USERS_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message || 'Не удалось загрузить пользователей')
  return (data ?? []).map((row) => mapUserRow(row as Record<string, unknown>))
}

export async function updateOwnerUser(id: string, patch: OwnerUserUpdate): Promise<OwnerUserRow> {
  const payload = {
    full_name: patch.fullName.trim(),
    email: patch.email.trim() || null,
    phone: patch.phone.trim(),
    is_admin: patch.isAdmin,
    consent_accepted_at: patch.consentAcceptedAt || null,
    consent_version: patch.consentVersion.trim() || null,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', id)
    .select(USERS_SELECT)

  if (error) throw new Error(error.message || 'Не удалось сохранить пользователя')
  if (!data?.length) {
    throw new Error(
      'Не удалось сохранить профиль: нет прав на обновление чужих пользователей. Примените миграцию 012_profiles_admin_update.sql на Supabase.',
    )
  }
  return mapUserRow(data[0] as Record<string, unknown>)
}

/** Creates a full Supabase Auth account via Node API (service role on server). */
export async function createOwnerUser(input: CreateOwnerUserInput): Promise<CreateOwnerUserResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('Сессия истекла. Войдите снова.')
  }

  const response = await fetch('/api/owner/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone || '',
      password: input.password || '',
      isAdmin: Boolean(input.isAdmin),
    }),
  })

  let payload: {
    error?: string
    user?: OwnerUserRow
    passwordOnce?: string
    passwordGenerated?: boolean
  } = {}
  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok) {
    throw new Error(payload.error || `Не удалось создать пользователя (${response.status})`)
  }
  if (!payload.user) {
    throw new Error('Сервер не вернул созданного пользователя')
  }

  return {
    user: payload.user,
    passwordOnce: payload.passwordOnce || input.password || '',
    passwordGenerated: Boolean(payload.passwordGenerated),
  }
}
