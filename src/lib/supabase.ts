import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    // Bypass Web Locks API — concurrent getSession + signIn calls fight over
    // the same lock and one gets stolen, preventing the session from saving.
    lock: (_name, _acquireTimeout, fn) => fn(),
  },
})
