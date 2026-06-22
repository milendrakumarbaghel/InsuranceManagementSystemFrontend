import axiosInstance from './axiosInstance.js'

export const getPlans = (params) =>
  axiosInstance.get('/plans', { params })

export const getPlansByProductId = (productId) =>
  axiosInstance.get(`/plans/product/${productId}`)

export const getPlanById = (id) =>
  axiosInstance.get(`/plans/${id}`)

export const createPlan = (data) =>
  axiosInstance.post('/plans', data)

export const updatePlan = (id, data) =>
  axiosInstance.put(`/plans/${id}`, data)

export const deactivatePlan = (id) =>
  axiosInstance.patch(`/plans/${id}/deactivate`)

export const activatePlan = (id) =>
  axiosInstance.patch(`/plans/${id}/activate`)
