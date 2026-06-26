import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import { resetPasswordSchema } from '../../utils/validators.js'
import { useToast } from '../../context/ToastContext.jsx'
import * as authApi from '../../api/authApi.js'

function ResetPasswordPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email ?? ''
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await authApi.resetPassword(data)
      showToast('Password reset successfully! Please sign in with your new password.', 'success')
      navigate('/login')
    } catch (error) {
      showToast(
        error.response?.data?.message ?? 'Password reset failed. Please try again.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      showToast('Email is missing. Please go back and enter your email.', 'error')
      return
    }
    setIsResending(true)
    try {
      await authApi.forgotPassword({ email })
      showToast('A new reset OTP has been sent to your email.', 'success')
    } catch (error) {
      showToast(
        error.response?.data?.message ?? 'Failed to resend OTP.',
        'error'
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-blue-700 via-indigo-700 to-violet-800 p-12 text-white">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              🔒
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-tight">
              Set Your
              <br />
              New Password
            </h1>

            <p className="mt-6 max-w-md text-lg text-blue-100">
              Enter the OTP sent to your email along with your new password to
              regain access to your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              ✓ OTP Verified Reset
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              ✓ Strong Password Required
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              ✓ Instant Access After Reset
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900">
                New Password
              </h2>

              <p className="mt-2 text-slate-500">
                Enter the OTP and set your new password
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email (read-only) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    {...register('email')}
                    type="email"
                    readOnly
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-100
                      px-4
                      py-3
                      text-slate-500
                      cursor-not-allowed
                    "
                  />

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* OTP */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    OTP
                  </label>

                  <input
                    {...register('otp')}
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      transition
                      focus:border-blue-500
                      focus:bg-white
                      focus:outline-none
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                  {errors.otp && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.otp.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    New Password
                  </label>

                  <input
                    {...register('newPassword')}
                    type="password"
                    placeholder="Enter new password"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      transition
                      focus:border-blue-500
                      focus:bg-white
                      focus:outline-none
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>

                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Re-enter new password"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      transition
                      focus:border-blue-500
                      focus:bg-white
                      focus:outline-none
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full
                    rounded-2xl
                    bg-linear-to-r
                    from-blue-600
                    to-indigo-600
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-lg
                    disabled:opacity-60
                  "
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  {isResending ? 'Resending...' : 'Resend OTP'}
                </button>
              </div>

              <div className="mt-4 border-t pt-4 text-center text-sm text-slate-500">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default ResetPasswordPage
