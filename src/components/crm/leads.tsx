import { useMemo } from 'react'
import { useApp } from '@/context/AppProvider'
import { CrmDeleteButton, CrmRowActions, CrmStatusSelect } from '@/components/crm/CrmActions'
import { formatPrice } from '@/lib/calculator'
import type { Lead, LeadStatus } from '@/types/app'

type Filter = 'all' | LeadStatus

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

export function CrmLeadFilters({
  filter,
  onFilter,
}: {
  filter: Filter
  onFilter: (f: Filter) => void
}) {
  const { leads } = useApp()
  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      work: leads.filter((l) => l.status === 'work').length,
      done: leads.filter((l) => l.status === 'done').length,
    }),
    [leads],
  )

  const items: { key: Filter; label: string; frame: string; paragraph: string }[] = [
    { key: 'all', label: `Все (${counts.all})`, frame: 'Pixso-frame-9_345', paragraph: 'Pixso-paragraph-9_346' },
    { key: 'new', label: `Новые (${counts.new})`, frame: 'Pixso-frame-9_347', paragraph: 'Pixso-paragraph-9_348' },
    { key: 'work', label: `В работе (${counts.work})`, frame: 'Pixso-frame-9_349', paragraph: 'Pixso-paragraph-9_350' },
    { key: 'done', label: `Завершено (${counts.done})`, frame: 'Pixso-frame-9_351', paragraph: 'Pixso-paragraph-9_352' },
  ]

  return (
    <div className="Pixso-frame-9_344">
      <div className="frame-content-9_344">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`ic-btn ${item.frame}${filter === item.key ? ' ic-crm-filter-active' : ''}`}
            onClick={() => onFilter(item.key)}
          >
            <p className={item.paragraph}>{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export function CrmLeadTableRows({ leads }: { leads: Lead[] }) {
  const { updateLeadStatus, deleteLead } = useApp()

  const handleDelete = (lead: Lead) => {
    if (!window.confirm(`Удалить заявку от ${lead.name}?`)) return
    deleteLead(lead.id)
  }

  if (leads.length === 0) {
    return (
      <div className="stroke-wrapper-9_365">
        <div className="Pixso-frame-9_365">
          <div className="frame-content-9_365" style={{ padding: '24px 16px' }}>
            <p className="Pixso-paragraph-9_370">Заявок пока нет. Отправьте тестовую с калькулятора.</p>
          </div>
        </div>
        <div className="stroke-9_365" />
      </div>
    )
  }

  return (
    <>
      {leads.map((lead) => (
        <div key={lead.id} className="stroke-wrapper-9_365">
          <div className="Pixso-frame-9_365">
            <div className="frame-content-9_365">
              <div className="Pixso-frame-9_366">
                <div className="frame-content-9_366">
                  <div className="Pixso-frame-9_367">
                    <div className="frame-content-9_367">
                      <p className="Pixso-paragraph-9_368">{initials(lead.name)}</p>
                    </div>
                  </div>
                  <div className="Pixso-frame-9_369">
                    <p className="Pixso-paragraph-9_370">{lead.name}</p>
                    <p className="Pixso-paragraph-9_371">{lead.phone || lead.email || lead.contact}</p>
                  </div>
                </div>
              </div>
              <div className="Pixso-frame-9_372">
                <div className="frame-content-9_372">
                  <p className="Pixso-paragraph-9_373">{lead.siteTypeTitle}</p>
                </div>
              </div>
              <div className="Pixso-frame-9_374">
                <div className="frame-content-9_374">
                  <p className="Pixso-paragraph-9_375">{formatPrice(lead.total)}</p>
                </div>
              </div>
              <div className="Pixso-frame-9_376">
                <div className="frame-content-9_376">
                  <p className="Pixso-paragraph-9_377">{formatDate(lead.createdAt)}</p>
                </div>
              </div>
              <div className="Pixso-frame-9_378 ic-crm-actions-col">
                <CrmRowActions>
                  <CrmStatusSelect value={lead.status} onChange={(status) => updateLeadStatus(lead.id, status)} />
                  <CrmDeleteButton onClick={() => handleDelete(lead)} />
                </CrmRowActions>
              </div>
            </div>
          </div>
          <div className="stroke-9_365" />
        </div>
      ))}
    </>
  )
}

export function useCrmLeads(filter: Filter) {
  const { leads } = useApp()
  return useMemo(() => {
    if (filter === 'all') return leads
    return leads.filter((l) => l.status === filter)
  }, [leads, filter])
}

export function useLeadCounts() {
  const { leads } = useApp()
  return useMemo(() => leads.length, [leads])
}
