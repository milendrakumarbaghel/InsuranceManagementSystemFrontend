import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function normalizeAuthUser(authUser) {
  return {
    ...authUser,
    role: (authUser?.role ?? '').replace(/^ROLE_/, ''),
  }
}

function readStoredAuthUser() {
  try {
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')

    if (token && userRaw) {
      const normalized = normalizeAuthUser(JSON.parse(userRaw))
      localStorage.setItem('user', JSON.stringify(normalized))
      return normalized
    }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuthUser())
  const isAuthenticated = !!user
  const isLoading = false

  const login = (authUser) => {
    const normalised = normalizeAuthUser(authUser)
    localStorage.setItem('token', normalised.token)
    localStorage.setItem('user', JSON.stringify(normalised))
    setUser(normalised)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
