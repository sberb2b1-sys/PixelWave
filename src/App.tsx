import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppProvider'
import CalculatorPage from '@/pages/CalculatorPage'
import MobileCalculatorPage from '@/pages/MobileCalculatorPage'
import CrmLayout from '@/components/crm/CrmLayout'
import AnalyticsPanel from '@/components/crm/AnalyticsPanel'
import LeadsPanel from '@/components/crm/LeadsPanel'
import ClientsPanel from '@/components/crm/ClientsPanel'
import PricingPanel from '@/components/crm/PricingPanel'
import SettingsPanel from '@/components/crm/SettingsPanel'
import Frame218 from '@/views/Frame218'
import Frame51 from '@/views/Frame51'
import Frame5113 from '@/views/Frame5113'
import Frame5224 from '@/views/Frame5224'
import Frame2146 from '@/views/Frame2146'
import Frame2367 from '@/views/Frame2367'
import Frame2442 from '@/views/Frame2442'
import Frame912 from '@/views/Frame912'
import Frame91223 from '@/views/Frame91223'
import Frame91335 from '@/views/Frame91335'
import Frame91439 from '@/views/Frame91439'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Frame91223 />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/services" element={<Navigate to="/" replace />} />
          <Route path="/portfolio" element={<Navigate to="/" replace />} />
          <Route path="/contacts" element={<Frame91439 />} />
          <Route path="/dashboard" element={<CrmLayout />}>
            <Route index element={<AnalyticsPanel />} />
            <Route path="analytics" element={<Navigate to="/dashboard" replace />} />
            <Route path="leads" element={<LeadsPanel />} />
            <Route path="clients" element={<ClientsPanel />} />
            <Route path="pricing" element={<PricingPanel />} />
            <Route path="settings" element={<SettingsPanel />} />
          </Route>
          <Route path="/admin" element={<Navigate to="/dashboard/pricing" replace />} />
          <Route path="/mobile" element={<MobileCalculatorPage />} />
          <Route path="/preview/calculator" element={<Frame218 />} />
          <Route path="/preview/step-2" element={<Frame51 />} />
          <Route path="/preview/step-3" element={<Frame5113 />} />
          <Route path="/preview/step-4" element={<Frame5224 />} />
          <Route path="/preview/dashboard" element={<Frame2146 />} />
          <Route path="/preview/admin" element={<Frame912 />} />
          <Route path="/preview/services" element={<Frame91223 />} />
          <Route path="/preview/portfolio" element={<Frame91335 />} />
          <Route path="/preview/contacts" element={<Frame91439 />} />
          <Route path="/preview/mobile" element={<Frame2367 />} />
          <Route path="/dashboard/mobile" element={<Frame2442 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
