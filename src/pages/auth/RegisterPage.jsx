import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { registerSchema } from '../../utils/validators.js'
import { useToast } from '../../context/ToastContext.jsx'
import * as authApi from '../../api/authApi.js'

function RegisterPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', mobileNumber: '' },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await authApi.register(data)
      showToast('Registration successful! Please verify your OTP.', 'success')
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (error) {
      showToast(
        error.response?.data?.message ?? 'Registration failed. Please try again.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

return (
  <div className="min-h-screen bg-slate-100">
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-blue-700 via-indigo-700 to-violet-800 p-12 text-white">
        <div>
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-3xl backdrop-blur">
            🛡️
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight">
            Protect What
            <br />
            Matters Most
          </h1>

          <p className="mt-6 max-w-md text-lg text-blue-100">
            Join InsureMS and manage policies, claims, payments and insurance
            coverage through a single secure platform.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            ✓ Quick Policy Management
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            ✓ Fast Claim Processing
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            ✓ Secure Digital Experience
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="mb-1">
            <h2 className="text-3xl font-bold text-slate-900">
              Create Account
            </h2>

            <p className="mt-2 text-slate-500">
              Start managing your insurance policies today.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  placeholder="Rahul Sharma"
                  {...register('fullName')}
                  className={`
                    w-full rounded-2xl border px-4 py-3
                    focus:outline-none focus:ring-4 focus:ring-blue-100
                    ${
                      errors.fullName
                        ? 'border-red-400 bg-red-50'
                        : 'border-slate-200 bg-slate-50'
                    }
                  `}
                />

                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="rahul@example.com"
                  {...register('email')}
                  className={`
                    w-full rounded-2xl border px-4 py-3
                    focus:outline-none focus:ring-4 focus:ring-blue-100
                    ${
                      errors.email
                        ? 'border-red-400 bg-red-50'
                        : 'border-slate-200 bg-slate-50'
                    }
                  `}
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter strong password"
                  {...register('password')}
                  className={`
                    w-full rounded-2xl border px-4 py-3
                    focus:outline-none focus:ring-4 focus:ring-blue-100
                    ${
                      errors.password
                        ? 'border-red-400 bg-red-50'
                        : 'border-slate-200 bg-slate-50'
                    }
                  `}
                />

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mobile Number
                </label>

                <input
                  id="mobileNumber"
                  type="tel"
                  placeholder="9876543210"
                  {...register('mobileNumber')}
                  className={`
                    w-full rounded-2xl border px-4 py-3
                    focus:outline-none focus:ring-4 focus:ring-blue-100
                    ${
                      errors.mobileNumber
                        ? 'border-red-400 bg-red-50'
                        : 'border-slate-200 bg-slate-50'
                    }
                  `}
                />

                {errors.mobileNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full rounded-2xl
                  bg-linear-to-r
                  from-blue-600
                  to-indigo-600
                  py-3.5
                  font-semibold
                  text-white
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-lg
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting
                  ? 'Creating Account...'
                  : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
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

export default RegisterPage
