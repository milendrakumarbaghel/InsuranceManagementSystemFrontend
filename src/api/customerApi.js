import axiosInstance from './axiosInstance.js'

export const getCustomers = (params) =>
  axiosInstance.get('/customers', { params })

export const getCustomerById = (id) =>
  axiosInstance.get(`/customers/${id}`)

export const getMyProfile = () =>
  axiosInstance.get('/customers/me')

export const createProfile = (data) =>
  axiosInstance.post('/customers', data)

export const updateMyProfile = (customerId, data) =>
  axiosInstance.put(`/customers/${customerId}`, data)

export const getCustomerByUserId = (userId) =>
  axiosInstance.get(`/customers/user/${userId}`)
