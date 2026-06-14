import { Outlet } from 'react-router-dom'
import CrmSidebar from '@/components/crm/CrmSidebar'
import '@/styles/Frame9274.css'
import '@/styles/interactive.css'

export default function CrmLayout() {
  return (
    <div className="Pixso-frame-9_274 ic-crm-layout-root">
      <CrmSidebar />
      <main className="ic-crm-main">
        <Outlet />
      </main>
    </div>
  )
}
