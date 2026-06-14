import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppProvider'
import { CrmDeleteButton, CrmRowActions } from '@/components/crm/CrmActions'
import { formatPrice } from '@/lib/calculator'
import type { Client } from '@/types/app'
import Frame9849 from '@/views/Frame9849'
import '@/styles/Frame9429.css'
import '@/styles/interactive.css'

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ClientRow({ client }: { client: Client }) {
  const { deleteClient } = useApp()

  const handleDelete = () => {
    if (!window.confirm(`Удалить клиента ${client.name}?`)) return
    deleteClient(client.id)
  }

  return (
    <div className="stroke-wrapper-9_513">
      <div className="Pixso-frame-9_513">
        <div className="frame-content-9_513">
          <div className="Pixso-frame-9_514">
            <div className="frame-content-9_514">
              <div className="Pixso-frame-9_515">
                <div className="frame-content-9_515">
                  <p className="Pixso-paragraph-9_516">{initials(client.name)}</p>
                </div>
              </div>
              <div className="Pixso-frame-9_517">
                <p className="Pixso-paragraph-9_518">{client.name}</p>
                <p className="Pixso-paragraph-9_519">
                  {client.source === 'lead' ? client.projectType || 'Из заявки' : 'Добавлен вручную'}
                </p>
              </div>
            </div>
          </div>
          <div className="Pixso-frame-9_520">
            <div className="frame-content-9_520">
              <p className="Pixso-paragraph-9_521">{client.email || '—'}</p>
              <p className="Pixso-paragraph-9_522">{client.phone || '—'}</p>
            </div>
          </div>
          <div className="Pixso-frame-9_523">
            <div className="frame-content-9_523">
              <p className="Pixso-paragraph-9_524">{client.leadsCount ?? (client.source === 'lead' ? 1 : 0)}</p>
            </div>
          </div>
          <div className="Pixso-frame-9_525">
            <div className="frame-content-9_525">
              <p className="Pixso-paragraph-9_526">{formatPrice(client.totalSpent ?? client.budget)}</p>
            </div>
          </div>
          <div className="Pixso-frame-9_527">
            <div className="frame-content-9_527">
              <p className="Pixso-paragraph-9_528">{formatDate(client.lastActivity ?? client.createdAt)}</p>
            </div>
          </div>
          <div className="Pixso-frame-9_527 ic-crm-actions-col">
            <CrmRowActions>
              <CrmDeleteButton onClick={handleDelete} />
            </CrmRowActions>
          </div>
        </div>
      </div>
      <div className="stroke-9_513" />
    </div>
  )
}

export default function ClientsPanel() {
  const { clients } = useApp()
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
    )
  }, [clients, search])

  return (
    <>
      <div className="Pixso-frame-9_483">
        <div className="frame-content-9_483">
          <div className="Pixso-frame-9_484">
            <div className="frame-content-9_484">
              <div className="Pixso-frame-9_485">
                <p className="Pixso-paragraph-9_486">Клиенты</p>
                <p className="Pixso-paragraph-9_487">База клиентов: вручную и из заявок калькулятора</p>
              </div>
              <div className="Pixso-frame-9_488">
                <div className="stroke-wrapper-9_489">
                  <div className="Pixso-frame-9_489">
                    <div className="frame-content-9_489">
                      <div className="Pixso-vector-9_490" />
                      <input
                        className="ic-pixso-overlay-input Pixso-paragraph-9_493"
                        placeholder="Поиск клиента..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="stroke-9_489" />
                </div>
                <button type="button" className="ic-btn ic-new-client-trigger" onClick={() => setNewClientOpen(true)}>
                  <div className="Pixso-frame-9_494">
                    <div className="frame-content-9_494">
                      <div className="Pixso-vector-9_495" />
                      <p className="Pixso-paragraph-9_500">Добавить клиента</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="stroke-wrapper-9_501">
            <div className="Pixso-frame-9_501">
              <div className="frame-content-9_501">
                <div className="Pixso-frame-9_502">
                  <div className="frame-content-9_502">
                    <div className="Pixso-frame-9_503"><div className="frame-content-9_503"><p className="Pixso-paragraph-9_504">Клиент</p></div></div>
                    <div className="Pixso-frame-9_505"><div className="frame-content-9_505"><p className="Pixso-paragraph-9_506">Контакты</p></div></div>
                    <div className="Pixso-frame-9_507"><div className="frame-content-9_507"><p className="Pixso-paragraph-9_508">Заявок</p></div></div>
                    <div className="Pixso-frame-9_509"><div className="frame-content-9_509"><p className="Pixso-paragraph-9_510">Сумма</p></div></div>
                    <div className="Pixso-frame-9_511"><div className="frame-content-9_511"><p className="Pixso-paragraph-9_512">Последняя активность</p></div></div>
                    <div className="Pixso-frame-9_511 ic-crm-actions-col"><div className="frame-content-9_511"><p className="Pixso-paragraph-9_512">Действия</p></div></div>
                  </div>
                </div>
                {filtered.length === 0 ? (
                  <div className="stroke-wrapper-9_513">
                    <div className="Pixso-frame-9_513">
                      <div className="frame-content-9_513" style={{ padding: '24px 16px' }}>
                        <p className="Pixso-paragraph-9_518">Клиентов пока нет. Добавьте вручную или получите заявку с калькулятора.</p>
                      </div>
                    </div>
                    <div className="stroke-9_513" />
                  </div>
                ) : (
                  filtered.map((client) => <ClientRow key={client.id} client={client} />)
                )}
              </div>
            </div>
            <div className="stroke-9_501" />
          </div>
        </div>
      </div>
      {newClientOpen && <Frame9849 onClose={() => setNewClientOpen(false)} />}
    </>
  )
}
