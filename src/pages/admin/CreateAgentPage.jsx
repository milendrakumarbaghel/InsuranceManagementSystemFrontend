import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateAgent } from '../../hooks/useUsers.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'

const createAgentSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20)
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/,
      'Password must contain uppercase, lowercase, digit, and special character'
    ),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
})

function CreateAgentPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const createAgent = useCreateAgent()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createAgentSchema),
    defaultValues: { fullName: '', email: '', password: '', mobileNumber: '' },
  })

  function onSubmit(data) {
    createAgent.mutate(data, {
      onSuccess: () => {
        showToast('Agent created successfully.', 'success')
        navigate('/admin/users')
      },
      onError: (err) => handleApiError(err, showToast),
    })
  }

  const isBusy = isSubmitting || createAgent.isPending

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Agent</h1>
        <p className="text-gray-500 mt-1">Create a new agent account.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <FormInput label="Full Name" name="fullName" required error={errors.fullName?.message} {...register('fullName')} />
        <FormInput label="Email" name="email" type="email" required error={errors.email?.message} {...register('email')} />
        <FormInput label="Password" name="password" type="password" required error={errors.password?.message} {...register('password')} />
        <FormInput label="Mobile Number" name="mobileNumber" type="tel" required placeholder="10-digit number" error={errors.mobileNumber?.message} {...register('mobileNumber')} />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/admin/users')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isBusy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {isBusy ? 'Creating…' : 'Create Agent'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAgentPage
