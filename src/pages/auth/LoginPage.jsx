import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import { loginSchema } from '../../utils/validators.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import * as authApi from '../../api/authApi.js'
import * as otpApi from '../../api/otpApi.js'

const ROLE_DASHBOARDS = {
  CUSTOMER: '/customer/dashboard',
  AGENT: '/agent/dashboard',
  ADMIN: '/admin/dashboard',
}

const ROLE_PATH_PREFIXES = {
  CUSTOMER: '/customer/',
  AGENT: '/agent/',
  ADMIN: '/admin/',
}

function normalizeRole(role) {
  return (role ?? '').replace(/^ROLE_/, '')
}

function getPostLoginPath(role, from) {
  const dashboard = ROLE_DASHBOARDS[role] ?? '/login'
  const allowedPrefix = ROLE_PATH_PREFIXES[role]

  if (from && allowedPrefix && from.startsWith(allowedPrefix)) {
    return from
  }

  return dashboard
}

function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await authApi.login(data)
      const authUser = response.data?.data ?? response.data
      login(authUser)
      const from = location.state?.from?.pathname
      const role = normalizeRole(authUser.role)
      navigate(getPostLoginPath(role, from), { replace: true })
    } catch (error) {
      const errorData = error.response?.data
      const emailVerified = errorData?.emailVerified
      const mobileVerified = errorData?.mobileVerified

      // Inactive user whose email/phone is not yet verified → redirect to OTP verification
      if (
        emailVerified === false ||
        mobileVerified === false
      ) {
        try {
          await otpApi.resendOtp({ email: data.email })
        } catch {
          // Swallow resend errors – user can resend manually from verification page
        }
        showToast(
          'Your email or phone is not verified. Please verify to activate your account.',
          'info'
        )
        navigate('/verify-otp', { state: { email: data.email, fromLogin: true } })
      } else {
        showToast(
          errorData?.message ?? 'Login failed. Please check your credentials.',
          'error'
        )
      }
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
            🛡️
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight">
            Insurance
            <br />
            Management
            <br />
            Platform
          </h1>

          <p className="mt-6 max-w-md text-lg text-blue-100">
            Manage policies, claims, payments and customer protection from a
            single secure platform.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            ✓ Policy Management
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            ✓ Claim Processing
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            ✓ Secure Payment Tracking
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue to your dashboard
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

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  {...register('password')}
                  type="password"
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

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
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
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 border-t pt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create Account
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
)
}

export default LoginPage
