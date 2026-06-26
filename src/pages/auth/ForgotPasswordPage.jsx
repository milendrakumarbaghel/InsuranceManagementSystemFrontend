import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { forgotPasswordSchema } from '../../utils/validators.js'
import { useToast } from '../../context/ToastContext.jsx'
import * as authApi from '../../api/authApi.js'

function ForgotPasswordPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await authApi.forgotPassword(data)
      showToast('If the email exists, a password reset OTP has been sent.', 'success')
      navigate('/reset-password', { state: { email: data.email } })
    } catch (error) {
      showToast(
        error.response?.data?.message ?? 'Something went wrong. Please try again.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-blue-700 via-indigo-700 to-violet-800 p-12 text-white">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              🔑
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-tight">
              Forgot Your
              <br />
              Password?
            </h1>

            <p className="mt-6 max-w-md text-lg text-blue-100">
              No worries! Enter your registered email address and we&apos;ll send
              you a one-time password to reset it.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              ✓ Secure OTP Verification
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              ✓ Reset in Minutes
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              ✓ Strong Password Enforcement
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900">
                Reset Password
              </h2>

              <p className="mt-2 text-slate-500">
                Enter your email to receive a password reset OTP
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
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

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
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
                  {isSubmitting ? 'Sending OTP...' : 'Send Reset OTP'}
                </button>
              </form>

              <div className="mt-6 border-t pt-6 text-center text-sm text-slate-500">
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

export default ForgotPasswordPage
