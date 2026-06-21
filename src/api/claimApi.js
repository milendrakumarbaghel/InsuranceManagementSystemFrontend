import axiosInstance from './axiosInstance.js'

export const getClaims = (params) =>
  axiosInstance.get('/claims', { params })

export const getMyClaims = (params) =>
  axiosInstance.get('/claims/my', { params })

export const getClaimById = (id) =>
  axiosInstance.get(`/claims/${id}`)

export const getClaimByNumber = (claimNumber) =>
  axiosInstance.get(`/claims/number/${claimNumber}`)

export const raiseClaim = (data) =>
  axiosInstance.post('/claims', data)

export const reviewClaim = (id, data) =>
  axiosInstance.put(`/claims/${id}/review`, data)

export const approveClaim = (id, remarks) =>
  axiosInstance.put(`/claims/${id}/approve`, null, { params: { remarks } })

export const rejectClaim = (id, remarks) =>
  axiosInstance.put(`/claims/${id}/reject`, null, { params: { remarks } })
