import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PORTFOLIO_ENABLED, SITE_PATHS } from '@/components/site/paths'

export function navClass(isActive: boolean) {
  return isActive ? 'ic-nav-link is-active' : 'ic-nav-link'
}

export function PortfolioNavItem({ className }: { className: string }) {
  if (PORTFOLIO_ENABLED) {
    return (
      <NavLink to={SITE_PATHS.portfolio} className={({ isActive }) => navClass(isActive)}>
        <p className={className}>Портфолио</p>
      </NavLink>
    )
  }

  return (
    <span className="ic-nav-link is-disabled" aria-disabled="true" title="Скоро">
      <p className={className}>Портфолио</p>
    </span>
  )
}

export function ServicesNavItem({ className }: { className: string }) {
  return (
    <NavLink to={SITE_PATHS.services} end className={({ isActive }) => navClass(isActive)}>
      <p className={className}>Услуги</p>
    </NavLink>
  )
}

export function CalculatorNavItem({ className }: { className: string }) {
  return (
    <NavLink to={SITE_PATHS.calculator} end className={({ isActive }) => navClass(isActive)}>
      <p className={className}>Калькулятор</p>
    </NavLink>
  )
}

export function ContactsNavItem({ className }: { className: string }) {
  return (
    <NavLink to={SITE_PATHS.contacts} className={({ isActive }) => navClass(isActive)}>
      <p className={className}>Контакты</p>
    </NavLink>
  )
}

export function DiscussProjectLink({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  return (
    <Link to={SITE_PATHS.contacts} className={`ic-btn ${className}`}>
      {children}
    </Link>
  )
}
