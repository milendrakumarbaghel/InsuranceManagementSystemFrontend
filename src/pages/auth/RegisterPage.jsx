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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-1 text-sm text-gray-500">Join InsureMS to manage your policies</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {[
            { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Rahul Sharma' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'e.g. rahul@example.com' },
            { id: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 chars, uppercase, digit, special char' },
            { id: 'mobileNumber', label: 'Mobile Number', type: 'tel', placeholder: '10-digit number starting with 6-9' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register(id)}
                aria-invalid={!!errors[id]}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[id] ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors[id] && (
                <p role="alert" className="mt-1 text-xs text-red-600">{errors[id].message}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Registering…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
