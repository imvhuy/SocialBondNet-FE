import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8762/api'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 0, // Remove timeout limit for debugging
})



// Request interceptor - attach token and user ID to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add X-User-Id header if user ID is available
    if (user.id) {
      config.headers['X-User-Id'] = user.id
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle both 401 (Unauthorized) and 403 (Forbidden) for token expiration
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          // Use the same base URL as configured
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data

          // Update both tokens if new refresh token is provided
          localStorage.setItem('token', accessToken)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        } else {
          // No refresh token available - logout immediately
          throw new Error('No refresh token available')
        }
      } catch (refreshError) {
        // Refresh failed - clear storage and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        // Dispatch a custom event to notify the app about logout
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'token_expired' }
        }))

        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)


export default apiClient
