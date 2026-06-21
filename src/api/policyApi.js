import axiosInstance from './axiosInstance.js'

export const getPolicies = (params) =>
  axiosInstance.get('/policies', { params })

export const getMyPolicies = () =>
  axiosInstance.get('/policies/my')

export const getPolicyById = (id) =>
  axiosInstance.get(`/policies/${id}`)

export const getPolicyByNumber = (policyNumber) =>
  axiosInstance.get(`/policies/number/${policyNumber}`)

export const purchasePolicy = (planId) =>
  axiosInstance.post(`/policies/purchase/${planId}`)

export const issuePolicy = (data) =>
  axiosInstance.post('/policies/issue', data)

export const cancelPolicy = (policyId) =>
  axiosInstance.patch(`/policies/${policyId}/cancel`)
