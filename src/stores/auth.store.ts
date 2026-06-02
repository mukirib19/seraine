import { create } from 'zustand'

interface Profile {
  id: string
  full_name: string
  phone?: string | null
  avatar_url?: string | null
  role: string
  account_type?: string | null
  business_name?: string | null
  dark_mode?: boolean
  display_id?: string | null
  created_at?: string
}

interface AuthState {
  user: { id: string; email: string } | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  role: string | null
  setUser: (user: { id: string; email: string } | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  role: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile, role: profile?.role ?? null }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, profile: null, isAuthenticated: false, role: null, isLoading: false }),
}))
