import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../../context/ToastContext.jsx'
import * as otpApi from '../../api/otpApi.js'

function OtpVerificationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const email = location.state?.email ?? ''

  const [emailOtp, setEmailOtp] = useState('')
  const [phoneOtp, setPhoneOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await otpApi.verifyOtp({ email, emailOtp, phoneOtp })
      showToast('Account verified! Please sign in.', 'success')
      navigate('/login')
    } catch (error) {
      showToast(error.response?.data?.message ?? 'OTP verification failed.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await otpApi.resendOtp({ email })
      showToast('OTP resent to your email and phone.', 'success')
    } catch (error) {
      showToast(error.response?.data?.message ?? 'Failed to resend OTP.', 'error')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the OTP sent to <strong>{email}</strong>
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label htmlFor="emailOtp" className="block text-sm font-medium text-gray-700">
              Email OTP
            </label>
            <input
              id="emailOtp"
              type="text"
              maxLength={6}
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneOtp" className="block text-sm font-medium text-gray-700">
              Phone OTP
            </label>
            <input
              id="phoneOtp"
              type="text"
              maxLength={6}
              value={phoneOtp}
              onChange={(e) => setPhoneOtp(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Verifying…' : 'Verify OTP'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            {isResending ? 'Resending…' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OtpVerificationPage
