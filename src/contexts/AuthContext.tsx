import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null; user: User | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from('admin_roles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
    setIsAdmin(!!data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        checkAdmin(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
      if (session?.user) {
        ;(async () => {
          await checkAdmin(session.user.id)
        })()
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { error: error as Error | null, user: data.user }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      isAdmin,
      loading,
      signIn,
      signUp,
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
