import axiosInstance from './axiosInstance.js'

export const getProducts = (params) =>
  axiosInstance.get('/products', { params })

export const getActiveProducts = (params) =>
  axiosInstance.get('/products/active', { params })

export const getProductById = (id) =>
  axiosInstance.get(`/products/${id}`)

export const createProduct = (data) =>
  axiosInstance.post('/products', data)

export const updateProduct = (id, data) =>
  axiosInstance.put(`/products/${id}`, data)

export const activateProduct = (id) =>
  axiosInstance.patch(`/products/${id}/activate`)

export const deactivateProduct = (id) =>
  axiosInstance.patch(`/products/${id}/deactivate`)

export const toggleProduct = (id, active) =>
  active ? activateProduct(id) : deactivateProduct(id)
