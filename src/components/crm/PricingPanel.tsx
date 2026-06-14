import { useEffect, useState, type ReactNode } from 'react'
import { useApp } from '@/context/AppProvider'
import { DEFAULT_CONFIG } from '@/lib/defaults'
import type { CalculatorConfig, ContentReady } from '@/types/app'
import { PixsoButton } from '@/components/crm/PixsoField'
import '@/styles/Frame9274.css'
import '@/styles/Frame9722.css'
import '@/styles/interactive.css'

const CONTENT_LABELS: Record<Exclude<ContentReady, 'full'>, string> = {
  partial: 'Частично готов',
  none: 'Не готов',
}

function CrmCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="stroke-wrapper-9_353 ic-crm-pricing-card">
      <div className="Pixso-frame-9_353">
        <div className="frame-content-9_353">
          <div className="ic-crm-pricing-card-title">
            <p className="Pixso-paragraph-9_803">{title}</p>
          </div>
          {children}
        </div>
      </div>
      <div className="stroke-9_353" />
    </div>
  )
}

function PricingTable({
  columns,
  children,
}: {
  columns: string[]
  children: ReactNode
}) {
  return (
    <div className="ic-crm-pricing-table">
      <div
        className="ic-crm-pricing-table-header"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
      >
        {columns.map((col) => (
          <p key={col} className="Pixso-paragraph-9_356">{col}</p>
        ))}
      </div>
      {children}
    </div>
  )
}

function TableRow({ columns, children }: { columns: number; children: ReactNode }) {
  return (
    <div
      className="ic-crm-pricing-table-row"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  )
}

function NumInput({
  value,
  onChange,
  step,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
}) {
  return (
    <input
      type="number"
      step={step ?? 1}
      className="ic-crm-pricing-input"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  )
}

function ToggleBtn({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`ic-btn ic-crm-pricing-toggle${enabled ? ' is-on' : ''}`} onClick={onClick}>
      {enabled ? 'Вкл' : 'Выкл'}
    </button>
  )
}

