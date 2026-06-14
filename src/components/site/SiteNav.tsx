import { Link } from 'react-router-dom'
import { SITE_PATHS, type SiteNavKey } from '@/components/site/paths'
import {
  CalculatorNavItem,
  ContactsNavItem,
  DiscussProjectLink,
  PortfolioNavItem,
  ServicesNavItem,
} from '@/components/site/SiteNavItems'

const LOGO_CELLS: Record<string, number[]> = {
  '218': [1628, 1629, 1630, 1631, 1632, 1633, 1634, 1635],
  '51': [1651, 1652, 1653, 1654, 1655, 1656, 1657, 1658, 1659],
  '5113': [1669, 1670, 1671, 1672, 1673, 1674, 1675, 1676, 1677],
  '5224': [1687, 1688, 1689, 1690, 1691, 1692, 1693, 1694, 1695],
}

function LogoGrid({ cells }: { cells: number[] }) {
  return (
    <>
      {cells.map((n) => (
        <div key={n} className={`Pixso-frame-9_${n}`} />
      ))}
    </>
  )
}

type LogoVariant = keyof typeof LOGO_CELLS

export function SiteLogo({
  variant,
  iconFrame,
  iconContent,
  textFrame,
  titleClass,
  subtitleClass,
}: {
  variant: LogoVariant
  iconFrame: string
  iconContent: string
  textFrame: string
  titleClass: string
  subtitleClass: string
}) {
  const cells = LOGO_CELLS[variant]
  const logoWrap =
    variant === '218'
      ? 'Pixso-frame-2_20'
      : variant === '51'
        ? 'Pixso-frame-5_3'
        : variant === '5113'
          ? 'Pixso-frame-5_115'
          : 'Pixso-frame-5_226'

  return (
    <Link to={SITE_PATHS.home} className={`${logoWrap} ic-site-logo`}>
      <div className={iconFrame}>
        <div className={iconContent}>
          <LogoGrid cells={cells} />
        </div>
      </div>
      <div className={textFrame}>
        <p className={titleClass}>PixelWave</p>
        <p className={subtitleClass}>web-разработка</p>
      </div>
    </Link>
  )
}

type NavItem = { key: SiteNavKey; className: string }

function renderNavItem(item: NavItem) {
  if (item.key === 'services') return <ServicesNavItem className={item.className} />
  if (item.key === 'portfolio') return <PortfolioNavItem className={item.className} />
  if (item.key === 'calculator') return <CalculatorNavItem className={item.className} />
  return <ContactsNavItem className={item.className} />
}

function NavItems218() {
  const items: NavItem[] = [
    { key: 'services', className: 'Pixso-paragraph-2_25' },
    { key: 'portfolio', className: 'Pixso-paragraph-2_26' },
    { key: 'calculator', className: 'Pixso-paragraph-2_27' },
    { key: 'contacts', className: 'Pixso-paragraph-2_28' },
  ]
  return (
    <div className="Pixso-frame-2_24 ic-site-nav">
      {items.map((item) => (
        <div key={item.key}>{renderNavItem(item)}</div>
      ))}
    </div>
  )
}

function NavItems51() {
  const items: NavItem[] = [
    { key: 'services', className: 'Pixso-paragraph-5_8' },
    { key: 'portfolio', className: 'Pixso-paragraph-5_9' },
    { key: 'calculator', className: 'Pixso-paragraph-5_10' },
    { key: 'contacts', className: 'Pixso-paragraph-5_11' },
  ]
  return (
    <div className="Pixso-frame-5_7 ic-site-nav">
      {items.map((item) => (
        <div key={item.key}>{renderNavItem(item)}</div>
      ))}
    </div>
  )
}

function NavItems5113() {
  const items: NavItem[] = [
    { key: 'services', className: 'Pixso-paragraph-5_120' },
    { key: 'portfolio', className: 'Pixso-paragraph-5_121' },
    { key: 'calculator', className: 'Pixso-paragraph-5_122' },
    { key: 'contacts', className: 'Pixso-paragraph-5_123' },
  ]
  return (
    <div className="Pixso-frame-5_119 ic-site-nav">
      {items.map((item) => (
        <div key={item.key}>{renderNavItem(item)}</div>
      ))}
    </div>
  )
}

