import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { issuePolicySchema } from '../../utils/validators.js'
import { usePlans } from '../../hooks/usePlans.js'
import { useIssuePolicy } from '../../hooks/usePolicies.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormSelect from '../../components/common/FormSelect.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function IssuePolicyPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: plansData } = usePlans({ page: 0, size: 100 })
  const issuePolicy = useIssuePolicy()

  const plans = plansData?.data?.content ?? plansData?.content ?? []
  const planOptions = [
    { value: '', label: '— Select plan —' },
    ...plans.map((p) => ({ value: String(p.PolicyPlanId ?? p.policyPlanId), label: `${p.planName} — ${p.productName ?? ''}` })),
  ]

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(issuePolicySchema),
    defaultValues: { customerId: 0, planId: 0, startDate: '' },
  })

  function onSubmit(data) {
    issuePolicy.mutate({ customerId: Number(data.customerId), planId: Number(data.planId), startDate: data.startDate }, {
      onSuccess: () => { showToast('Policy issued successfully!', 'success'); navigate('/agent/policies') },
      onError: (err) => handleApiError(err, showToast),
    })
  }

  const isBusy = isSubmitting || issuePolicy.isPending

  return (
    <div className="p-6 max-w-lg mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Issue Policy</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <FormInput label="Customer ID" name="customerId" type="number" required placeholder="Enter customer ID" error={errors.customerId?.message} {...register('customerId', { valueAsNumber: true })} />
        <FormSelect label="Plan" name="planId" required options={planOptions} error={errors.planId?.message} {...register('planId', { valueAsNumber: true })} />
        <FormInput label="Start Date" name="startDate" type="date" required error={errors.startDate?.message} {...register('startDate')} />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isBusy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {isBusy ? 'Issuing…' : 'Issue Policy'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default IssuePolicyPage