export default function PricingPanel() {
  const { config, updateConfig, resetConfig } = useApp()
  const [draft, setDraft] = useState<CalculatorConfig>(config)
  const [saved, setSaved] = useState(false)

  useEffect(() => setDraft(config), [config])

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
    <div className="Pixso-frame-9_328">
      <div className="frame-content-9_328">
        <div className="Pixso-frame-9_329">
          <div className="frame-content-9_329">
            <div className="Pixso-frame-9_330">
              <p className="Pixso-paragraph-9_331">Прайс-лист</p>
              <p className="Pixso-paragraph-9_332">
                Все переменные, которые влияют на расчёт стоимости в калькуляторе
              </p>
            </div>
          </div>
        </div>

        <div className="ic-crm-pricing-hint">
          <p>
            Формула: дизайн = база × коэф. дизайна × множитель дизайна · разработка = база разработки +
            (страницы − 1) × цена страницы · SEO = база × коэф. SEO · + функционал · + доплата за контент
          </p>
        </div>

        <CrmCard title="1. Базовые цены по типам сайтов">
          <PricingTable columns={['Тип сайта', 'База дизайна (₽)', 'База разработки (₽)']}>
            {draft.siteTypes.map((type, i) => (
              <TableRow key={type.id} columns={3}>
                <p className="Pixso-paragraph-9_370">{type.title}</p>
                <NumInput
                  value={type.basePrice}
                  onChange={(basePrice) => {
                    const siteTypes = [...draft.siteTypes]
                    siteTypes[i] = { ...type, basePrice }
                    setDraft({ ...draft, siteTypes })
                  }}
                />
                <NumInput
                  value={type.devBase}
                  onChange={(devBase) => {
                    const siteTypes = [...draft.siteTypes]
                    siteTypes[i] = { ...type, devBase }
                    setDraft({ ...draft, siteTypes })
                  }}
                />
              </TableRow>
            ))}
          </PricingTable>
        </CrmCard>

        <CrmCard title="2. Цена за одну страницу (сверх базовой)">
          <div className="ic-crm-pricing-field-row">
            <p className="Pixso-paragraph-9_806">Стоимость дополнительной страницы</p>
            <NumInput
              value={draft.pricePerPage}
              onChange={(pricePerPage) => setDraft({ ...draft, pricePerPage })}
            />
          </div>
        </CrmCard>

        <CrmCard title="3. Функционал (дополнительные опции)">
          <PricingTable columns={['Опция', 'Активна', 'Цена (₽)']}>
            {draft.features.map((feature, i) => (
              <TableRow key={feature.id} columns={3}>
                <p className="Pixso-paragraph-9_370">{feature.title}</p>
                <ToggleBtn
                  enabled={feature.enabled}
                  onClick={() => {
                    const features = [...draft.features]
                    features[i] = { ...feature, enabled: !feature.enabled }
                    setDraft({ ...draft, features })
                  }}
                />
                <NumInput
                  value={feature.price}
                  onChange={(price) => {
                    const features = [...draft.features]
                    features[i] = { ...feature, price }
                    setDraft({ ...draft, features })
                  }}
                />
              </TableRow>
            ))}
          </PricingTable>
        </CrmCard>

        <CrmCard title="4. Коэффициенты расчёта">
          <PricingTable columns={['Параметр', 'Описание', 'Значение']}>
            <TableRow columns={3}>
              <p className="Pixso-paragraph-9_370">Коэфф. дизайна</p>
              <p className="Pixso-paragraph-9_371">Множитель базы дизайна</p>
              <NumInput
                step={0.05}
                value={draft.designRatio}
                onChange={(designRatio) => setDraft({ ...draft, designRatio })}
              />
            </TableRow>
            <TableRow columns={3}>
              <p className="Pixso-paragraph-9_370">Коэфф. SEO</p>
              <p className="Pixso-paragraph-9_371">Доля от базы дизайна</p>
              <NumInput
                step={0.05}
                value={draft.seoRatio}
                onChange={(seoRatio) => setDraft({ ...draft, seoRatio })}
              />
            </TableRow>
          </PricingTable>
        </CrmCard>

        <CrmCard title="5. Варианты дизайна">
          <PricingTable columns={['Вариант', 'Множитель цены']}>
            {draft.designs.map((design, i) => (
              <TableRow key={design.id} columns={2}>
                <p className="Pixso-paragraph-9_370">{design.title}</p>
                <NumInput
                  step={0.05}
                  value={design.multiplier}
                  onChange={(multiplier) => {
                    const designs = [...draft.designs]
                    designs[i] = { ...design, multiplier }
                    setDraft({ ...draft, designs })
                  }}
                />
              </TableRow>
            ))}
          </PricingTable>
        </CrmCard>

        <CrmCard title="6. Доплата за готовность контента">
          <PricingTable columns={['Статус контента', 'Доплата (₽)']}>
            <TableRow columns={2}>
              <p className="Pixso-paragraph-9_370">Полностью готов</p>
              <p className="Pixso-paragraph-9_371">0 (без доплаты)</p>
            </TableRow>
            {(Object.keys(CONTENT_LABELS) as Array<keyof typeof CONTENT_LABELS>).map((key) => (
              <TableRow key={key} columns={2}>
                <p className="Pixso-paragraph-9_370">{CONTENT_LABELS[key]}</p>
                <NumInput
                  value={draft.contentReadyFees[key]}
                  onChange={(fee) =>
                    setDraft({
                      ...draft,
                      contentReadyFees: { ...draft.contentReadyFees, [key]: fee },
                    })
                  }
                />
              </TableRow>
            ))}
          </PricingTable>
        </CrmCard>

        <div className="ic-crm-pricing-actions">
          <PixsoButton className="Pixso-frame-9_818" onClick={save}>
            <div className="frame-content-9_818">
              <div className="Pixso-vector-9_819" />
              <p className="Pixso-paragraph-9_821">{saved ? 'Сохранено ✓' : 'Сохранить изменения'}</p>
            </div>
          </PixsoButton>
          <button type="button" className="ic-btn ic-crm-pricing-reset" onClick={reset}>
            Сбросить к значениям по умолчанию
          </button>
        </div>
      </div>
    </div>
  )
}
