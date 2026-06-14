import { NavLink } from 'react-router-dom'
import { useApp } from '@/context/AppProvider'
import { CRM_PATHS } from '@/components/crm/paths'

function navClass(isActive: boolean) {
  return isActive ? 'ic-crm-nav-link is-active' : 'ic-crm-nav-link'
}

export default function CrmSidebar() {
  const { leads, settings } = useApp()
  const leadCount = leads.length
  const initials = settings.profileName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside className="Pixso-frame-9_275 ic-crm-sidebar">
      <div className="frame-content-9_275">
        <div className="Pixso-frame-9_276">
          <div className="frame-content-9_276">
            <div className="Pixso-frame-9_277">
              <div className="frame-content-9_277">
                {['1741', '1742', '1743', '1744', '1745', '1746', '1747', '1748', '1749'].map((n) => (
                  <div key={n} className={`Pixso-frame-9_${n}`} />
                ))}
              </div>
            </div>
            <div className="Pixso-frame-9_279">
              <p className="Pixso-paragraph-9_280">PixelWave</p>
              <p className="Pixso-paragraph-9_281">web-разработка</p>
            </div>
          </div>
        </div>
        <div className="Pixso-frame-9_282" />
        <p className="Pixso-paragraph-9_283">ГЛАВНОЕ</p>

        <NavLink to={CRM_PATHS.dashboard} end className={({ isActive }) => navClass(isActive)}>
          <div className="Pixso-frame-9_284">
            <div className="frame-content-9_284">
              <div className="Pixso-frame-9_285">
                {['286', '287', '288', '289'].map((n) => (
                  <div key={n} className={`stroke-wrapper-9_${n}`}>
                    <div className={`Pixso-rectangle-9_${n}`} />
                    <div className={`stroke-9_${n}`} />
                  </div>
                ))}
              </div>
              <p className="Pixso-paragraph-9_290">Дашборд</p>
            </div>
          </div>
        </NavLink>

        <NavLink to={CRM_PATHS.leads} className={({ isActive }) => navClass(isActive)}>
          <div className="Pixso-frame-9_291">
            <div className="frame-content-9_291">
              <div className="Pixso-vector-9_292" />
              <p className="Pixso-paragraph-9_295">Заявки</p>
              <div className="Pixso-frame-9_296">
                <p className="Pixso-paragraph-9_297">{leadCount}</p>
              </div>
            </div>
          </div>
        </NavLink>

        <NavLink to={CRM_PATHS.clients} className={({ isActive }) => navClass(isActive)}>
          <div className="Pixso-frame-9_298">
            <div className="frame-content-9_298">
              <div className="Pixso-vector-9_299" />
              <p className="Pixso-paragraph-9_304">Клиенты</p>
            </div>
          </div>
        </NavLink>

        <NavLink to={CRM_PATHS.pricing} className={({ isActive }) => navClass(isActive)}>
          <div className="Pixso-frame-9_312">
            <div className="frame-content-9_312">
              <div className="Pixso-vector-9_313" />
              <p className="Pixso-paragraph-9_316">Прайс лист</p>
            </div>
          </div>
        </NavLink>

        <NavLink to={CRM_PATHS.settings} className={({ isActive }) => navClass(isActive)}>
          <div className="Pixso-frame-9_317">
            <div className="frame-content-9_317">
              <div className="Pixso-vector-9_318" />
              <p className="Pixso-paragraph-9_321">Настройки</p>
            </div>
          </div>
        </NavLink>

        <div className="Pixso-frame-9_322" />
        <div className="Pixso-frame-9_323">
          <div className="frame-content-9_323">
            <div className="Pixso-frame-9_324">
              <div className="frame-content-9_324">
                <p className="Pixso-paragraph-9_325">{initials}</p>
              </div>
            </div>
            <div className="Pixso-frame-9_326">
              <div className="frame-content-9_326">
                <p className="Pixso-paragraph-9_327">{settings.profileName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
