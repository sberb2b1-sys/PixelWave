import { useApp } from '@/context/AppProvider'
import { STEP_TITLES } from '@/types/app'
import { Header5113 } from '@/components/site/SiteNav'
import { formatPrice } from '@/lib/calculator'
import '@/styles/Frame5113.css'
import '@/styles/interactive.css'

function Sidebar5113() {
  const { breakdown } = useApp()
  const lines = breakdown.lines.slice(0, 3)
  const rows = [
    { row: 'Pixso-frame-5_191', content: 'frame-content-5_191', label: 'Pixso-paragraph-5_192', value: 'Pixso-paragraph-5_193' },
    { row: 'Pixso-frame-5_194', content: 'frame-content-5_194', label: 'Pixso-paragraph-5_195', value: 'Pixso-paragraph-5_196' },
    { row: 'Pixso-frame-5_197', content: 'frame-content-5_197', label: 'Pixso-paragraph-5_198', value: 'Pixso-paragraph-5_199' },
  ]

  return (
    <div className="Pixso-frame-5_180">
      <div className="frame-content-5_180">
        <div className="Pixso-frame-5_181">
          <div className="frame-content-5_181">
            <div className="Pixso-frame-5_182">
              <div className="frame-content-5_182">
                <p className="Pixso-paragraph-5_183">Предварительная стоимость</p>
                <div className="Pixso-frame-5_184"><p className="Pixso-paragraph-5_185">Онлайн</p></div>
              </div>
            </div>
            <div className="Pixso-frame-5_186">
              <div className="frame-content-5_186">
                <p className="Pixso-paragraph-5_187">{formatPrice(breakdown.total)}</p>
                <p className="Pixso-paragraph-5_188">Срок: {breakdown.timeline}</p>
              </div>
            </div>
            <div className="Pixso-frame-5_189" />
            <div className="Pixso-frame-5_190">
              <div className="frame-content-5_190">
                {lines.map((line, i) => {
                  const c = rows[i] ?? rows[0]
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
            <div className="Pixso-frame-5_200" />
            <button type="button" className="ic-btn Pixso-frame-5_201">
              <div className="frame-content-5_201"><div className="Pixso-vector-5_202" /><p className="Pixso-paragraph-5_205">Отправить заявку</p></div>
            </button>
            <p className="Pixso-paragraph-5_206">Отвечу в течение часа</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Step3Parameters() {
  const { config, session, updateSession, nextStep, prevStep } = useApp()
  const progress = 75
  const timeline = config.timelines.includes(session.timeline)
    ? session.timeline
    : config.timelines[0] ?? '5 дней'

  return (
    <div className="scroll-container">
      <div className="Pixso-frame-5_113">
        <Header5113 />
        <div className="Pixso-frame-5_126">
          <div className="frame-content-5_126">
            <p className="Pixso-paragraph-5_127">Рассчитайте стоимость вашего сайта</p>
            <p className="Pixso-paragraph-5_128">Ответьте на несколько вопросов — получите точную цену за 2 минуты</p>
          </div>
        </div>
        <div className="Pixso-frame-5_129">
          <div className="frame-content-5_129">
            <div className="Pixso-frame-5_130">
              <div className="frame-content-5_130">
                <div className="Pixso-frame-5_131">
                  <div className="frame-content-5_131">
                    <p className="Pixso-paragraph-5_132">Шаг {session.step + 1} из 4 — {STEP_TITLES[session.step]}</p>
                    <p className="Pixso-paragraph-5_133">{progress}%</p>
                  </div>
                </div>
                <div className="Pixso-frame-5_134"><div className="Pixso-frame-5_135" style={{ width: `${progress}%` }} /></div>
                <p className="Pixso-paragraph-5_136">Дизайн:</p>
                <div className="Pixso-frame-5_137">
                  <div className="frame-content-5_137">
                    <button type="button" className="ic-btn ic-btn-plain Pixso-frame-5_138" onClick={() => updateSession({ designId: 'template' })}>
                      <div className="stroke-wrapper-5_139">
                        <div className="Pixso-frame-5_139">{session.designId === 'template' ? <div className="Pixso-frame-5_140" /> : null}</div>
                        <div className="stroke-5_139" />
                      </div>
                      <p className="Pixso-paragraph-5_141">Шаблон</p>
                    </button>
                    <button type="button" className="ic-btn ic-btn-plain Pixso-frame-5_142" onClick={() => updateSession({ designId: 'custom' })}>
                      <div className="stroke-wrapper-5_143">
                        <div className="Pixso-frame-5_143">{session.designId === 'custom' ? <div className="Pixso-frame-5_140" /> : null}</div>
                        <div className="stroke-5_143" />
                      </div>
                      <p className="Pixso-paragraph-5_144">Индивидуальный</p>
                    </button>
                  </div>
                </div>
                <p className="Pixso-paragraph-5_145">Сроки:</p>
                <div className="stroke-wrapper-5_146 ic-calculator-select-wrap">
                  <select
                    className="ic-calculator-select"
                    value={timeline}
                    onChange={(e) => updateSession({ timeline: e.target.value })}
                  >
                    {config.timelines.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="Pixso-vector-5_148 ic-calculator-select-chevron" aria-hidden />
                  <div className="stroke-5_146" />
                </div>
                <div className="Pixso-frame-5_161">
                  <div className="frame-content-5_161">
                    <button type="button" className="ic-btn ic-btn-plain Pixso-frame-5_162" onClick={prevStep}>
                      <div className="frame-content-5_162"><div className="Pixso-vector-5_163" /><p className="Pixso-paragraph-5_166">Назад</p></div>
                    </button>
                    <button type="button" className="ic-btn Pixso-frame-5_167" onClick={nextStep}>
                      <div className="frame-content-5_167"><p className="Pixso-paragraph-5_168">Далее</p><div className="Pixso-vector-5_169" /></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Sidebar5113 />
          </div>
        </div>
      </div>
    </div>
  )
}
