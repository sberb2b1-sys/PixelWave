import { useApp } from '@/context/AppProvider'
import { STEP_TITLES, type ContentReady, type FeatureConfig } from '@/types/app'
import {
  Header51,
  Nav51,
  Sidebar51,
} from '@/components/calculator/shared'
import '@/styles/Frame51.css'
import '@/styles/interactive.css'

const FEATURE_UI: Record<
  string,
  { frame: string; content: string; title: string; strokeWrap: string; stroke: string; inner: string }
> = {
  form: { frame: 'Pixso-frame-5_26', content: 'frame-content-5_26', title: 'Pixso-paragraph-5_30', strokeWrap: 'stroke-wrapper-5_32', stroke: 'stroke-5_32', inner: 'Pixso-frame-5_32' },
  booking: { frame: 'Pixso-frame-5_31', content: 'frame-content-5_31', title: 'Pixso-paragraph-5_33', strokeWrap: 'stroke-wrapper-5_35', stroke: 'stroke-5_35', inner: 'Pixso-frame-5_35' },
  calc: { frame: 'Pixso-frame-5_34', content: 'frame-content-5_34', title: 'Pixso-paragraph-5_36', strokeWrap: 'stroke-wrapper-5_38', stroke: 'stroke-5_38', inner: 'Pixso-frame-5_38' },
  payment: { frame: 'Pixso-frame-5_37', content: 'frame-content-5_37', title: 'Pixso-paragraph-5_39', strokeWrap: 'stroke-wrapper-5_41', stroke: 'stroke-5_41', inner: 'Pixso-frame-5_41' },
  cart: { frame: 'Pixso-frame-5_40', content: 'frame-content-5_40', title: 'Pixso-paragraph-5_42', strokeWrap: 'stroke-wrapper-5_44', stroke: 'stroke-5_44', inner: 'Pixso-frame-5_44' },
  cabinet: { frame: 'Pixso-frame-5_43', content: 'frame-content-5_43', title: 'Pixso-paragraph-5_45', strokeWrap: 'stroke-wrapper-5_44', stroke: 'stroke-5_44', inner: 'Pixso-frame-5_44' },
}

const CONTENT_UI: Record<ContentReady, { wrap: string; strokeWrap: string; stroke: string; inner: string; title: string }> = {
  full: { wrap: 'Pixso-frame-5_48', strokeWrap: 'stroke-wrapper-5_49', stroke: 'stroke-5_49', inner: 'Pixso-frame-5_49', title: 'Pixso-paragraph-5_51' },
  partial: { wrap: 'Pixso-frame-5_52', strokeWrap: 'stroke-wrapper-5_53', stroke: 'stroke-5_53', inner: 'Pixso-frame-5_53', title: 'Pixso-paragraph-5_54' },
  none: { wrap: 'Pixso-frame-5_55', strokeWrap: 'stroke-wrapper-5_56', stroke: 'stroke-5_56', inner: 'Pixso-frame-5_56', title: 'Pixso-paragraph-5_57' },
}

function FeatureChip({ feature, selected, onToggle }: { feature: FeatureConfig; selected: boolean; onToggle: () => void }) {
  const ui = FEATURE_UI[feature.id] ?? FEATURE_UI.form
  return (
    <button type="button" className={`ic-btn ic-btn-plain ${ui.frame}`} onClick={onToggle}>
      <div className={ui.content}>
        {selected ? (
          <div className="Pixso-frame-5_27"><div className="Pixso-vector-5_28" /></div>
        ) : (
          <div className={ui.strokeWrap}><div className={ui.inner} /><div className={ui.stroke} /></div>
        )}
        <p className={ui.title}>{feature.title}</p>
      </div>
    </button>
  )
}

function ContentChip({ id, label, selected, onSelect }: { id: ContentReady; label: string; selected: boolean; onSelect: () => void }) {
  const ui = CONTENT_UI[id]
  return (
    <button type="button" className={`ic-btn ic-btn-plain ic-content-chip ${ui.wrap}${selected ? ' ic-selected-chip' : ''}`} onClick={onSelect}>
      <div className={ui.strokeWrap}>
        <div className={ui.inner}>
          {selected ? <div className="Pixso-frame-5_50" /> : null}
        </div>
        <div className={ui.stroke} />
      </div>
      <p className={ui.title}>{label}</p>
    </button>
  )
}

export default function Step2Features() {
  const { config, session, breakdown, toggleFeature, updateSession, nextStep, prevStep } = useApp()
  const progress = 50
  const features = config.features.filter((f) => f.enabled)

  return (
    <div className="scroll-container">
      <div className="Pixso-frame-5_1">
        <Header51 />
        <div className="Pixso-frame-5_14">
          <div className="frame-content-5_14">
            <p className="Pixso-paragraph-5_15">Рассчитайте стоимость вашего сайта</p>
            <p className="Pixso-paragraph-5_16">Ответьте на несколько вопросов — получите точную цену за 2 минуты</p>
          </div>
        </div>
        <div className="Pixso-frame-5_17">
          <div className="frame-content-5_17">
            <div className="Pixso-frame-5_18">
              <div className="frame-content-5_18">
                <div className="Pixso-frame-5_19">
                  <div className="frame-content-5_19">
                    <p className="Pixso-paragraph-5_20">Шаг {session.step + 1} из 4 — {STEP_TITLES[session.step]}</p>
                    <p className="Pixso-paragraph-5_21">{progress}%</p>
                  </div>
                </div>
                <div className="Pixso-frame-5_22"><div className="Pixso-frame-5_23" style={{ width: `${progress}%` }} /></div>
                <p className="Pixso-paragraph-5_24">Выберите нужный функционал:</p>
                <div className="Pixso-frame-5_25">
                  <div className="frame-content-5_25">
                    {features.map((f) => (
                      <FeatureChip key={f.id} feature={f} selected={session.featureIds.includes(f.id)} onToggle={() => toggleFeature(f.id)} />
                    ))}
                  </div>
                </div>
                <p className="Pixso-paragraph-5_46">Тексты и фото готовы?</p>
                <div className="Pixso-frame-5_47">
                  <div className="frame-content-5_47">
                    <ContentChip id="full" label="Всё есть" selected={session.contentReady === 'full'} onSelect={() => updateSession({ contentReady: 'full' })} />
                    <ContentChip id="partial" label="Частично" selected={session.contentReady === 'partial'} onSelect={() => updateSession({ contentReady: 'partial' })} />
                    <ContentChip id="none" label="Нет" selected={session.contentReady === 'none'} onSelect={() => updateSession({ contentReady: 'none' })} />
                  </div>
                </div>
                <Nav51 onBack={prevStep} onNext={nextStep} />
              </div>
            </div>
            <Sidebar51 breakdown={breakdown} onSubmit={() => updateSession({ step: 3 })} />
          </div>
        </div>
      </div>
    </div>
  )
}
