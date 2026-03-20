import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_user')) } catch { return null }
  })

  const login = useCallback(async (data) => {
    const res = await api.post('/auth/login', data)
    setUser(res.data.user)
    localStorage.setItem('sp_user', JSON.stringify(res.data.user))
    return res.data.user
  }, [])

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data)
    setUser(res.data.user)
    localStorage.setItem('sp_user', JSON.stringify(res.data.user))
    return res.data.user
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout')
    setUser(null)
    localStorage.removeItem('sp_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
