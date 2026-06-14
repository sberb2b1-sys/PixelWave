export const SITE_PATHS = {
  home: '/',
  services: '/',
  calculator: '/calculator',
  portfolio: '/portfolio',
  contacts: '/contacts',
} as const

export type SiteNavKey = 'services' | 'portfolio' | 'calculator' | 'contacts'

export const PORTFOLIO_ENABLED = false
