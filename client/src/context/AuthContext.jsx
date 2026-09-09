import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import AuthContext from './authContext'
import { getApiErrorMessage } from '../utils/apiError'

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(() => localStorage.getItem('ats_token'))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('ats_user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const isAuthenticated = Boolean(user && token)

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authService.getCurrentUser()
        localStorage.setItem('ats_user', JSON.stringify(response.user))
        setUser(response.user)
      } catch {
        localStorage.removeItem('ats_token')
        localStorage.removeItem('ats_user')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [token])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('ats_token', response.token)
      localStorage.setItem('ats_user', JSON.stringify(response.user))
      setToken(response.token)
      setUser(response.user)
      return response.user
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error })
    }
  }

  const register = async (payload) => {
    try {
      const response = await authService.register(payload)
      localStorage.setItem('ats_token', response.token)
      localStorage.setItem('ats_user', JSON.stringify(response.user))
      setToken(response.token)
      setUser(response.user)
      return response.user
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error })
    }
  }

  const logout = useCallback(async () => {
    const currentToken = token

    localStorage.removeItem('ats_token')
    localStorage.removeItem('ats_user')
    setToken(null)
    setUser(null)

    try {
      queryClient.clear()
    } catch {
      // Local cache cleanup errors ignored
    }

    if (currentToken) {
      try {
        await authService.logout()
      } catch {
        // Stateless token logout on backend is best-effort
      }
    }
  }, [queryClient, token])

  const updateUser = useCallback((userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('ats_user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('ats_user')
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, loading, isAuthenticated, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
