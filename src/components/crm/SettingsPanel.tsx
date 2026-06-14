import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppProvider'
import { PixsoButton, PixsoInput } from '@/components/crm/PixsoField'
import '@/styles/Frame9722.css'
import '@/styles/interactive.css'

export default function SettingsPanel() {
  const { settings, saveSettings } = useApp()
  const [draft, setDraft] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => setDraft(settings), [settings])

  const save = async () => {
    await saveSettings(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div id="9_774" className="Pixso-frame-9_774">
      <div className="frame-content-9_774">
        <div className="Pixso-frame-9_775">
          <div className="frame-content-9_775">
            <div className="Pixso-frame-9_776">
              <p className="Pixso-paragraph-9_777">Настройки</p>
              <p className="Pixso-paragraph-9_778">Управление аккаунтом и системой</p>
            </div>
          </div>
        </div>
        <div className="Pixso-frame-9_779">
          <div className="frame-content-9_779">
            <div className="stroke-wrapper-9_802">
              <div className="Pixso-frame-9_802">
                <div className="frame-content-9_802">
                  <p className="Pixso-paragraph-9_803">Профиль</p>
                  <div className="Pixso-frame-9_804" />
                  <div className="Pixso-frame-9_805">
                    <div className="frame-content-9_805">
                      <p className="Pixso-paragraph-9_806">Имя и фамилия</p>
                      <PixsoInput
                        value={draft.profileName}
                        onChange={(e) => setDraft({ ...draft, profileName: e.target.value })}
                        frameClass="Pixso-frame-9_807"
                        contentClass="frame-content-9_807"
                        paragraphClass="Pixso-paragraph-9_808"
                        strokeClass="stroke-9_807"
                      />
                    </div>
                  </div>
                  <div className="Pixso-frame-9_809">
                    <div className="frame-content-9_809">
                      <p className="Pixso-paragraph-9_810">Email</p>
                      <PixsoInput
                        type="email"
                        value={draft.profileEmail}
                        onChange={(e) => setDraft({ ...draft, profileEmail: e.target.value })}
                        frameClass="Pixso-frame-9_811"
                        contentClass="frame-content-9_811"
                        paragraphClass="Pixso-paragraph-9_812"
                        strokeClass="stroke-9_811"
                      />
                    </div>
                  </div>
                  <div className="Pixso-frame-9_813">
                    <div className="frame-content-9_813">
                      <p className="Pixso-paragraph-9_814">Телефон</p>
                      <PixsoInput
                        value={draft.profilePhone}
                        onChange={(e) => setDraft({ ...draft, profilePhone: e.target.value })}
                        frameClass="Pixso-frame-9_815"
                        contentClass="frame-content-9_815"
                        paragraphClass="Pixso-paragraph-9_816"
                        strokeClass="stroke-9_815"
                      />
                    </div>
                  </div>
                  <div className="Pixso-frame-9_817" />
                  <PixsoButton className="Pixso-frame-9_818" onClick={save}>
                    <div className="frame-content-9_818">
                      <div className="Pixso-vector-9_819" />
                      <p className="Pixso-paragraph-9_821">{saved ? 'Сохранено ✓' : 'Сохранить изменения'}</p>
                    </div>
                  </PixsoButton>
                </div>
              </div>
              <div className="stroke-9_802" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
