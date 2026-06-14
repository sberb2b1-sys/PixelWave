import { Link } from 'react-router-dom'
import { SITE_PATHS } from '@/components/site/paths'
import {
  CalculatorNavItem,
  ContactsNavItem,
  DiscussProjectLink,
  PortfolioNavItem,
  ServicesNavItem,
} from '@/components/site/SiteNavItems'

function LinkLogo({
  wrapClass,
  cells,
  iconFrame,
  iconContent,
  titleClass,
}: {
  wrapClass: string
  cells: number[]
  iconFrame: string
  iconContent: string
  titleClass: string
}) {
  return (
    <Link to={SITE_PATHS.home} className={`${wrapClass} ic-site-logo-marketing`}>
      <div className={iconFrame}>
        <div className={iconContent}>
          {cells.map((n) => (
            <div key={n} className={`Pixso-frame-9_${n}`} />
          ))}
        </div>
      </div>
      <p className={titleClass}>PixelWave</p>
    </Link>
  )
}

export function ServicesPageHeader() {
  return (
    <div className="frame-content-9_1224">
      <LinkLogo
        wrapClass="Pixso-frame-9_1225"
        cells={[1832, 1833, 1834, 1835, 1836, 1837, 1838, 1839, 1840]}
        iconFrame="Pixso-frame-9_1226"
        iconContent="frame-content-9_1226"
        titleClass="Pixso-paragraph-9_1227"
      />
      <div className="Pixso-frame-9_1228 ic-site-nav-marketing">
        <div className="Pixso-frame-9_1229">
          <ServicesNavItem className="Pixso-paragraph-9_1230" />
        </div>
        <div className="Pixso-frame-9_1231">
          <PortfolioNavItem className="Pixso-paragraph-9_1232" />
        </div>
        <div className="Pixso-frame-9_1545">
          <CalculatorNavItem className="Pixso-paragraph-9_1546" />
        </div>
        <div className="Pixso-frame-9_1233">
          <ContactsNavItem className="Pixso-paragraph-9_1234" />
        </div>
      </div>
      <DiscussProjectLink className="Pixso-frame-9_1235">
        <p className="Pixso-paragraph-9_1236">Обсудить проект</p>
      </DiscussProjectLink>
    </div>
  )
}

export function PortfolioPageHeader() {
  return (
    <div className="frame-content-9_1336">
      <LinkLogo
        wrapClass="Pixso-frame-9_1337"
        cells={[1847, 1848, 1849, 1850, 1851, 1852, 1853, 1854, 1855]}
        iconFrame="Pixso-frame-9_1338"
        iconContent="frame-content-9_1338"
        titleClass="Pixso-paragraph-9_1339"
      />
      <div className="Pixso-frame-9_1340 ic-site-nav-marketing">
        <div className="Pixso-frame-9_1341">
          <ServicesNavItem className="Pixso-paragraph-9_1342" />
        </div>
        <div className="Pixso-frame-9_1343">
          <PortfolioNavItem className="Pixso-paragraph-9_1344" />
        </div>
        <div className="Pixso-frame-9_1547">
          <CalculatorNavItem className="Pixso-paragraph-9_1548" />
        </div>
        <div className="Pixso-frame-9_1345">
          <ContactsNavItem className="Pixso-paragraph-9_1346" />
        </div>
      </div>
      <DiscussProjectLink className="Pixso-frame-9_1347">
        <p className="Pixso-paragraph-9_1348">Обсудить проект</p>
      </DiscussProjectLink>
    </div>
  )
}

export function ContactsPageHeader() {
  return (
    <div className="frame-content-9_1440">
      <LinkLogo
        wrapClass="Pixso-frame-9_1441"
        cells={[1862, 1863, 1864, 1865, 1866, 1867, 1868, 1869, 1870]}
        iconFrame="Pixso-frame-9_1442"
        iconContent="frame-content-9_1442"
        titleClass="Pixso-paragraph-9_1443"
      />
      <div className="Pixso-frame-9_1444 ic-site-nav-marketing">
        <div className="Pixso-frame-9_1445">
          <ServicesNavItem className="Pixso-paragraph-9_1446" />
        </div>
        <div className="Pixso-frame-9_1447">
          <PortfolioNavItem className="Pixso-paragraph-9_1448" />
        </div>
        <div className="Pixso-frame-9_1549">
          <CalculatorNavItem className="Pixso-paragraph-9_1550" />
        </div>
        <div className="Pixso-frame-9_1449">
          <ContactsNavItem className="Pixso-paragraph-9_1450" />
        </div>
      </div>
      <DiscussProjectLink className="Pixso-frame-9_1451">
        <p className="Pixso-paragraph-9_1452">Обсудить проект</p>
      </DiscussProjectLink>
    </div>
  )
}
