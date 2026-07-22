import { useCallback, useEffect, useState } from 'react'
import { OwnerUsersTable } from '@/components/OwnerUsersTable'
import {
  fetchOwnerUsers,
  type OwnerUserRow,
} from '@/lib/ownerDashboardApi'
import { supabase } from '@/lib/supabase'
import '@/styles/owner-users-create.css'

/**
 * Owner users view — merge `handleUserCreated` + OwnerUsersTable props into the
 * full OwnerDashboardPage in ae-it-platform (apps/portal/src/pages/OwnerDashboardPage.tsx).
 */
export default function OwnerDashboardPage() {
  const [users, setUsers] = useState<OwnerUserRow[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const reloadUsers = useCallback(async () => {
    const nextUsers = await fetchOwnerUsers()
    setUsers(nextUsers)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function boot() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        if (!cancelled) {
          setLoadError('Войдите как администратор')
          setLoading(false)
        }
        return
      }
      try {
        await reloadUsers()
        if (!cancelled) setLoadError(null)
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить пользователей')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [reloadUsers])

  function handleUserUpdated(user: OwnerUserRow) {
    setUsers((current) => current.map((row) => (row.id === user.id ? user : row)))
    setLoadError(null)
  }

  function handleUserCreated(user: OwnerUserRow) {
    setUsers((current) => [user, ...current.filter((row) => row.id !== user.id)])
    setLoadError(null)
  }

  if (loading) {
    return (
      <div className="owner-layout owner-layout--centered">
        <p>Загрузка панели управления…</p>
      </div>
    )
  }

  return (
    <div className="owner-layout">
      <header className="owner-topbar">
        <h1>Пользователи</h1>
        <button type="button" className="owner-btn owner-btn--light" onClick={() => void reloadUsers()}>
          Обновить
        </button>
      </header>

      {loadError ? (
        <div className="owner-alert owner-alert--light" role="alert">
          {loadError}
        </div>
      ) : null}

      <section className="owner-panel owner-panel--light owner-panel--table" aria-labelledby="owner-users-title">
        <header className="owner-panel__head">
          <div>
            <h2 id="owner-users-title">Пользователи</h2>
            <p className="owner-panel__subtitle owner-panel__subtitle--light">
              Зарегистрированные аккаунты платформы
            </p>
          </div>
          <span className="owner-panel__count owner-panel__count--light">{users.length}</span>
        </header>
        <OwnerUsersTable
          users={users}
          onUserUpdated={handleUserUpdated}
          onUserCreated={handleUserCreated}
          onError={(message) => setLoadError(message)}
        />
      </section>
    </div>
  )
}
