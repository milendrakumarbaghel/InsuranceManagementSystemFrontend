import axiosInstance from './axiosInstance.js'

function toPaymentQueryParams(params = {}) {
  const { pageSize, sort, ...rest } = params

  return {
    ...rest,
    ...(pageSize !== undefined ? { size: pageSize } : {}),
    ...(sort !== undefined ? { sortBy: sort } : {}),
  }
}

export const getPayments = (params) =>
  axiosInstance.get('/payments', { params: toPaymentQueryParams(params) })

export const getPaymentById = (id) =>
  axiosInstance.get(`/payments/${id}`)

export const getPaymentsByPolicy = (policyId) =>
  axiosInstance.get(`/payments/policy/${policyId}`)

export const recordPayment = (data) =>
  axiosInstance.post('/payments', data)
