export type LeadStatus = 'new' | 'work' | 'discussion' | 'done'
export type ContentReady = 'full' | 'partial' | 'none'

export interface SiteTypeConfig {
  id: string
  title: string
  basePrice: number
  devBase: number
}

export interface FeatureConfig {
  id: string
  title: string
  price: number
  enabled: boolean
}

export interface DesignConfig {
  id: string
  title: string
  multiplier: number
}

export interface CalculatorConfig {
  siteTypes: SiteTypeConfig[]
  features: FeatureConfig[]
  designs: DesignConfig[]
  pricePerPage: number
  designRatio: number
  seoRatio: number
  defaultPages: number
  minPages: number
  maxPages: number
  timelineText: string
  timelines: string[]
  budgets: string[]
  contentReadyFees: Record<ContentReady, number>
  whyUs: string[]
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  contact: string
  comment: string
  siteTypeId: string
  siteTypeTitle: string
  pages: number
  featureIds: string[]
  contentReady: ContentReady
  designId: string
  designTitle: string
  timeline: string
  budget: string
  total: number
  breakdown: { label: string; amount: number }[]
  status: LeadStatus
  createdAt: string
}

export interface CalculatorSession {
  step: number
  siteTypeId: string
  pages: number
  featureIds: string[]
  contentReady: ContentReady
  designId: string
  timeline: string
  budget: string
  name: string
  contact: string
  comment: string
  submitted: boolean
}

export interface PriceBreakdown {
  total: number
  timeline: string
  lines: { label: string; amount: number }[]
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  projectType: string
  budget: number
  comment: string
  source: 'manual' | 'lead'
  createdAt: string
  leadsCount?: number
  totalSpent?: number
  lastActivity?: string
}

export interface CrmSettings {
  profileName: string
  profileEmail: string
  profilePhone: string
}

export interface AnalyticsData {
  totalRevenue: number
  monthRevenue: number
  newLeads: number
  inWork: number
  done: number
  totalLeads: number
  totalClients: number
  conversion: number
  byStatus: Record<LeadStatus, number>
  bySiteType: Record<string, number>
  recentLeads: Lead[]
}

export const STEP_TITLES = [
  'Тип сайта',
  'Функционал',
  'Параметры',
  'Связь',
] as const
