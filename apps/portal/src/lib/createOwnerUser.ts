import { supabase } from '@/lib/supabase'
import type { OwnerUserRow } from '@/lib/ownerDashboardApi'

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

/**
 * Creates a full Supabase Auth account via create API (service role on server).
 * Requires the current session user to have profiles.is_admin.
 */
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

  let payload: { error?: string; user?: OwnerUserRow; passwordOnce?: string; passwordGenerated?: boolean } = {}
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
