import axiosInstance from './axiosInstance.js'

export const login = (payload) => axiosInstance.post('/auth/login', payload)

export const register = (payload) => axiosInstance.post('/auth/register', payload)

export const logout = () => Promise.resolve()