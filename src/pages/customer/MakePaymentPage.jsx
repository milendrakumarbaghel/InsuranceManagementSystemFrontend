import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema } from '../../utils/validators.js'
import { usePolicy } from '../../hooks/usePolicies.js'
import { useRecordPayment } from '../../hooks/usePayments.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormSelect from '../../components/common/FormSelect.jsx'
import Spinner from '../../components/common/Spinner.jsx'

const PAYMENT_MODE_OPTIONS = [
  { value: '', label: '— Select mode —' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'CASH', label: 'Cash' },
]

function MakePaymentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: policyData, isLoading } = usePolicy(id)
  const recordPayment = useRecordPayment()

  const policy = policyData?.data ?? policyData

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(paymentSchema),
    values: policy ? {
      policyPlanId: policy.policyPlanId ?? 0,
      policyNumber: policy.policyNumber ?? '',
      amount: policy.premiumAmount ?? 0,
      paymentMode: '',
    } : undefined,
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!policy) return <div className="p-6 text-center text-gray-500">Policy not found.</div>

  function onSubmit(data) {
    recordPayment.mutate({
      ...data,
      policyPlanId: Number(data.policyPlanId),
      amount: Number(data.amount),
    }, {
      onSuccess: () => {
        showToast('Payment recorded successfully!', 'success')
        navigate(`/customer/policies/${id}`)
      },
      onError: (err) => handleApiError(err, showToast),
    })
  }

  const isBusy = isSubmitting || recordPayment.isPending

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Make Payment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <FormInput label="Policy Number" name="policyNumber" readOnly error={errors.policyNumber?.message} {...register('policyNumber')} />
        <FormInput label="Amount (₹)" name="amount" type="number" step="0.01" required error={errors.amount?.message} {...register('amount', { valueAsNumber: true })} />
        <FormSelect label="Payment Mode" name="paymentMode" required options={PAYMENT_MODE_OPTIONS} error={errors.paymentMode?.message} {...register('paymentMode')} />
        <input type="hidden" {...register('policyPlanId', { valueAsNumber: true })} />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isBusy} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
            {isBusy ? 'Processing…' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MakePaymentPage
