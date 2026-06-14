import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppProvider'
import { formatPrice } from '@/lib/calculator'
import type { LeadStatus } from '@/types/app'
import '@/styles/Frame2146.css'
import '@/styles/interactive.css'

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Новая',
  work: 'В работе',
  discussion: 'Обсуждение',
  done: 'Завершено',
}

type Filter = 'all' | LeadStatus

export default function DashboardPage() {
  const { leads, updateLeadStatus, deleteLead } = useApp()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return leads
    return leads.filter((l) => l.status === filter)
  }, [leads, filter])

  const stats = useMemo(() => {
    const newCount = leads.filter((l) => l.status === 'new').length
    const revenue = leads.reduce((s, l) => s + l.total, 0)
    const inWork = leads.filter((l) => l.status === 'work').length
    return { newCount, revenue, inWork, total: leads.length }
  }, [leads])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const initials = (name: string) =>
    name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="scroll-container">
      <div className="Pixso-frame-2_146" style={{ minHeight: '100vh', height: 'auto' }}>
        <div className="Pixso-frame-2_147">
          <div className="frame-content-2_147">
            <Link to="/calculator" className="ic-nav-link Pixso-frame-2_148" style={{ textDecoration: 'none' }}>
              <div className="frame-content-2_148">
                <div className="Pixso-frame-2_149"><p className="Pixso-paragraph-2_150">W</p></div>
                <div className="Pixso-frame-2_151">
                  <p className="Pixso-paragraph-2_152">WebCalc Pro</p>
                  <p className="Pixso-paragraph-2_153">Панель управления</p>
                </div>
              </div>
            </Link>
            <div className="Pixso-frame-2_154" />
            <p className="Pixso-paragraph-2_155">ГЛАВНОЕ</p>

            <div className="stroke-wrapper-2_156">
              <div className="Pixso-frame-2_156">
                <div className="frame-content-2_156">
                  <p className="Pixso-paragraph-2_162">Дашборд</p>
                </div>
              </div>
              <div className="stroke-2_156" />
            </div>

            <Link to="/dashboard" className="ic-nav-link Pixso-frame-2_165" style={{ textDecoration: 'none', width: '100%' }}>
              <div className="frame-content-2_165">
                <div className="Pixso-vector-2_166" />
                <p className="Pixso-paragraph-2_169">Заявки</p>
              </div>
            </Link>

            <Link to="/admin" className="ic-nav-link Pixso-frame-2_180" style={{ textDecoration: 'none', width: '100%' }}>
              <div className="frame-content-2_180">
                <div className="Pixso-vector-2_181" />
                <p className="Pixso-paragraph-2_184">Настройки</p>
              </div>
            </Link>

            <div className="Pixso-frame-2_186">
              <div className="frame-content-2_186">
                <div className="Pixso-frame-2_187"><p className="Pixso-paragraph-2_188">АК</p></div>
                <div className="Pixso-frame-2_189">
                  <p className="Pixso-paragraph-2_190">Екатерина Андриянова</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="Pixso-frame-2_192" style={{ flex: 1, height: 'auto', minHeight: '100vh' }}>
          <div className="frame-content-2_192">
            <div className="Pixso-frame-2_193">
              <div className="frame-content-2_193">
                <div className="Pixso-frame-2_194">
                  <p className="Pixso-paragraph-2_195">Добро пожаловать, Екатерина</p>
                  <p className="Pixso-paragraph-2_196">
                    {stats.newCount} новых заявок · всего {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, padding: '0 32px 24px', width: '100%' }}>
              {[
                { label: 'Новые заявки', value: String(stats.newCount) },
                { label: 'Сумма заявок', value: formatPrice(stats.revenue) },
                { label: 'В работе', value: String(stats.inWork) },
                { label: 'Всего', value: String(stats.total) },
              ].map((s) => (
                <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 8px 32px rgba(26,32,44,0.08)' }}>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-dark)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '0 32px 32px', width: '100%' }}>
              <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(26,32,44,0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: 12 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-dark)' }}>Последние заявки</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(['all', 'new', 'work', 'discussion'] as Filter[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        className="ic-btn"
                        style={{
                          padding: '6px 12px',
                          borderRadius: 99,
                          fontSize: 12,
                          border: '1px solid var(--color-border)',
                          background: filter === f ? '#ede9fe' : 'var(--color-bg)',
                          color: filter === f ? 'var(--color-primary)' : 'inherit',
                        }}
                        onClick={() => setFilter(f)}
                      >
                        {f === 'all' ? 'Все' : STATUS_LABELS[f as LeadStatus]}
                      </button>
                    ))}
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    Заявок пока нет. Отправьте тестовую с{' '}
                    <Link to="/calculator" style={{ color: 'var(--color-primary)' }}>калькулятора</Link>.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                          {['Клиент', 'Тип', 'Бюджет', 'Статус', 'Дата', ''].map((h) => (
                            <th key={h} style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', fontSize: 12 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((lead) => (
                          <tr key={lead.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#ede9fe', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                                  {initials(lead.name)}
                                </span>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{lead.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>{lead.siteTypeTitle} · {lead.pages} стр.</td>
                            <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatPrice(lead.total)}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <select
                                className="ic-status-select"
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              >
                                {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '12px 16px' }}>{formatDate(lead.createdAt)}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <button type="button" className="ic-btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => deleteLead(lead.id)}>
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/calculator" className="ic-nav-link">← К калькулятору</Link>
                <Link to="/admin" className="ic-nav-link">Настройки калькулятора →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
