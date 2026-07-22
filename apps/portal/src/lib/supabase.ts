import { createClient } from '@supabase/supabase-js'

const rawApiUrl = (import.meta.env.VITE_SUPABASE_URL || 'http://supabase.pixelwaverf.ru')
  .trim()
  .replace(/\/$/, '')

const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

function resolveSupabaseUrl(): string {
  if (typeof window !== 'undefined') return `${window.location.origin}/supabase-api`
  if (import.meta.env.DEV) return 'http://127.0.0.1:5174/supabase-api'
  return rawApiUrl
}

export const supabase = createClient(resolveSupabaseUrl(), anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
