import axiosInstance from './axiosInstance.js'

function buildPagedParams(params = {}, defaultSortBy) {
  const {
    page = 0,
    pageSize,
    size,
    sort,
    sortBy,
    sortDir,
    ...rest
  } = params

  return {
    page,
    size: size ?? pageSize,
    sortBy: sortBy ?? sort ?? defaultSortBy,
    sortDir,
    ...rest,
  }
}

export const getClaims = (params) =>
  axiosInstance.get('/claims', { params: buildPagedParams(params, 'id') })

export const getAssignedClaims = (params) =>
  axiosInstance.get('/claims/assigned', { params: buildPagedParams(params, 'assignedAt') })

export const getMyClaims = (params) =>
  axiosInstance.get('/claims/my', { params })

export const getClaimById = (id) =>
  axiosInstance.get(`/claims/${id}`)

export const getClaimByNumber = (claimNumber) =>
  axiosInstance.get(`/claims/number/${claimNumber}`)

export const raiseClaim = (data) =>
  axiosInstance.post('/claims', data)

export const uploadClaimDocument = (claimId, file) => {
  const formData = new FormData()
  formData.append('file', file)

  return axiosInstance.post(`/claim-documents/upload/${claimId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteClaimDocument = (documentId) =>
  axiosInstance.delete(`/claim-documents/${documentId}`)

export const reviewClaim = (id, data) =>
  axiosInstance.put(`/claims/${id}/review`, data)

export const assignClaim = (id, data) =>
  axiosInstance.put(`/claims/${id}/assign`, data)

export const approveClaim = (id, data) =>
  axiosInstance.put(`/claims/${id}/approve`, data)

export const rejectClaim = (id, data) =>
  axiosInstance.put(`/claims/${id}/reject`, data)
