import { create } from 'zustand'
import type { AuthResponse } from '../../../types/auth'

export interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  name: string // Cho Navbar.tsx dễ sử dụng (ví dụ: FirstName + LastName)
  role: string
  token: string
}

interface AuthStore {
  user: AuthUser | null
  login: (data: AuthResponse) => void
  logout: () => void
}

const STORAGE_KEY = 'amazing_auth_user'

const readStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

const persistUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return

  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    window.localStorage.setItem('token', user.token) // Cho axiosClient lấy token
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem('token')
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: readStoredUser(),

  login: (data: AuthResponse) => {
    const user: AuthUser = {
      id: data.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`.trim(),
      role: data.role,
      token: data.token,
    }
    persistUser(user)
    set({ user })
  },

  logout: () => {
    persistUser(null)
    set({ user: null })
  },
}))