function NavItems5224() {
  const items: NavItem[] = [
    { key: 'services', className: 'Pixso-paragraph-5_231' },
    { key: 'portfolio', className: 'Pixso-paragraph-5_232' },
    { key: 'calculator', className: 'Pixso-paragraph-5_233' },
    { key: 'contacts', className: 'Pixso-paragraph-5_234' },
  ]
  return (
    <div className="Pixso-frame-5_230 ic-site-nav">
      {items.map((item) => (
        <div key={item.key}>{renderNavItem(item)}</div>
      ))}
    </div>
  )
}

export function Cta218() {
  return (
    <DiscussProjectLink className="Pixso-frame-2_29">
      <div className="frame-content-2_29"><p className="Pixso-paragraph-2_30">Обсудить проект</p></div>
    </DiscussProjectLink>
  )
}

export function Cta51() {
  return (
    <DiscussProjectLink className="Pixso-frame-5_12">
      <div className="frame-content-5_12"><p className="Pixso-paragraph-5_13">Обсудить проект</p></div>
    </DiscussProjectLink>
  )
}

export function Cta5113() {
  return (
    <DiscussProjectLink className="Pixso-frame-5_124">
      <div className="frame-content-5_124"><p className="Pixso-paragraph-5_125">Обсудить проект</p></div>
    </DiscussProjectLink>
  )
}

export function Cta5224() {
  return (
    <DiscussProjectLink className="Pixso-frame-5_235">
      <div className="frame-content-5_235"><p className="Pixso-paragraph-5_236">Обсудить проект</p></div>
    </DiscussProjectLink>
  )
}

export function Header218() {
  return (
    <div className="stroke-wrapper-2_19">
      <div className="Pixso-frame-2_19">
        <div className="frame-content-2_19">
          <SiteLogo
            variant="218"
            iconFrame="Pixso-frame-2_21"
            iconContent="frame-content-2_21"
            textFrame="Pixso-frame-9_1636"
            titleClass="Pixso-paragraph-9_1637"
            subtitleClass="Pixso-paragraph-9_1638"
          />
          <NavItems218 />
          <Cta218 />
        </div>
      </div>
      <div className="stroke-2_19" />
    </div>
  )
}

export function Header51() {
  return (
    <div className="Pixso-frame-5_2">
      <div className="frame-content-5_2">
        <SiteLogo
          variant="51"
          iconFrame="Pixso-frame-5_4"
          iconContent="frame-content-5_4"
          textFrame="Pixso-frame-9_1660"
          titleClass="Pixso-paragraph-9_1661"
          subtitleClass="Pixso-paragraph-9_1662"
        />
        <NavItems51 />
        <Cta51 />
      </div>
    </div>
  )
}

export function Header5113() {
  return (
    <div className="Pixso-frame-5_114">
      <div className="frame-content-5_114">
        <SiteLogo
          variant="5113"
          iconFrame="Pixso-frame-5_116"
          iconContent="frame-content-5_116"
          textFrame="Pixso-frame-9_1678"
          titleClass="Pixso-paragraph-9_1679"
          subtitleClass="Pixso-paragraph-9_1680"
        />
        <NavItems5113 />
        <Cta5113 />
      </div>
    </div>
  )
}

export function Header5224() {
  return (
    <div className="Pixso-frame-5_225">
      <div className="frame-content-5_225">
        <SiteLogo
          variant="5224"
          iconFrame="Pixso-frame-5_227"
          iconContent="frame-content-5_227"
          textFrame="Pixso-frame-9_1696"
          titleClass="Pixso-paragraph-9_1697"
          subtitleClass="Pixso-paragraph-9_1698"
        />
        <NavItems5224 />
        <Cta5224 />
      </div>
    </div>
  )
}
