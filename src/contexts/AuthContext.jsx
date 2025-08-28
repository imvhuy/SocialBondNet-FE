import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication on app start and listen for logout events
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')
        const savedUser = localStorage.getItem('user')

        if (token && refreshToken && savedUser) {
          // Try to validate token with backend
          try {
            const currentUser = await authService.getCurrentUser()
            setUser(currentUser)
            setIsAuthenticated(true)
          } catch (error) {
            console.warn('Token validation failed:', error.message)
            // If validation fails, try refresh token
            try {
              await authService.refreshToken()
              const currentUser = await authService.getCurrentUser()
              setUser(currentUser)
              setIsAuthenticated(true)
            } catch (refreshError) {
              console.warn('Token refresh failed:', refreshError.message)
              // Clear invalid auth data
              logout()
            }
          }
        } else {
          // Missing auth data
          logout()
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Listen for logout events from apiClient interceptor
  useEffect(() => {
    const handleAuthLogout = (event) => {
      console.log('Logout event received:', event.detail?.reason)
      logout()
    }

    window.addEventListener('auth:logout', handleAuthLogout)

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout)
    }
  }, [])

  const login = (userData, accessToken, refreshToken) => {
    // Extract username from email if not provided
    const userWithUsername = {
      ...userData,
      username: userData.username || userData.email?.split('@')[0] || 'user'
    };

    setIsAuthenticated(true)
    setUser(userWithUsername)

    // Store all auth data securely
    localStorage.setItem('user', JSON.stringify(userWithUsername))
    localStorage.setItem('token', accessToken)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)

    // Clear all auth data
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }))
    localStorage.setItem('user', JSON.stringify({ ...user, ...newUserData }))
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

