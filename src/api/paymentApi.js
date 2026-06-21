import axiosInstance from './axiosInstance.js'

export const getPayments = (params) =>
  axiosInstance.get('/payments', { params })

export const getPaymentById = (id) =>
  axiosInstance.get(`/payments/${id}`)

export const getPaymentsByPolicy = (policyId) =>
  axiosInstance.get(`/payments/policy/${policyId}`)

export const recordPayment = (data) =>
  axiosInstance.post('/payments', data)
