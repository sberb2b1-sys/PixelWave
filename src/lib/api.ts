import type { AnalyticsData, Client, CrmSettings, Lead } from '@/types/app'

const API = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json() as Promise<T>
}

export const api = {
  getClients: () => request<Client[]>('/clients'),
  createClient: (data: Omit<Client, 'id' | 'source' | 'createdAt'>) =>
    request<Client>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  deleteClient: (id: string) => request<{ ok: boolean }>(`/clients/${id}`, { method: 'DELETE' }),

  getLeads: () => request<Lead[]>('/leads'),
  syncLeads: (leads: Lead[]) => request<{ ok: boolean }>('/leads', { method: 'PUT', body: JSON.stringify(leads) }),
  updateLeadStatus: (id: string, status: Lead['status']) =>
    request<Lead>(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteLead: (id: string) => request<{ ok: boolean }>(`/leads/${id}`, { method: 'DELETE' }),

  getSettings: () => request<Record<string, unknown>>('/settings').then((data) => ({
    profileName: String(data.profileName ?? ''),
    profileEmail: String(data.profileEmail ?? ''),
    profilePhone: String(data.profilePhone ?? ''),
  })),
  saveSettings: (settings: Partial<CrmSettings>) =>
    request<CrmSettings>('/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  getAnalytics: () => request<AnalyticsData>('/analytics'),
}
