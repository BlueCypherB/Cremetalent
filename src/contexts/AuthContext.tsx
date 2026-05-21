import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type UserRole = 'admin' | 'talent' | 'client' | null

interface AuthContextValue {
  session: Session | null
  user: User | null
  role: UserRole
  isAdmin: boolean
  isTalent: boolean
  isClient: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function detectRole(userId: string): Promise<UserRole> {
  const { data: admin } = await supabase
    .from('admin_users')
    .select('is_active')
    .eq('id', userId)
    .maybeSingle()
  if (admin?.is_active) return 'admin'

  const { data: talent } = await supabase
    .from('talent_applications')
    .select('id, status')
    .eq('user_id', userId)
    .maybeSingle()
  if (talent?.status === 'approved') return 'talent'

  const { data: client } = await supabase
    .from('client_accounts')
    .select('is_active')
    .eq('id', userId)
    .maybeSingle()
  if (client?.is_active) return 'client'

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setRole(await detectRole(session.user.id))
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true)
      setSession(session)
      if (session?.user) {
        setRole(await detectRole(session.user.id))
      } else {
        setRole(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      role,
      isAdmin: role === 'admin',
      isTalent: role === 'talent',
      isClient: role === 'client',
      loading,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
