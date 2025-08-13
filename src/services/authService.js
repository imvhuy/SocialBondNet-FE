import { apiClient } from '../config/apiClient'
// API endpoints for authentication


class AuthService {
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

  async register(userData) {
    try {
      const response = await apiClient.post(`/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

  async refreshToken() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get user data')
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }
}

export const authService = new AuthService()
