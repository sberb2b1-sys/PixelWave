import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppProvider'
import { DEFAULT_CONFIG } from '@/lib/defaults'
import type { CalculatorConfig } from '@/types/app'
import '@/styles/interactive.css'

export default function AdminSettings() {
  const { config, updateConfig, resetConfig } = useApp()
  const [draft, setDraft] = useState<CalculatorConfig>(config)
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateConfig(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    setDraft(DEFAULT_CONFIG)
    resetConfig()
  }

  return (
    <div className="ic-admin-layout">
      <aside className="ic-admin-sidebar">
        <div style={{ fontWeight: 700, marginBottom: 16, padding: '0 14px' }}>WebCalc Pro</div>
        <Link to="/dashboard">Дашборд / CRM</Link>
        <Link to="/admin" className="active">Настройки калькулятора</Link>
        <Link to="/calculator">Калькулятор на сайте</Link>
      </aside>

      <main className="ic-admin-main">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Настройки калькулятора</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Изменения сразу применяются на главной странице. Заявки сохраняются в CRM.
        </p>

        <div className="ic-admin-card">
          <h2>Общие параметры</h2>
          <div className="ic-field-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <label>
              Цена за доп. страницу (₽)
              <input type="number" value={draft.pricePerPage} onChange={(e) => setDraft({ ...draft, pricePerPage: Number(e.target.value) })} />
            </label>
            <label>
              Коэфф. дизайна
              <input type="number" step="0.05" value={draft.designRatio} onChange={(e) => setDraft({ ...draft, designRatio: Number(e.target.value) })} />
            </label>
            <label>
              Коэфф. SEO
              <input type="number" step="0.05" value={draft.seoRatio} onChange={(e) => setDraft({ ...draft, seoRatio: Number(e.target.value) })} />
            </label>
            <label>
              Страниц по умолчанию
              <input type="number" value={draft.defaultPages} onChange={(e) => setDraft({ ...draft, defaultPages: Number(e.target.value) })} />
            </label>
            <label>
              Срок (текст)
              <input value={draft.timelineText} onChange={(e) => setDraft({ ...draft, timelineText: e.target.value })} />
            </label>
          </div>
        </div>

        <div className="ic-admin-card">
          <h2>Типы сайтов</h2>
          {draft.siteTypes.map((type, i) => (
            <div key={type.id} className="ic-field-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr', marginBottom: 12 }}>
              <label>
                Название
                <input value={type.title} onChange={(e) => {
                  const siteTypes = [...draft.siteTypes]
                  siteTypes[i] = { ...type, title: e.target.value }
                  setDraft({ ...draft, siteTypes })
                }} />
              </label>
              <label>
                База (₽)
                <input type="number" value={type.basePrice} onChange={(e) => {
                  const siteTypes = [...draft.siteTypes]
                  siteTypes[i] = { ...type, basePrice: Number(e.target.value) }
                  setDraft({ ...draft, siteTypes })
                }} />
              </label>
              <label>
                Разработка база (₽)
                <input type="number" value={type.devBase} onChange={(e) => {
                  const siteTypes = [...draft.siteTypes]
                  siteTypes[i] = { ...type, devBase: Number(e.target.value) }
                  setDraft({ ...draft, siteTypes })
                }} />
              </label>
            </div>
          ))}
        </div>

        <div className="ic-row-actions">
          <button type="button" className="ic-btn-save" onClick={save}>
            {saved ? 'Сохранено ✓' : 'Сохранить настройки'}
          </button>
          <button type="button" className="ic-btn-secondary" onClick={reset}>Сбросить</button>
          <Link to="/calculator" className="ic-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            Проверить на сайте
          </Link>
        </div>
      </main>
    </div>
  )
}
