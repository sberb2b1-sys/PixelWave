import { useApp } from '@/context/AppProvider'
import { STEP_TITLES } from '@/types/app'
import { Header5224 } from '@/components/site/SiteNav'
import { formatPrice } from '@/lib/calculator'
import '@/styles/Frame5224.css'
import '@/styles/interactive.css'

function Sidebar5224() {
  const { breakdown } = useApp()
  const lines = breakdown.lines
  const rowMeta = [
    { row: 'Pixso-frame-5_278', content: 'frame-content-5_278', label: 'Pixso-paragraph-5_279', value: 'Pixso-paragraph-5_280' },
    { row: 'Pixso-frame-5_281', content: 'frame-content-5_281', label: 'Pixso-paragraph-5_282', value: 'Pixso-paragraph-5_283' },
    { row: 'Pixso-frame-5_284', content: 'frame-content-5_284', label: 'Pixso-paragraph-5_285', value: 'Pixso-paragraph-5_286' },
  ]

  return (
    <div className="Pixso-frame-5_267">
      <div className="frame-content-5_267">
        <div className="Pixso-frame-5_268">
          <div className="frame-content-5_268">
            <div className="Pixso-frame-5_269">
              <div className="frame-content-5_269">
                <p className="Pixso-paragraph-5_270">Предварительная стоимость</p>
                <div className="Pixso-frame-5_271"><p className="Pixso-paragraph-5_272">Онлайн</p></div>
              </div>
            </div>
            <div className="Pixso-frame-5_273">
              <div className="frame-content-5_273">
                <p className="Pixso-paragraph-5_274">{formatPrice(breakdown.total)}</p>
                <p className="Pixso-paragraph-5_275">Срок: {breakdown.timeline}</p>
              </div>
            </div>
            <div className="Pixso-frame-5_276" />
            <div className="Pixso-frame-5_277">
              <div className="frame-content-5_277">
                {lines.map((line, i) => {
                  const c = rowMeta[i] ?? rowMeta[0]
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
            <div className="Pixso-frame-5_287" />
            <div className="Pixso-frame-5_288">
              <div className="frame-content-5_288">
                <p className="Pixso-paragraph-5_289">Итоговая стоимость:</p>
                <p className="Pixso-paragraph-5_290">{formatPrice(breakdown.total)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Step4Contact() {
  const { session, updateSession, prevStep, submitLead } = useApp()
  const progress = 100

  const handleSubmit = () => {
    if (!submitLead()) alert('Укажите имя и телефон или Telegram')
  }

  if (session.submitted) {
    return (
      <div className="scroll-container">
        <div className="Pixso-frame-5_224">
          <div className="ic-success-block" style={{ padding: 80 }}>
            <div className="Pixso-vector-2_132" style={{ width: 48, height: 48 }} />
            <p className="ic-success-title">Заявка отправлена!</p>
            <p className="ic-success-text">Мы свяжемся с вами в течение 2 часов.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="scroll-container">
      <div className="Pixso-frame-5_224">
        <Header5224 />
        <div className="Pixso-frame-5_237">
          <div className="frame-content-5_237">
            <p className="Pixso-paragraph-5_238">Рассчитайте стоимость вашего сайта</p>
            <p className="Pixso-paragraph-5_239">Ответьте на несколько вопросов — получите точную цену за 2 минуты</p>
          </div>
        </div>
        <div className="Pixso-frame-5_240">
          <div className="frame-content-5_240">
            <div className="Pixso-frame-5_241">
              <div className="frame-content-5_241">
                <div className="Pixso-frame-5_242">
                  <div className="frame-content-5_242">
                    <p className="Pixso-paragraph-5_243">Шаг {session.step + 1} из 4 — {STEP_TITLES[session.step]}</p>
                    <p className="Pixso-paragraph-5_244">{progress}%</p>
                  </div>
                </div>
                <div className="Pixso-frame-5_245"><div className="Pixso-frame-5_246" style={{ width: `${progress}%` }} /></div>
                <p className="Pixso-paragraph-5_247">Ваше имя:</p>
                <div className="stroke-wrapper-5_248 ic-contact-name-wrap">
                  <div className="Pixso-frame-5_248">
                    <div className="frame-content-5_248">
                      <input
                        className="ic-pixso-overlay-input"
                        value={session.name}
                        onChange={(e) => updateSession({ name: e.target.value })}
                        placeholder="Как к вам обращаться?"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div className="stroke-5_248" />
                </div>
                <p className="Pixso-paragraph-5_252">Телефон или Telegram:</p>
                <div className="stroke-wrapper-5_248">
                  <div className="Pixso-frame-5_248">
                    <div className="frame-content-5_248">
                      <div className="Pixso-vector-5_249" />
                      <input
                        className="ic-pixso-overlay-input"
                        value={session.contact}
                        onChange={(e) => updateSession({ contact: e.target.value })}
                        placeholder="+7 (999) 000-00-00 или @username"
                      />
                    </div>
                  </div>
                  <div className="stroke-5_248" />
                </div>
                <p className="Pixso-paragraph-5_252 ic-contact-comment-label">Комментарий к заказу (необязательно):</p>
                <div className="stroke-wrapper-5_253">
                  <div className="Pixso-frame-5_253">
                    <div className="frame-content-5_253">
                      <textarea
                        className="ic-pixso-overlay-textarea"
                        value={session.comment}
                        onChange={(e) => updateSession({ comment: e.target.value })}
                        placeholder="Расскажите, что должно быть на сайте, есть ли примеры, особые пожелания..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="stroke-5_253" />
                </div>
                <div className="Pixso-frame-5_255" />
                <div className="Pixso-frame-5_256">
                  <div className="frame-content-5_256">
                    <button type="button" className="ic-btn ic-btn-plain Pixso-frame-5_257" onClick={prevStep}>
                      <div className="frame-content-5_257"><div className="Pixso-vector-5_258" /><p className="Pixso-paragraph-5_261">Назад</p></div>
                    </button>
                    <button type="button" className="ic-btn Pixso-frame-5_262" onClick={handleSubmit}>
                      <div className="frame-content-5_262"><div className="Pixso-vector-5_263" /><p className="Pixso-paragraph-5_266">Отправить заявку</p></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Sidebar5224 />
          </div>
        </div>
      </div>
    </div>
  )
}
