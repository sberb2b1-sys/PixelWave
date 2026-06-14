import { useState } from 'react'
import '@/styles/Frame9274.css'
import '@/styles/interactive.css'
import { CrmLeadFilters, CrmLeadTableRows, useCrmLeads } from '@/components/crm/leads'
import type { LeadStatus } from '@/types/app'

type Filter = 'all' | LeadStatus

export default function LeadsPanel() {
  const [filter, setFilter] = useState<Filter>('all')
  const filteredLeads = useCrmLeads(filter)

  return (
    <div className="Pixso-frame-9_328">
      <div className="frame-content-9_328">
        <div className="Pixso-frame-9_329">
          <div className="frame-content-9_329">
            <div className="Pixso-frame-9_330">
              <p className="Pixso-paragraph-9_331">Заявки</p>
              <p className="Pixso-paragraph-9_332">Все входящие заявки из калькулятора</p>
            </div>
          </div>
        </div>
        <CrmLeadFilters filter={filter} onFilter={setFilter} />
        <div className="stroke-wrapper-9_353">
          <div className="Pixso-frame-9_353">
            <div className="frame-content-9_353">
              <div className="Pixso-frame-9_354">
                <div className="frame-content-9_354">
                  <div className="Pixso-frame-9_355"><div className="frame-content-9_355"><p className="Pixso-paragraph-9_356">Клиент</p></div></div>
                  <div className="Pixso-frame-9_357"><div className="frame-content-9_357"><p className="Pixso-paragraph-9_358">Услуга</p></div></div>
                  <div className="Pixso-frame-9_359"><div className="frame-content-9_359"><p className="Pixso-paragraph-9_360">Сумма</p></div></div>
                  <div className="Pixso-frame-9_361"><div className="frame-content-9_361"><p className="Pixso-paragraph-9_362">Дата</p></div></div>
                  <div className="Pixso-frame-9_363 ic-crm-actions-col"><div className="frame-content-9_363"><p className="Pixso-paragraph-9_364">Действия</p></div></div>
                </div>
              </div>
              <CrmLeadTableRows leads={filteredLeads} />
            </div>
          </div>
          <div className="stroke-9_353" />
        </div>
      </div>
    </div>
  )
}
