import { useCallback, useRef } from 'react'
import { formatPrice } from '@/lib/calculator'
import type { PriceBreakdown, SiteTypeConfig } from '@/types/app'
export { Header218, Header51, Header5113, Header5224 } from '@/components/site/SiteNav'

const CARD = {
  landing: { wrap: 'stroke-wrapper-2_43', stroke: 'stroke-2_43', frame: 'Pixso-frame-2_43', content: 'frame-content-2_43', title: 'Pixso-paragraph-2_53', price: 'Pixso-paragraph-2_54' },
  corporate: { wrap: 'stroke-wrapper-2_55', stroke: 'stroke-2_55', frame: 'Pixso-frame-2_55', content: 'frame-content-2_55', title: 'Pixso-paragraph-2_62', price: 'Pixso-paragraph-2_63' },
  shop: { wrap: 'stroke-wrapper-2_64', stroke: 'stroke-2_64', frame: 'Pixso-frame-2_64', content: 'frame-content-2_64', title: 'Pixso-paragraph-2_69', price: 'Pixso-paragraph-2_70' },
  portfolio: { wrap: 'stroke-wrapper-2_71', stroke: 'stroke-2_71', frame: 'Pixso-frame-2_71', content: 'frame-content-2_71', title: 'Pixso-paragraph-2_76', price: 'Pixso-paragraph-2_77' },
} as const

function SiteIcon({ id }: { id: string }) {
  if (id === 'landing') {
    return (
      <div className="Pixso-frame-2_44">
        <div className="stroke-wrapper-2_45"><div className="Pixso-rectangle-2_45" /><div className="stroke-2_45" /></div>
        <div className="Pixso-vector-2_46" /><div className="Pixso-vector-2_47" /><div className="Pixso-vector-2_48" />
        <div className="Pixso-vector-2_49" /><div className="Pixso-vector-2_50" /><div className="Pixso-vector-2_51" /><div className="Pixso-vector-2_52" />
      </div>
    )
  }
  if (id === 'corporate') return <div className="Pixso-vector-2_56" />
  if (id === 'shop') return <div className="Pixso-vector-2_65" />
  if (id === 'portfolio') {
    return (
      <div className="Pixso-frame-2_72">
        <div className="stroke-wrapper-2_73"><div className="Pixso-rectangle-2_73" /><div className="stroke-2_73" /></div>
        <div className="Pixso-vector-2_74" /><div className="Pixso-vector-2_75" />
      </div>
    )
  }
  return null
}

export function SiteTypeCard({ type, selected, onSelect }: { type: SiteTypeConfig; selected: boolean; onSelect: () => void }) {
  const c = CARD[type.id as keyof typeof CARD] ?? CARD.landing
  return (
    <button type="button" className={`ic-btn ic-site-card ${c.wrap}${selected ? ' is-selected' : ''}`} onClick={onSelect}>
      <div className={c.frame}>
        <div className={c.content}>
          <SiteIcon id={type.id} />
          <p className={c.title}>{type.title}</p>
          <p className={c.price}>от {formatPrice(type.basePrice)}</p>
        </div>
      </div>
      <div className={`${c.stroke} ic-site-stroke`} />
    </button>
  )
}

export function PagesSlider({ pages, min, max, onChange }: { pages: number; min: number; max: number; onChange: (n: number) => void }) {
  const percent = max === min ? 0 : ((pages - min) / (max - min)) * 100
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return pages
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return pages
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return Math.round(min + ratio * (max - min))
    },
    [min, max, pages],
  )

  const stopDrag = useCallback(() => {
    dragging.current = false
  }, [])

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      onChange(valueFromClientX(e.clientX))
    },
    [onChange, valueFromClientX],
  )

  return (
    <>
      <p className="Pixso-paragraph-2_78">Количество страниц</p>
      <div className="Pixso-frame-2_79">
        <div className="frame-content-2_79">
          <button type="button" className="ic-btn ic-btn-plain stroke-wrapper-2_80" onClick={() => onChange(Math.max(min, pages - 1))}>
            <div className="Pixso-frame-2_80"><div className="frame-content-2_80"><div className="Pixso-vector-2_81" /></div></div>
            <div className="stroke-2_80" />
          </button>
          <div
            ref={trackRef}
            className="Pixso-frame-2_83 ic-pages-track"
            onPointerDown={startDrag}
            onPointerMove={(e) => {
              if (dragging.current) onChange(valueFromClientX(e.clientX))
            }}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onLostPointerCapture={stopDrag}
          >
            <input
              type="range"
              className="ic-pages-range"
              min={min}
              max={max}
              value={pages}
              onChange={(e) => onChange(Number(e.target.value))}
              aria-label="Количество страниц"
            />
            <div className="Pixso-frame-2_84" style={{ width: `${percent}%`, height: '100%' }} />
            <div className="stroke-wrapper-2_85 ic-pages-thumb" style={{ left: `calc(${percent}% - 10px)`, top: '-7px' }}>
              <div className="Pixso-frame-2_85" /><div className="stroke-2_85" />
            </div>
          </div>
          <button type="button" className="ic-btn ic-btn-plain stroke-wrapper-2_86" onClick={() => onChange(Math.min(max, pages + 1))}>
            <div className="Pixso-frame-2_86"><div className="frame-content-2_86"><div className="Pixso-vector-2_87" /></div></div>
            <div className="stroke-2_86" />
          </button>
          <p className="Pixso-paragraph-2_90">{pages} стр.</p>
        </div>
      </div>
    </>
  )
}

