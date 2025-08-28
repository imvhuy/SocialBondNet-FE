import { apiClient } from '../config/apiClient'
// API endpoints for authentication

class AuthService {
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async signIn(credentials) {
    try {
      const response = await apiClient.post('/auth/sign-in', credentials)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async sendOTP(email, otpType = 'EMAIL_VERIFICATION') {
    try {
      const response = await apiClient.post('/auth/send-otp', {
        email,
        otpType
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async signUp(userData) {
    try {
      const response = await apiClient.post('/auth/sign-up', userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await apiClient.post('/auth/refresh', { refreshToken })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async logout() {
    try {
      // Try to call server logout endpoint if token exists
      const token = localStorage.getItem('token')
      if (token) {
        await apiClient.post('/auth/logout')
      }
    } catch (error) {
      // Ignore server errors during logout - we'll clear local storage anyway
      console.warn('Logout request failed:', error.message)
    } finally {
      // Always clear local storage
      this.clearAuthData()

      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth:logout', {
        detail: { reason: 'user_initiated' }
      }))
    }
  }

  clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  isTokenExpired(error) {
    return error.response && (error.response.status === 401 || error.response.status === 403)
  }

  isAuthenticated() {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    return !!(token && refreshToken)
  }

  handleError(error) {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.error

      // Handle token expiration specifically
      if (status === 401) {
        return new Error(message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      } else if (status === 403) {
        return new Error(message || 'Bạn không có quyền truy cập. Vui lòng đăng nhập lại.')
      } else if (status >= 500) {
        return new Error('Lỗi máy chủ. Vui lòng thử lại sau.')
      } else {
        return new Error(message || 'Đã xảy ra lỗi')
      }
    } else if (error.request) {
      // Network error
      return new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.')
    } else {
      // Other error
      return new Error(error.message || 'Đã xảy ra lỗi không xác định')
    }
  }
}

export const authService = new AuthService()
