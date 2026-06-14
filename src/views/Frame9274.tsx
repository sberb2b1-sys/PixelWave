import { useState } from 'react'
import '@/styles/Frame9274.css'
import '@/styles/interactive.css'
import { CrmNavLink } from '@/components/crm/CrmNavLink'
import { CRM_PATHS } from '@/components/crm/paths'
import { CrmLeadFilters, CrmLeadTableRows, useCrmLeads, useLeadCounts } from '@/components/crm/leads'
import type { LeadStatus } from '@/types/app'

type Filter = 'all' | LeadStatus

const Frame9274 = () => {
    const [filter, setFilter] = useState<Filter>('all')
    const filteredLeads = useCrmLeads(filter)
    const leadCount = useLeadCounts()

    return (
        <div className="scroll-container">
            <div id="9_274" className="Pixso-frame-9_274">
                <div id="9_275" className="Pixso-frame-9_275">
                    <div className="frame-content-9_275">
                        <div id="9_276" className="Pixso-frame-9_276">
                            <div className="frame-content-9_276">
                                <div id="9_277" className="Pixso-frame-9_277">
                                    <div className="frame-content-9_277">
                                        <div
                                            id="9_1741"
                                            className="Pixso-frame-9_1741"
                                        ></div>
                                        <div
                                            id="9_1742"
                                            className="Pixso-frame-9_1742"
                                        ></div>
                                        <div
                                            id="9_1743"
                                            className="Pixso-frame-9_1743"
                                        ></div>
                                        <div
                                            id="9_1744"
                                            className="Pixso-frame-9_1744"
                                        ></div>
                                        <div
                                            id="9_1745"
                                            className="Pixso-frame-9_1745"
                                        ></div>
                                        <div
                                            id="9_1746"
                                            className="Pixso-frame-9_1746"
                                        ></div>
                                        <div
                                            id="9_1747"
                                            className="Pixso-frame-9_1747"
                                        ></div>
                                        <div
                                            id="9_1748"
                                            className="Pixso-frame-9_1748"
                                        ></div>
                                        <div
                                            id="9_1749"
                                            className="Pixso-frame-9_1749"
                                        ></div>
                                    </div>
                                </div>
                                <div id="9_279" className="Pixso-frame-9_279">
                                    <p
                                        id="9_280"
                                        className="Pixso-paragraph-9_280"
                                    >
                                        {"PixelWave"}
                                    </p>
                                    <p
                                        id="9_281"
                                        className="Pixso-paragraph-9_281"
                                    >
                                        {"web-разработка"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div id="9_282" className="Pixso-frame-9_282"></div>
                        <p id="9_283" className="Pixso-paragraph-9_283">
                            {"ГЛАВНОЕ"}
                        </p>
                        <CrmNavLink to={CRM_PATHS.dashboard}>
                        <div id="9_284" className="Pixso-frame-9_284">
                            <div className="frame-content-9_284">
                                <div id="9_285" className="Pixso-frame-9_285">
                                    <div
                                        id="9_286"
                                        className="stroke-wrapper-9_286"
                                    >
                                        <div className="Pixso-rectangle-9_286"></div>
                                        <div className="stroke-9_286"></div>
                                    </div>
                                    <div
                                        id="9_287"
                                        className="stroke-wrapper-9_287"
                                    >
                                        <div className="Pixso-rectangle-9_287"></div>
                                        <div className="stroke-9_287"></div>
                                    </div>
                                    <div
                                        id="9_288"
                                        className="stroke-wrapper-9_288"
                                    >
                                        <div className="Pixso-rectangle-9_288"></div>
                                        <div className="stroke-9_288"></div>
                                    </div>
                                    <div
                                        id="9_289"
                                        className="stroke-wrapper-9_289"
                                    >
                                        <div className="Pixso-rectangle-9_289"></div>
                                        <div className="stroke-9_289"></div>
                                    </div>
                                </div>
                                <p id="9_290" className="Pixso-paragraph-9_290">
                                    {"Дашборд"}
                                </p>
                            </div>
                        </div>
                        </CrmNavLink>
                        <div id="9_291" className="Pixso-frame-9_291">
                            <div className="frame-content-9_291">
                                <div
                                    id="9_292"
                                    className="Pixso-vector-9_292"
                                ></div>
                                <p id="9_295" className="Pixso-paragraph-9_295">
                                    {"Заявки"}
                                </p>
                                <div id="9_296" className="Pixso-frame-9_296">
                                    <p
                                        id="9_297"
                                        className="Pixso-paragraph-9_297"
                                    >
                                        {leadCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <CrmNavLink to={CRM_PATHS.clients}>
                        <div id="9_298" className="Pixso-frame-9_298">
                            <div className="frame-content-9_298">
                                <div
                                    id="9_299"
                                    className="Pixso-vector-9_299"
                                ></div>
                                <p id="9_304" className="Pixso-paragraph-9_304">
                                    {"Клиенты"}
                                </p>
                            </div>
                        </div>
                        </CrmNavLink>
                        <CrmNavLink to={CRM_PATHS.dashboard}>
                        <div id="9_305" className="Pixso-frame-9_305">
                            <div className="frame-content-9_305">
                                <div
                                    id="9_306"
                                    className="Pixso-vector-9_306"
                                ></div>
                                <p id="9_311" className="Pixso-paragraph-9_311">
                                    {"Аналитика"}
                                </p>
                            </div>
                        </div>
                        </CrmNavLink>
                        <CrmNavLink to={CRM_PATHS.pricing}>
                        <div id="9_312" className="Pixso-frame-9_312">
                            <div className="frame-content-9_312">
                                <div
                                    id="9_313"
                                    className="Pixso-vector-9_313"
                                ></div>
                                <p id="9_316" className="Pixso-paragraph-9_316">
                                    {"Прайс лист"}
                                </p>
                            </div>
                        </div>
                        </CrmNavLink>
                        <CrmNavLink to={CRM_PATHS.settings}>
                        <div id="9_317" className="Pixso-frame-9_317">
                            <div className="frame-content-9_317">
                                <div
                                    id="9_318"
                                    className="Pixso-vector-9_318"
                                ></div>
                                <p id="9_321" className="Pixso-paragraph-9_321">
                                    {"Настройки"}
                                </p>
                            </div>
                        </div>
                        </CrmNavLink>
                        <div id="9_322" className="Pixso-frame-9_322"></div>
                        <div id="9_323" className="Pixso-frame-9_323">
                            <div className="frame-content-9_323">
                                <div id="9_324" className="Pixso-frame-9_324">
                                    <div className="frame-content-9_324">
                                        <p
                                            id="9_325"
                                            className="Pixso-paragraph-9_325"
                                        >
                                            {"АК"}
                                        </p>
                                    </div>
                                </div>
                                <div id="9_326" className="Pixso-frame-9_326">
                                    <div className="frame-content-9_326">
                                        <p
                                            id="9_327"
                                            className="Pixso-paragraph-9_327"
                                        >
                                            {"Алексей Кузнецов"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="9_328" className="Pixso-frame-9_328">
                    <div className="frame-content-9_328">
                        <div id="9_329" className="Pixso-frame-9_329">
                            <div className="frame-content-9_329">
                                <div id="9_330" className="Pixso-frame-9_330">
                                    <p
                                        id="9_331"
                                        className="Pixso-paragraph-9_331"
                                    >
                                        {"Заявки"}
                                    </p>
                                    <p
                                        id="9_332"
                                        className="Pixso-paragraph-9_332"
                                    >
                                        {"Все входящие заявки из калькулятора"}
                                    </p>
                                </div>
                                <div id="9_333" className="Pixso-frame-9_333">
                                    <div
                                        id="9_334"
                                        className="stroke-wrapper-9_334"
                                    >
                                        <div className="Pixso-frame-9_334">
                                            <div className="frame-content-9_334">
                                                <div
                                                    id="9_335"
                                                    className="Pixso-vector-9_335"
                                                ></div>
                                                <p
                                                    id="9_338"
                                                    className="Pixso-paragraph-9_338"
                                                >
                                                    {"Поиск заявки..."}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="stroke-9_334"></div>
                                    </div>
                                    <div
                                        id="9_339"
                                        className="Pixso-frame-9_339"
                                    >
                                        <div className="frame-content-9_339">
                                            <div
                                                id="9_340"
                                                className="Pixso-vector-9_340"
                                            ></div>
                                            <p
                                                id="9_343"
                                                className="Pixso-paragraph-9_343"
                                            >
                                                {"Новая заявка"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CrmLeadFilters filter={filter} onFilter={setFilter} />
                        <div id="9_353" className="stroke-wrapper-9_353">
                            <div className="Pixso-frame-9_353">
                                <div className="frame-content-9_353">
                                    <div
                                        id="9_354"
                                        className="Pixso-frame-9_354"
                                    >
                                        <div className="frame-content-9_354">
                                            <div
                                                id="9_355"
                                                className="Pixso-frame-9_355"
                                            >
                                                <div className="frame-content-9_355">
                                                    <p
                                                        id="9_356"
                                                        className="Pixso-paragraph-9_356"
                                                    >
                                                        {"Клиент"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                id="9_357"
                                                className="Pixso-frame-9_357"
                                            >
                                                <div className="frame-content-9_357">
                                                    <p
                                                        id="9_358"
                                                        className="Pixso-paragraph-9_358"
                                                    >
                                                        {"Услуга"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                id="9_359"
                                                className="Pixso-frame-9_359"
                                            >
                                                <div className="frame-content-9_359">
                                                    <p
                                                        id="9_360"
                                                        className="Pixso-paragraph-9_360"
                                                    >
                                                        {"Сумма"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                id="9_361"
                                                className="Pixso-frame-9_361"
                                            >
                                                <div className="frame-content-9_361">
                                                    <p
                                                        id="9_362"
                                                        className="Pixso-paragraph-9_362"
                                                    >
                                                        {"Дата"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                id="9_363"
                                                className="Pixso-frame-9_363"
                                            >
                                                <div className="frame-content-9_363">
                                                    <p
                                                        id="9_364"
                                                        className="Pixso-paragraph-9_364"
                                                    >
                                                        {"Статус"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <CrmLeadTableRows leads={filteredLeads} />
                                </div>
                            </div>
                            <div className="stroke-9_353"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Frame9274;
