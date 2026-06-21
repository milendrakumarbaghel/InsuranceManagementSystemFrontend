import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const userRaw = localStorage.getItem('user')
      if (token && userRaw) {
        setUser(JSON.parse(userRaw))
        setIsAuthenticated(true)
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (authUser) => {
    const normalised = {
      ...authUser,
      role: (authUser.role ?? '').replace(/^ROLE_/, ''),
    }
    localStorage.setItem('token', normalised.token)
    localStorage.setItem('user', JSON.stringify(normalised))
    setUser(normalised)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
