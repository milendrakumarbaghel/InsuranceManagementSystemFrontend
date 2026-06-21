import axiosInstance from './axiosInstance.js'

export const getClaimHistory = (claimId) =>
  axiosInstance.get(`/claim-history/${claimId}`)