export function Nav218({ onBack, onNext, nextLabel = 'Следующий шаг', showNext = true }: { onBack: () => void; onNext: () => void; nextLabel?: string; showNext?: boolean }) {
  return (
    <div className="Pixso-frame-2_91">
      <div className="frame-content-2_91">
        <button type="button" className="ic-btn ic-btn-plain stroke-wrapper-2_92" onClick={onBack}>
          <div className="Pixso-frame-2_92"><div className="frame-content-2_92"><div className="Pixso-vector-2_93" /><p className="Pixso-paragraph-2_96">Назад</p></div></div>
          <div className="stroke-2_92" />
        </button>
        {showNext && (
          <button type="button" className="ic-btn Pixso-frame-2_97" onClick={onNext}>
            <div className="frame-content-2_97"><p className="Pixso-paragraph-2_98">{nextLabel}</p><div className="Pixso-vector-2_99" /></div>
          </button>
        )}
      </div>
    </div>
  )
}

export function Nav51({ onBack, onNext, nextLabel = 'Далее' }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="Pixso-frame-5_58">
      <div className="frame-content-5_58">
        <button type="button" className="ic-btn ic-btn-plain Pixso-frame-5_59" onClick={onBack}>
          <div className="frame-content-5_59"><div className="Pixso-vector-5_60" /><p className="Pixso-paragraph-5_63">Назад</p></div>
        </button>
        <button type="button" className="ic-btn Pixso-frame-5_64" onClick={onNext}>
          <div className="frame-content-5_64"><p className="Pixso-paragraph-5_65">{nextLabel}</p><div className="Pixso-vector-5_66" /></div>
        </button>
      </div>
    </div>
  )
}

export function Sidebar218({ breakdown, onSubmit }: { breakdown: PriceBreakdown; onSubmit: () => void }) {
  return (
    <div className="Pixso-frame-2_102">
      <div className="frame-content-2_102">
        <div className="Pixso-frame-2_103">
          <div className="frame-content-2_103">
            <div className="Pixso-frame-2_104">
              <div className="frame-content-2_104">
                <p className="Pixso-paragraph-2_105">Предварительная стоимость</p>
                <div className="Pixso-frame-2_106"><p className="Pixso-paragraph-2_107">Онлайн</p></div>
              </div>
            </div>
            <div className="Pixso-frame-2_108">
              <div className="frame-content-2_108">
                <p className="Pixso-paragraph-2_109">{formatPrice(breakdown.total)}</p>
                <p className="Pixso-paragraph-2_110">Срок: {breakdown.timeline}</p>
              </div>
            </div>
            <div className="Pixso-frame-2_112">
              <div className="frame-content-2_112">
                {breakdown.lines.map((line) => (
                  <div key={line.label} className="Pixso-frame-2_113">
                    <div className="frame-content-2_113">
                      <p className="Pixso-paragraph-2_114">{line.label}</p>
                      <p className="Pixso-paragraph-2_115">{formatPrice(line.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className="ic-btn Pixso-frame-2_123" onClick={onSubmit}>
              <div className="frame-content-2_123"><div className="Pixso-vector-2_124" /><p className="Pixso-paragraph-2_127">Отправить заявку</p></div>
            </button>
            <p className="Pixso-paragraph-2_128">Отвечу в течение 2 часов в рабочее время</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar51({ breakdown, onSubmit }: { breakdown: PriceBreakdown; onSubmit: () => void }) {
  const lineClasses = [
    { row: 'Pixso-frame-5_80', content: 'frame-content-5_80', label: 'Pixso-paragraph-5_81', value: 'Pixso-paragraph-5_82' },
    { row: 'Pixso-frame-5_83', content: 'frame-content-5_83', label: 'Pixso-paragraph-5_84', value: 'Pixso-paragraph-5_85' },
    { row: 'Pixso-frame-5_86', content: 'frame-content-5_86', label: 'Pixso-paragraph-5_87', value: 'Pixso-paragraph-5_88' },
  ]
  return (
    <div className="Pixso-frame-5_69">
      <div className="frame-content-5_69">
        <div className="Pixso-frame-5_70">
          <div className="frame-content-5_70">
            <div className="Pixso-frame-5_71">
              <div className="frame-content-5_71">
                <p className="Pixso-paragraph-5_72">Предварительная стоимость</p>
                <div className="Pixso-frame-5_73"><p className="Pixso-paragraph-5_74">Онлайн</p></div>
              </div>
            </div>
            <div className="Pixso-frame-5_75">
              <div className="frame-content-5_75">
                <p className="Pixso-paragraph-5_76">{formatPrice(breakdown.total)}</p>
                <p className="Pixso-paragraph-5_77">Срок: {breakdown.timeline}</p>
              </div>
            </div>
            <div className="Pixso-frame-5_78" />
            <div className="Pixso-frame-5_79">
              <div className="frame-content-5_79">
                {breakdown.lines.slice(0, 3).map((line, i) => {
                  const c = lineClasses[i] ?? lineClasses[0]
                  return (
                    <div key={line.label} className={c.row}>
                      <div className={c.content}>
                        <p className={c.label}>{line.label}</p>
                        <p className={c.value}>{formatPrice(line.amount)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="Pixso-frame-5_89" />
            <button type="button" className="ic-btn Pixso-frame-5_90" onClick={onSubmit}>
              <div className="frame-content-5_90"><div className="Pixso-vector-5_91" /><p className="Pixso-paragraph-5_94">Отправить заявку</p></div>
            </button>
            <p className="Pixso-paragraph-5_95">Отвечу в течение часа</p>
          </div>
        </div>
      </div>
    </div>
  )
}
