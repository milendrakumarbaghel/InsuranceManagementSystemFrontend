import axiosInstance from './axiosInstance.js'

export const getUsers = (params) =>
  axiosInstance.get('/users', { params })

export const getAdminUsers = (params) =>
  axiosInstance.get('/admin/users', { params })

export const getUserById = (id) =>
  axiosInstance.get(`/users/${id}`)

export const activateUser = (id) =>
  axiosInstance.patch(`/users/${id}/activate`)

export const deactivateUser = (id) =>
  axiosInstance.patch(`/users/${id}/deactivate`)

export const toggleUser = (id, active) =>
  active ? activateUser(id) : deactivateUser(id)

export const createAgent = (data) =>
  axiosInstance.post('/auth/agents', data)
