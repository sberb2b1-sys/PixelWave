import type { CalculatorConfig, Lead } from '@/types/app'
import { DEFAULT_CONFIG } from '@/lib/defaults'

const CONFIG_KEY = 'webcalc-pro-config'
const LEADS_KEY = 'webcalc-pro-leads'

export function loadConfig(): CalculatorConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (!raw) return DEFAULT_CONFIG
    const saved = JSON.parse(raw) as Partial<CalculatorConfig>
    const defaultPages =
      saved.defaultPages === 7 ? DEFAULT_CONFIG.defaultPages : (saved.defaultPages ?? DEFAULT_CONFIG.defaultPages)
    const config = {
      ...DEFAULT_CONFIG,
      ...saved,
      timelines: DEFAULT_CONFIG.timelines,
      defaultPages,
    } as CalculatorConfig
    if (saved.defaultPages === 7 || saved.timelines?.join() !== DEFAULT_CONFIG.timelines.join()) {
      saveConfig(config)
    }
    return config
  } catch {
    return DEFAULT_CONFIG
  }
}

export function saveConfig(config: CalculatorConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY)
    return raw ? (JSON.parse(raw) as Lead[]) : []
  } catch {
    return []
  }
}

export function saveLeads(leads: Lead[]): void {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}
