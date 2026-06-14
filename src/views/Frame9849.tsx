import { useState } from 'react'
import { useApp } from '@/context/AppProvider'
import { PixsoInput, PixsoTextarea } from '@/components/crm/PixsoField'
import '@/styles/Frame9849.css'
import '@/styles/interactive.css'

type Frame9849Props = {
  onClose?: () => void
}

const Frame9849 = ({ onClose }: Frame9849Props) => {
  const { createClient, config } = useApp()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [projectType, setProjectType] = useState('')
  const [budget, setBudget] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const wrapClass = onClose ? 'ic-new-client-overlay' : 'scroll-container'

  const submit = async () => {
    if (!name.trim() || !phone.trim()) return
    setSaving(true)
    try {
      await createClient({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        projectType: projectType || config.siteTypes[0]?.title || '',
        budget,
        comment: comment.trim(),
      })
      onClose?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={wrapClass}>
      <div id="9_849" className="Pixso-frame-9_849">
        <button
          type="button"
          id="9_850"
          className="ic-btn ic-new-client-backdrop Pixso-frame-9_850"
          aria-label="Закрыть"
          onClick={onClose}
        />
        <div id="9_851" className="Pixso-frame-9_851">
          <div className="frame-content-9_851">
            <div id="9_852" className="stroke-wrapper-9_852">
              <div className="Pixso-frame-9_852">
                <div className="frame-content-9_852">
                  <div id="9_853" className="Pixso-frame-9_853">
                    <div id="9_854" className="Pixso-frame-9_854">
                      <div className="frame-content-9_854">
                        <div id="9_855" className="Pixso-frame-9_855" />
                        <div id="9_1018" className="Pixso-vector-9_1018" />
                      </div>
                    </div>
                    <p id="9_856" className="Pixso-paragraph-9_856">
                      Добавить клиента
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ic-btn ic-new-client-close Pixso-frame-9_857"
                    aria-label="Закрыть"
                    onClick={onClose}
                  >
                    <div className="frame-content-9_857">
                      <div id="9_858" className="Pixso-frame-9_858" />
                    </div>
                  </button>
                </div>
              </div>
              <div className="stroke-9_852" />
            </div>
            <div id="9_859" className="Pixso-frame-9_859">
              <div className="frame-content-9_859">
                <div id="9_860" className="Pixso-frame-9_860">
                  <div className="frame-content-9_860">
                    <div id="9_861" className="Pixso-frame-9_861">
                      <div className="frame-content-9_861">
                        <p id="9_862" className="Pixso-paragraph-9_862">Имя клиента *</p>
                        <PixsoInput
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Введите имя"
                          frameClass="Pixso-frame-9_863"
                          contentClass="frame-content-9_863"
                          paragraphClass="Pixso-paragraph-9_864"
                          strokeClass="stroke-9_863"
                        />
                      </div>
                    </div>
                    <div id="9_865" className="Pixso-frame-9_865">
                      <div className="frame-content-9_865">
                        <p id="9_866" className="Pixso-paragraph-9_866">Телефон *</p>
                        <PixsoInput
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 (___) ___-__-__"
                          frameClass="Pixso-frame-9_867"
                          contentClass="frame-content-9_867"
                          paragraphClass="Pixso-paragraph-9_868"
                          strokeClass="stroke-9_867"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div id="9_869" className="Pixso-frame-9_869">
                  <div className="frame-content-9_869">
                    <p id="9_870" className="Pixso-paragraph-9_870">Email</p>
                    <PixsoInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.com"
                      frameClass="Pixso-frame-9_871"
                      contentClass="frame-content-9_871"
                      paragraphClass="Pixso-paragraph-9_872"
                      strokeClass="stroke-9_871"
                    />
                  </div>
                </div>
                <div id="9_873" className="Pixso-frame-9_873">
                  <div className="frame-content-9_873">
                    <div id="9_874" className="Pixso-frame-9_874">
                      <div className="frame-content-9_874">
                        <p id="9_875" className="Pixso-paragraph-9_875">Тип проекта</p>
                        <select
                          className="ic-pixso-field ic-pixso-select"
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                        >
                          <option value="">Выберите тип</option>
                          {config.siteTypes.map((t) => (
                            <option key={t.id} value={t.title}>{t.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div id="9_879" className="Pixso-frame-9_879">
                      <div className="frame-content-9_879">
                        <p id="9_880" className="Pixso-paragraph-9_880">Бюджет (₽)</p>
                        <PixsoInput
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          frameClass="Pixso-frame-9_881"
                          contentClass="frame-content-9_881"
                          paragraphClass="Pixso-paragraph-9_882"
                          strokeClass="stroke-9_881"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div id="9_883" className="Pixso-frame-9_883">
                  <div className="frame-content-9_883">
                    <p id="9_884" className="Pixso-paragraph-9_884">Комментарий</p>
                    <PixsoTextarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Дополнительная информация о клиенте..."
                      frameClass="Pixso-frame-9_885"
                      contentClass="frame-content-9_885"
                      paragraphClass="Pixso-paragraph-9_886"
                      strokeClass="stroke-9_885"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div id="9_887" className="stroke-wrapper-9_887">
              <div className="Pixso-frame-9_887">
                <div className="frame-content-9_887">
                  <button
                    type="button"
                    className="ic-btn ic-new-client-cancel Pixso-frame-9_888"
                    onClick={onClose}
                  >
                    <div className="frame-content-9_888">
                      <p id="9_889" className="Pixso-paragraph-9_889">Отмена</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="ic-btn ic-pixso-btn-primary Pixso-frame-9_890"
                    onClick={submit}
                    disabled={saving || !name.trim() || !phone.trim()}
                  >
                    <div className="frame-content-9_890">
                      <div id="9_891" className="Pixso-frame-9_891" />
                      <p id="9_892" className="Pixso-paragraph-9_892">
                        {saving ? 'Сохранение...' : 'Добавить клиента'}
                      </p>
                      <div id="9_1022" className="Pixso-frame-9_1022" />
                    </div>
                  </button>
                </div>
              </div>
              <div className="stroke-9_887" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Frame9849
