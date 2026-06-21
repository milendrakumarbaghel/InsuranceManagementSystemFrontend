import axiosInstance from './axiosInstance.js'

export const verifyOtp = (data) =>
  axiosInstance.post('/otp/verify', data)

export const resendOtp = (data) =>
  axiosInstance.post('/otp/resend', data)
