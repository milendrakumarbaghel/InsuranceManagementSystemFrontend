import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/authApi.js'
import {
  AUTH_CLEARED_EVENT,
  clearAuthStorage,
  readStoredAuthUser,
  storeAuthSession,
} from '../utils/authStorage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuthUser())
  const isAuthenticated = !!user
  const isLoading = false

  useEffect(() => {
    const handleAuthCleared = () => setUser(null)
    const handleStorage = (event) => {
      if (['accessToken', 'refreshToken', 'token', 'user'].includes(event.key)) {
        setUser(readStoredAuthUser())
      }
    }

    window.addEventListener(AUTH_CLEARED_EVENT, handleAuthCleared)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(AUTH_CLEARED_EVENT, handleAuthCleared)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const login = (authUser) => {
    const normalised = storeAuthSession(authUser)
    setUser(normalised)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuthStorage({ notify: false })
    }

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
