import axios from 'axios'
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  storeAuthSession,
} from '../utils/authStorage.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

let refreshPromise = null

function isPublicAuthEndpoint(url = '') {
  return url.includes('/auth/login')
    || url.includes('/auth/register')
    || url.includes('/auth/refresh-token')
}

function isBlacklistedTokenError(error) {
  const message = error.response?.data?.message ?? ''
  return message.toLowerCase().includes('blacklisted')
}

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

async function refreshAuthSession() {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken()

    refreshPromise = refreshClient
      .post('/auth/refresh-token', { refreshToken })
      .then((response) => storeAuthSession(response.data?.data ?? response.data))
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && isBlacklistedTokenError(error)) {
      clearAuthStorage()
      redirectToLogin()
      return Promise.reject(error)
    }

    if (
      error.response?.status === 401
      && originalRequest
      && !originalRequest._retry
      && !isPublicAuthEndpoint(originalRequest.url)
      && getRefreshToken()
    ) {
      originalRequest._retry = true

      try {
        const authUser = await refreshAuthSession()
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${authUser.accessToken}`

        if (originalRequest.url?.includes('/auth/logout')) {
          originalRequest.data = JSON.stringify({ refreshToken: authUser.refreshToken })
        }

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        clearAuthStorage()
        redirectToLogin()
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === 401 && !isPublicAuthEndpoint(originalRequest?.url)) {
      clearAuthStorage()
      redirectToLogin()
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
