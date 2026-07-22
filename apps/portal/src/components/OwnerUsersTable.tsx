import { useEffect, useState } from 'react'
import {
  formatOwnerDate,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
  updateOwnerUser,
  type OwnerUserRow,
  type OwnerUserUpdate,
} from '@/lib/ownerDashboardApi'
import { createOwnerUser } from '@/lib/createOwnerUser'
import '@/styles/owner-users-create.css'

type OwnerUsersTableProps = {
  users: OwnerUserRow[]
  onUserUpdated: (user: OwnerUserRow) => void
  onUserCreated: (user: OwnerUserRow) => void
  onError: (message: string) => void
}

type CreateDraft = {
  fullName: string
  email: string
  phone: string
  password: string
  isAdmin: boolean
}

const EMPTY_CREATE: CreateDraft = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  isAdmin: false,
}

function draftFromUser(user: OwnerUserRow): OwnerUserUpdate {
  return {
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    consentAcceptedAt: user.consentAcceptedAt,
    consentVersion: user.consentVersion,
  }
}

export function OwnerUsersTable({
  users,
  onUserUpdated,
  onUserCreated,
  onError,
}: OwnerUsersTableProps) {
  const [editingUser, setEditingUser] = useState<OwnerUserRow | null>(null)
  const [draft, setDraft] = useState<OwnerUserUpdate | null>(null)
  const [consentLocal, setConsentLocal] = useState('')
  const [saving, setSaving] = useState(false)

  const [creating, setCreating] = useState(false)
  const [createDraft, setCreateDraft] = useState<CreateDraft>(EMPTY_CREATE)
  const [createSaving, setCreateSaving] = useState(false)
  const [createdPassword, setCreatedPassword] = useState<string | null>(null)
  const [createdEmail, setCreatedEmail] = useState('')

  useEffect(() => {
    if (!editingUser && !creating) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving && !createSaving) {
        if (editingUser) closeEditor()
        if (creating) closeCreate()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [editingUser, creating, saving, createSaving])

  function openEditor(user: OwnerUserRow) {
    setEditingUser(user)
    setDraft(draftFromUser(user))
    setConsentLocal(toDatetimeLocalValue(user.consentAcceptedAt))
  }

  function closeEditor() {
    setEditingUser(null)
    setDraft(null)
    setConsentLocal('')
  }

  function openCreate() {
    setCreateDraft(EMPTY_CREATE)
    setCreatedPassword(null)
    setCreatedEmail('')
    setCreating(true)
  }

  function closeCreate() {
    setCreating(false)
    setCreateDraft(EMPTY_CREATE)
    setCreatedPassword(null)
    setCreatedEmail('')
  }

  function patchDraft(patch: Partial<OwnerUserUpdate>) {
    setDraft((current) => (current ? { ...current, ...patch } : current))
  }

  function patchCreate(patch: Partial<CreateDraft>) {
    setCreateDraft((current) => ({ ...current, ...patch }))
  }

  async function handleSave() {
    if (!editingUser || !draft) return
    setSaving(true)
    try {
      const updated = await updateOwnerUser(editingUser.id, {
        ...draft,
        consentAcceptedAt: fromDatetimeLocalValue(consentLocal),
      })
      onUserUpdated(updated)
      closeEditor()
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Не удалось сохранить пользователя')
    } finally {
      setSaving(false)
    }
  }

  async function handleCreate() {
    if (!createDraft.fullName.trim() || !createDraft.email.trim()) {
      onError('Укажите имя и email')
      return
    }
    setCreateSaving(true)
    try {
      const result = await createOwnerUser({
        fullName: createDraft.fullName.trim(),
        email: createDraft.email.trim(),
        phone: createDraft.phone.trim(),
        password: createDraft.password,
        isAdmin: createDraft.isAdmin,
      })
      onUserCreated(result.user)
      setCreatedEmail(result.user.email)
      setCreatedPassword(result.passwordOnce)
      setCreateDraft(EMPTY_CREATE)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Не удалось создать пользователя')
    } finally {
      setCreateSaving(false)
    }
  }

  async function copyPassword() {
    if (!createdPassword) return
    try {
      await navigator.clipboard.writeText(createdPassword)
    } catch {
      onError('Не удалось скопировать пароль')
    }
  }

  return (
    <>
      <div className="owner-users-toolbar">
        <button type="button" className="owner-btn owner-btn--primary owner-btn--sm" onClick={openCreate}>
          Добавить пользователя
        </button>
      </div>

      <div className="owner-table-wrap">
        <table className="owner-table owner-table--light">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Согласие</th>
              <th>Регистрация</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="owner-table__empty">
                  Пользователей пока нет
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName || '—'}</td>
                  <td>{user.email || '—'}</td>
                  <td>{user.phone || '—'}</td>
                  <td>
                    <span className={`owner-badge${user.isAdmin ? ' is-admin' : ''}`}>
                      {user.isAdmin ? 'Админ' : 'Клиент'}
                    </span>
                  </td>
                  <td>
                    {user.consentAcceptedAt ? (
                      <span className="owner-user-consent">
                        {formatOwnerDate(user.consentAcceptedAt)}
                        {user.consentVersion ? ` · v${user.consentVersion}` : ''}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{formatOwnerDate(user.createdAt)}</td>
                  <td className="owner-table__actions">
                    <button
                      type="button"
                      className="owner-btn owner-btn--light owner-btn--sm"
                      onClick={() => openEditor(user)}
                    >
                      Изменить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {creating ? (
        <div
          className="owner-modal-backdrop"
          role="presentation"
          onClick={() => {
            if (!createSaving) closeCreate()
          }}
        >
          <div
            className="owner-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="owner-user-create-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="owner-modal__head">
              <div>
                <h2 id="owner-user-create-title">Новый пользователь</h2>
                <p className="owner-modal__subtitle">
                  Создаётся полный аккаунт Auth — клиент сможет войти в кабинет
                </p>
              </div>
              <button
                type="button"
                className="owner-modal__close"
                aria-label="Закрыть"
                disabled={createSaving}
                onClick={closeCreate}
              >
                ×
              </button>
            </header>

            {createdPassword ? (
              <div className="owner-create-success">
                <p>
                  Аккаунт <strong>{createdEmail}</strong> создан. Сохраните пароль — он больше не
                  покажется:
                </p>
                <div className="owner-create-success__password">
                  <code>{createdPassword}</code>
                  <button type="button" className="owner-btn owner-btn--light owner-btn--sm" onClick={() => void copyPassword()}>
                    Копировать
                  </button>
                </div>
                <footer className="owner-modal__footer">
                  <button type="button" className="owner-btn owner-btn--primary" onClick={closeCreate}>
                    Готово
                  </button>
                </footer>
              </div>
            ) : (
              <>
                <div className="owner-form-grid">
                  <label className="owner-field">
                    <span>Имя</span>
                    <input
                      type="text"
                      className="owner-input"
                      value={createDraft.fullName}
                      onChange={(event) => patchCreate({ fullName: event.target.value })}
                      autoFocus
                    />
                  </label>

                  <label className="owner-field">
                    <span>Email</span>
                    <input
                      type="email"
                      className="owner-input"
                      value={createDraft.email}
                      onChange={(event) => patchCreate({ email: event.target.value })}
                    />
                  </label>

                  <label className="owner-field">
                    <span>Телефон</span>
                    <input
                      type="tel"
                      className="owner-input"
                      value={createDraft.phone}
                      onChange={(event) => patchCreate({ phone: event.target.value })}
                    />
                  </label>

                  <label className="owner-field">
                    <span>Пароль (необязательно)</span>
                    <input
                      type="text"
                      className="owner-input"
                      placeholder="Сгенерируется автоматически"
                      value={createDraft.password}
                      onChange={(event) => patchCreate({ password: event.target.value })}
                      autoComplete="new-password"
                    />
                  </label>

                  <label className="owner-field owner-field--checkbox">
                    <input
                      type="checkbox"
                      checked={createDraft.isAdmin}
                      onChange={(event) => patchCreate({ isAdmin: event.target.checked })}
                    />
                    <span>Администратор (is_admin)</span>
                  </label>
                </div>

                <p className="owner-modal__hint">
                  Если пароль не указан, система сгенерирует его и покажет один раз после создания.
                </p>

                <footer className="owner-modal__footer">
                  <button
                    type="button"
                    className="owner-btn owner-btn--light"
                    disabled={createSaving}
                    onClick={closeCreate}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    className="owner-btn owner-btn--primary"
                    disabled={createSaving}
                    onClick={() => void handleCreate()}
                  >
                    {createSaving ? 'Создание…' : 'Создать аккаунт'}
                  </button>
                </footer>
              </>
            )}
          </div>
        </div>
      ) : null}

      {editingUser && draft ? (
        <div
          className="owner-modal-backdrop"
          role="presentation"
          onClick={() => {
            if (!saving) closeEditor()
          }}
        >
          <div
            className="owner-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="owner-user-edit-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="owner-modal__head">
              <div>
                <h2 id="owner-user-edit-title">Редактирование пользователя</h2>
                <p className="owner-modal__subtitle">ID: {editingUser.id}</p>
              </div>
              <button
                type="button"
                className="owner-modal__close"
                aria-label="Закрыть"
                disabled={saving}
                onClick={closeEditor}
              >
                ×
              </button>
            </header>

            <div className="owner-form-grid">
              <label className="owner-field">
                <span>Имя</span>
                <input
                  type="text"
                  className="owner-input"
                  value={draft.fullName}
                  onChange={(event) => patchDraft({ fullName: event.target.value })}
                />
              </label>

              <label className="owner-field">
                <span>Email</span>
                <input
                  type="email"
                  className="owner-input"
                  value={draft.email}
                  onChange={(event) => patchDraft({ email: event.target.value })}
                />
              </label>

              <label className="owner-field">
                <span>Телефон</span>
                <input
                  type="tel"
                  className="owner-input"
                  value={draft.phone}
                  onChange={(event) => patchDraft({ phone: event.target.value })}
                />
              </label>

              <label className="owner-field owner-field--checkbox">
                <input
                  type="checkbox"
                  checked={draft.isAdmin}
                  onChange={(event) => patchDraft({ isAdmin: event.target.checked })}
                />
                <span>Администратор (is_admin)</span>
              </label>

              <label className="owner-field">
                <span>Согласие принято</span>
                <input
                  type="datetime-local"
                  className="owner-input"
                  value={consentLocal}
                  onChange={(event) => setConsentLocal(event.target.value)}
                />
              </label>

              <label className="owner-field">
                <span>Версия согласия</span>
                <input
                  type="text"
                  className="owner-input"
                  placeholder="например, 1.0"
                  value={draft.consentVersion}
                  onChange={(event) => patchDraft({ consentVersion: event.target.value })}
                />
              </label>

              <div className="owner-field owner-field--readonly">
                <span>Регистрация</span>
                <p>{formatOwnerDate(editingUser.createdAt)}</p>
              </div>

              <div className="owner-field owner-field--readonly">
                <span>Обновлено</span>
                <p>{formatOwnerDate(editingUser.updatedAt)}</p>
              </div>
            </div>

            <p className="owner-modal__hint">
              Email сохраняется в профиле. Для смены логина в Supabase Auth потребуется отдельная
              операция в консоли.
            </p>

            <footer className="owner-modal__footer">
              <button
                type="button"
                className="owner-btn owner-btn--light"
                disabled={saving}
                onClick={closeEditor}
              >
                Отмена
              </button>
              <button
                type="button"
                className="owner-btn owner-btn--primary"
                disabled={saving}
                onClick={() => void handleSave()}
              >
                {saving ? 'Сохранение…' : 'Сохранить'}
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  )
}
