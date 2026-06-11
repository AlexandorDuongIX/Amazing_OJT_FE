import { create } from 'zustand'

export interface MockUser {
  id: string
  email: string
  name: string
  role: 'Customer'
}

interface AuthStore {
  user: MockUser | null
  login: (email: string) => void
  register: (email: string) => void
  logout: () => void
}

const STORAGE_KEY = 'amazing_mock_user'

const readStoredUser = (): MockUser | null => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as MockUser) : null
  } catch {
    return null
  }
}

const persistUser = (user: MockUser | null) => {
  if (typeof window === 'undefined') return

  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

const createMockUser = (email: string): MockUser => ({
  id: `mock-${Date.now()}`,
  email,
  name: email.split('@')[0] || 'Amazing Customer',
  role: 'Customer',
})

export const useAuthStore = create<AuthStore>((set) => ({
  user: readStoredUser(),

  login: (email: string) => {
    const user = createMockUser(email)
    persistUser(user)
    set({ user })
  },

  register: (email: string) => {
    const user = createMockUser(email)
    persistUser(user)
    set({ user })
  },

  logout: () => {
    persistUser(null)
    set({ user: null })
  },
}))
