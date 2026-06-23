import axiosInstance from './axiosInstance.js'
import { getRefreshToken } from '../utils/authStorage.js'

export const login = (payload) => axiosInstance.post('/auth/login', payload)

export const register = (payload) => axiosInstance.post('/auth/register', payload)

export const refreshToken = (refreshToken) =>
  axiosInstance.post('/auth/refresh-token', { refreshToken })

export const logout = () =>
  axiosInstance.post('/auth/logout', { refreshToken: getRefreshToken() })
