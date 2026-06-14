import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { calculatePrice } from '@/lib/calculator'
import { DEFAULT_CONFIG, DEFAULT_SESSION } from '@/lib/defaults'
import { api } from '@/lib/api'
import { loadConfig, loadLeads, saveConfig, saveLeads } from '@/lib/storage'
import type {
  AnalyticsData,
  CalculatorConfig,
  CalculatorSession,
  Client,
  CrmSettings,
  Lead,
  LeadStatus,
  PriceBreakdown,
} from '@/types/app'

const DEFAULT_SETTINGS: CrmSettings = {
  profileName: 'Алексей Кузнецов',
  profileEmail: 'aleksey@webcalcpro.ru',
  profilePhone: '+7 999 123-45-67',
}

const EMPTY_ANALYTICS: AnalyticsData = {
  totalRevenue: 0,
  monthRevenue: 0,
  newLeads: 0,
  inWork: 0,
  done: 0,
  totalLeads: 0,
  totalClients: 0,
  conversion: 0,
  byStatus: { new: 0, work: 0, discussion: 0, done: 0 },
  bySiteType: {},
  recentLeads: [],
}

interface AppContextValue {
  config: CalculatorConfig
  session: CalculatorSession
  leads: Lead[]
  clients: Client[]
  settings: CrmSettings
  analytics: AnalyticsData
  breakdown: PriceBreakdown
  updateSession: (patch: Partial<CalculatorSession>) => void
  nextStep: () => void
  prevStep: () => void
  toggleFeature: (id: string) => void
  submitLead: () => boolean
  updateConfig: (config: CalculatorConfig) => void
  resetConfig: () => void
  updateLeadStatus: (id: string, status: LeadStatus) => void
  deleteLead: (id: string) => void
  createClient: (data: Omit<Client, 'id' | 'source' | 'createdAt'>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  saveSettings: (settings: Partial<CrmSettings>) => Promise<void>
  refreshAnalytics: () => Promise<void>
  refreshClients: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CalculatorConfig>(() => loadConfig())
  const [session, setSession] = useState<CalculatorSession>(() => ({
    ...DEFAULT_SESSION,
    siteTypeId: loadConfig().siteTypes[0]?.id ?? 'landing',
    designId: loadConfig().designs[0]?.id ?? 'template',
    timeline: loadConfig().timelines[0] ?? '5 дней',
    budget: loadConfig().budgets[0] ?? 'до 10 000 ₽',
  }))
  const [leads, setLeads] = useState<Lead[]>(() => loadLeads())
  const [clients, setClients] = useState<Client[]>([])
  const [settings, setSettings] = useState<CrmSettings>(DEFAULT_SETTINGS)
  const [analytics, setAnalytics] = useState<AnalyticsData>(EMPTY_ANALYTICS)
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const apiReady = useRef(false)

  const breakdown = useMemo(() => calculatePrice(config, session), [config, session])

  const syncLeadsToApi = useCallback((next: Lead[]) => {
    if (!apiReady.current) return
    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      api.syncLeads(next).catch(() => {})
    }, 400)
  }, [])

  const persistLeads = useCallback(
    (next: Lead[]) => {
      setLeads(next)
      saveLeads(next)
      syncLeadsToApi(next)
    },
    [syncLeadsToApi],
  )

  const refreshClients = useCallback(async () => {
    try {
      const data = await api.getClients()
      setClients(data)
    } catch {
      /* API offline */
    }
  }, [])

  const refreshAnalytics = useCallback(async () => {
    try {
      const data = await api.getAnalytics()
      setAnalytics(data)
    } catch {
      /* API offline */
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const [apiLeads, apiSettings] = await Promise.all([
          api.getLeads(),
          api.getSettings(),
        ])
        apiReady.current = true

        if (cancelled) return

        const local = loadLeads()
        const merged = apiLeads.length > 0 ? apiLeads : local
        setLeads(merged)
        saveLeads(merged)
        if (apiLeads.length === 0 && local.length > 0) {
          await api.syncLeads(local)
        }

        setSettings({
          profileName: String(apiSettings.profileName ?? DEFAULT_SETTINGS.profileName),
          profileEmail: String(apiSettings.profileEmail ?? DEFAULT_SETTINGS.profileEmail),
          profilePhone: String(apiSettings.profilePhone ?? DEFAULT_SETTINGS.profilePhone),
        })

        await refreshClients()
        await refreshAnalytics()
      } catch {
        apiReady.current = false
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [refreshAnalytics, refreshClients])

  const updateSession = useCallback((patch: Partial<CalculatorSession>) => {
    setSession((prev) => ({ ...prev, ...patch }))
  }, [])

  const nextStep = useCallback(() => {
    setSession((prev) => ({ ...prev, step: Math.min(prev.step + 1, 3) }))
  }, [])

  const prevStep = useCallback(() => {
    setSession((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }))
  }, [])

  const toggleFeature = useCallback((id: string) => {
    setSession((prev) => ({
      ...prev,
      featureIds: prev.featureIds.includes(id)
        ? prev.featureIds.filter((f) => f !== id)
        : [...prev.featureIds, id],
    }))
  }, [])

  const submitLead = useCallback(() => {
    if (!session.name.trim() || !session.contact.trim()) return false

    const site = config.siteTypes.find((s) => s.id === session.siteTypeId)!
    const design = config.designs.find((d) => d.id === session.designId)!
    const price = calculatePrice(config, { ...session, step: 3 })

    const contact = session.contact.trim()
    const isEmail = contact.includes('@')

    const lead: Lead = {
      id: crypto.randomUUID(),
      name: session.name.trim(),
      email: isEmail ? contact : '',
      phone: isEmail ? '' : contact,
      contact,
      comment: session.comment.trim(),
      siteTypeId: session.siteTypeId,
      siteTypeTitle: site.title,
      pages: session.pages,
      featureIds: session.featureIds,
      contentReady: session.contentReady,
      designId: session.designId,
      designTitle: design.title,
      timeline: session.timeline,
      budget: session.budget,
      total: price.total,
      breakdown: price.lines,
      status: 'new',
      createdAt: new Date().toISOString(),
    }

    const next = [lead, ...leads]
    setLeads(next)
    saveLeads(next)
    setSession((prev) => ({ ...prev, submitted: true }))

    if (apiReady.current) {
      api.createLead(lead).then(() => {
        refreshClients()
        refreshAnalytics()
      }).catch(() => {
        syncLeadsToApi(next)
        refreshClients()
        refreshAnalytics()
      })
    } else {
      refreshClients()
      refreshAnalytics()
    }

    return true
  }, [config, session, leads, syncLeadsToApi, refreshClients, refreshAnalytics])

  const updateConfig = useCallback((next: CalculatorConfig) => {
    setConfig(next)
    saveConfig(next)
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG)
    saveConfig(DEFAULT_CONFIG)
  }, [])

  const updateLeadStatus = useCallback(
    (id: string, status: LeadStatus) => {
      const next = leads.map((l) => (l.id === id ? { ...l, status } : l))
      persistLeads(next)
      if (apiReady.current) {
        api.updateLeadStatus(id, status).then(() => refreshAnalytics()).catch(() => {})
      }
    },
    [leads, persistLeads, refreshAnalytics],
  )

  const deleteLead = useCallback(
    (id: string) => {
      const next = leads.filter((l) => l.id !== id)
      persistLeads(next)
      if (apiReady.current) {
        api.deleteLead(id).then(() => refreshAnalytics()).catch(() => {})
      } else {
        refreshAnalytics()
      }
    },
    [leads, persistLeads, refreshAnalytics],
  )

  const createClient = useCallback(
    async (data: Omit<Client, 'id' | 'source' | 'createdAt'>) => {
      const client = await api.createClient(data)
      setClients((prev) => [client, ...prev])
      await refreshAnalytics()
    },
    [refreshAnalytics],
  )

  const deleteClient = useCallback(
    async (id: string) => {
      if (id.startsWith('lead-')) {
        const leadId = id.slice(5)
        const next = leads.filter((l) => l.id !== leadId)
        persistLeads(next)
        if (apiReady.current) {
          await api.deleteLead(leadId).catch(() => {})
        }
      } else {
        await api.deleteClient(id)
      }
      await refreshClients()
      await refreshAnalytics()
    },
    [leads, persistLeads, refreshClients, refreshAnalytics],
  )

  const saveSettings = useCallback(async (patch: Partial<CrmSettings>) => {
    const next = await api.saveSettings(patch)
    setSettings({
      profileName: String(next.profileName ?? settings.profileName),
      profileEmail: String(next.profileEmail ?? settings.profileEmail),
      profilePhone: String(next.profilePhone ?? settings.profilePhone),
    })
  }, [settings])

  const value = useMemo(
    () => ({
      config,
      session,
      leads,
      clients,
      settings,
      analytics,
      breakdown,
      updateSession,
      nextStep,
      prevStep,
      toggleFeature,
      submitLead,
      updateConfig,
      resetConfig,
      updateLeadStatus,
      deleteLead,
      createClient,
      deleteClient,
      saveSettings,
      refreshAnalytics,
      refreshClients,
    }),
    [
      config,
      session,
      leads,
      clients,
      settings,
      analytics,
      breakdown,
      updateSession,
      nextStep,
      prevStep,
      toggleFeature,
      submitLead,
      updateConfig,
      resetConfig,
      updateLeadStatus,
      deleteLead,
      createClient,
      deleteClient,
      saveSettings,
      refreshAnalytics,
      refreshClients,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
