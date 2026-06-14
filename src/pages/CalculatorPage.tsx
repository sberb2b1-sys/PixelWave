import { useApp } from '@/context/AppProvider'
import { STEP_TITLES } from '@/types/app'
import {
  Header218,
  Nav218,
  PagesSlider,
  Sidebar218,
  SiteTypeCard,
} from '@/components/calculator/shared'
import Step2Features from '@/components/calculator/Step2Features'
import Step3Parameters from '@/components/calculator/Step3Parameters'
import Step4Contact from '@/components/calculator/Step4Contact'
import '@/styles/Frame218.css'
import '@/styles/interactive.css'

function Step1SiteType() {
  const { config, session, breakdown, updateSession, nextStep, prevStep } = useApp()
  const progress = 25

  return (
    <div className="scroll-container">
      <div className="Pixso-frame-2_18">
        <Header218 />
        <div className="Pixso-frame-2_31">
          <div className="frame-content-2_31">
            <p className="Pixso-paragraph-2_32">Рассчитайте стоимость своего сайта</p>
            <p className="Pixso-paragraph-2_33">
              Ответьте на несколько вопросов и получите точную смету за 2 минуты. Бесплатно и без обязательств.
            </p>
          </div>
        </div>
        <div className="Pixso-frame-2_34">
          <div className="frame-content-2_34">
            <div className="Pixso-frame-2_35">
              <div className="frame-content-2_35">
                <div className="Pixso-frame-2_36">
                  <div className="frame-content-2_36">
                    <p className="Pixso-paragraph-2_37">Шаг {session.step + 1} из 4 — {STEP_TITLES[session.step]}</p>
                    <p className="Pixso-paragraph-2_38">{progress}%</p>
                  </div>
                </div>
                <div className="Pixso-frame-2_39"><div className="Pixso-frame-2_40" style={{ width: `${progress}%` }} /></div>
                <p className="Pixso-paragraph-2_41">Какой тип сайта вам нужен?</p>
                <div className="Pixso-frame-2_42">
                  <div className="frame-content-2_42">
                    {config.siteTypes.map((type) => (
                      <SiteTypeCard
                        key={type.id}
                        type={type}
                        selected={session.siteTypeId === type.id}
                        onSelect={() => updateSession({ siteTypeId: type.id })}
                      />
                    ))}
                  </div>
                </div>
                <PagesSlider
                  pages={session.pages}
                  min={config.minPages}
                  max={config.maxPages}
                  onChange={(pages) => updateSession({ pages })}
                />
                <Nav218 onBack={prevStep} onNext={nextStep} />
              </div>
            </div>
            <Sidebar218 breakdown={breakdown} onSubmit={() => updateSession({ step: 3 })} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CalculatorPage() {
  const { session } = useApp()

  if (session.step === 1) return <Step2Features />
  if (session.step === 2) return <Step3Parameters />
  if (session.step === 3) return <Step4Contact />
  return <Step1SiteType />
}
