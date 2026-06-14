import { Link, type To } from 'react-router-dom'
import type { ReactNode } from 'react'

export function CrmNavLink({ to, children }: { to: To; children: ReactNode }) {
  return (
    <Link to={to} className="ic-crm-nav-link">
      {children}
    </Link>
  )
}
