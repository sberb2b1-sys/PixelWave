import { useEffect } from 'react'
import { useApp } from '@/context/AppProvider'
import { formatPrice } from '@/lib/calculator'
import '@/styles/Frame9561.css'
import '@/styles/interactive.css'

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

export default function AnalyticsPanel() {
  const { analytics, refreshAnalytics } = useApp()

  useEffect(() => {
    refreshAnalytics()
  }, [refreshAnalytics])

  const now = new Date()
  const monthLabel = `${MONTHS_RU[now.getMonth()]} ${now.getFullYear()}`
  const avgCheck = analytics.totalLeads > 0
    ? Math.round(analytics.totalRevenue / analytics.totalLeads)
    : 0

  const siteTypes = Object.entries(analytics.bySiteType)

  return (
    <div className="Pixso-frame-9_613">
      <div className="frame-content-9_613">
        <div className="Pixso-frame-9_614">
          <div className="frame-content-9_614">
            <div className="Pixso-frame-9_615">
              <p className="Pixso-paragraph-9_616">Аналитика</p>
              <p className="Pixso-paragraph-9_617">Показатели и статистика за текущий месяц</p>
            </div>
            <div className="stroke-wrapper-9_618">
              <div className="Pixso-frame-9_618">
                <div className="frame-content-9_618">
                  <div className="Pixso-frame-9_619">
                    <div className="Pixso-vector-9_620" />
                    <div className="Pixso-vector-9_621" />
                    <div className="stroke-wrapper-9_622">
                      <div className="Pixso-rectangle-9_622" />
                      <div className="stroke-9_622" />
                    </div>
                    <div className="Pixso-vector-9_623" />
                  </div>
                  <p className="Pixso-paragraph-9_624">{monthLabel}</p>
                  <div className="Pixso-vector-9_625" />
                </div>
              </div>
              <div className="stroke-9_618" />
            </div>
          </div>
        </div>

        <div className="Pixso-frame-9_627">
          <div className="frame-content-9_627">
            <div className="stroke-wrapper-9_628">
              <div className="Pixso-frame-9_628">
                <div className="frame-content-9_628">
                  <div className="Pixso-frame-9_629">
                    <div className="frame-content-9_629">
                      <p className="Pixso-paragraph-9_630">Конверсия</p>
                      <div className="Pixso-frame-9_631"><div className="frame-content-9_631"><div className="Pixso-vector-9_632" /></div></div>
                    </div>
                  </div>
                  <p className="Pixso-paragraph-9_635">{analytics.conversion}%</p>
                  <div className="Pixso-frame-9_636">
                    <div className="Pixso-vector-9_637" />
                    <p className="Pixso-paragraph-9_640">{analytics.done} завершено из {analytics.totalLeads}</p>
                  </div>
                </div>
              </div>
              <div className="stroke-9_628" />
            </div>

            <div className="stroke-wrapper-9_641">
              <div className="Pixso-frame-9_641">
                <div className="frame-content-9_641">
                  <div className="Pixso-frame-9_642">
                    <div className="frame-content-9_642">
                      <p className="Pixso-paragraph-9_643">Выручка</p>
                      <div className="Pixso-frame-9_644"><div className="frame-content-9_644"><div className="Pixso-vector-9_645" /></div></div>
                    </div>
                  </div>
                  <p className="Pixso-paragraph-9_648">{formatPrice(analytics.monthRevenue)}</p>
                  <div className="Pixso-frame-9_649">
                    <div className="Pixso-vector-9_650" />
                    <p className="Pixso-paragraph-9_653">Всего: {formatPrice(analytics.totalRevenue)}</p>
                  </div>
                </div>
              </div>
              <div className="stroke-9_641" />
            </div>

            <div className="stroke-wrapper-9_654">
              <div className="Pixso-frame-9_654">
                <div className="frame-content-9_654">
                  <div className="Pixso-frame-9_655">
                    <div className="frame-content-9_655">
                      <p className="Pixso-paragraph-9_656">Заявок</p>
                      <div className="Pixso-frame-9_657"><div className="frame-content-9_657"><div className="Pixso-vector-9_658" /></div></div>
                    </div>
                  </div>
                  <p className="Pixso-paragraph-9_661">{analytics.totalLeads}</p>
                  <div className="Pixso-frame-9_662">
                    <div className="Pixso-vector-9_663" />
                    <p className="Pixso-paragraph-9_666">{analytics.newLeads} новых · {analytics.inWork} в работе</p>
                  </div>
                </div>
              </div>
              <div className="stroke-9_654" />
            </div>

            <div className="stroke-wrapper-9_667">
              <div className="Pixso-frame-9_667">
                <div className="frame-content-9_667">
                  <div className="Pixso-frame-9_668">
                    <div className="frame-content-9_668">
                      <p className="Pixso-paragraph-9_669">Средний чек</p>
                      <div className="Pixso-frame-9_670">
                        <div className="frame-content-9_670">
                          <div className="Pixso-frame-9_671">
                            <div className="stroke-wrapper-9_672">
                              <div className="Pixso-rectangle-9_672" />
                              <div className="stroke-9_672" />
                            </div>
                            <div className="Pixso-vector-9_673" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="Pixso-paragraph-9_674">{formatPrice(avgCheck)}</p>
                  <div className="Pixso-frame-9_675">
                    <div className="Pixso-vector-9_676" />
                    <p className="Pixso-paragraph-9_679">{analytics.totalClients} клиентов в базе</p>
                  </div>
                </div>
              </div>
              <div className="stroke-9_667" />
            </div>
          </div>
        </div>

        <div className="Pixso-frame-9_680">
          <div className="frame-content-9_680">
            <div className="stroke-wrapper-9_704">
              <div className="Pixso-frame-9_704">
                <div className="frame-content-9_704">
                  <p className="Pixso-paragraph-9_705">Типы проектов</p>
                  <div className="Pixso-frame-9_706">
                    <div className="frame-content-9_706">
                      {siteTypes.length === 0 ? (
                        <p className="Pixso-paragraph-9_708">Нет данных — отправьте заявку с калькулятора</p>
                      ) : (
                        siteTypes.map(([title, count]) => (
                          <div key={title} className="ic-analytics-site-type">
                            <span>{title}</span>
                            <strong>{count}</strong>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="stroke-9_704" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
