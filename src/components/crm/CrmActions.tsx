import type { LeadStatus } from '@/types/app'

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Новая',
  work: 'В работе',
  discussion: 'Обсуждение',
  done: 'Завершено',
}

export function CrmRowActions({ children }: { children: React.ReactNode }) {
  return <div className="ic-crm-row-actions">{children}</div>
}

export function CrmStatusSelect({
  value,
  onChange,
}: {
  value: LeadStatus
  onChange: (status: LeadStatus) => void
}) {
  return (
    <select
      className={`ic-crm-status-select is-${value}`}
      value={value}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      aria-label="Статус заявки"
    >
      {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  )
}

export function CrmDeleteButton({
  onClick,
  label = 'Удалить',
}: {
  onClick: () => void
  label?: string
}) {
  return (
    <button type="button" className="ic-btn ic-crm-btn-delete" onClick={onClick}>
      {label}
    </button>
  )
}
