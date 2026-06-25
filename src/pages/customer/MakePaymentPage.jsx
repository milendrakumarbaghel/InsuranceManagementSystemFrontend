import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema } from '../../utils/validators.js'
import { usePolicy } from '../../hooks/usePolicies.js'
import { usePlans } from '../../hooks/usePlans.js'
import { usePaymentsByPolicy, useRecordPayment } from '../../hooks/usePayments.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormSelect from '../../components/common/FormSelect.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'

const PAYMENT_MODE_OPTIONS = [
  { value: '', label: '— Select mode —' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'CASH', label: 'Cash' },
]

const PLAN_LOOKUP_PARAMS = {
  page: 0,
  size: 1000,
  sortBy: 'id',
  sortDir: 'asc',
}

function normalizeName(value) {
  return String(value ?? '').trim().toLowerCase()
}

function getPlanId(plan) {
  return plan?.PolicyPlanId ?? plan?.policyPlanId ?? plan?.id ?? 0
}

function getPlansContent(data) {
  return data?.data?.content ?? data?.content ?? data?.data ?? data ?? []
}

function findPolicyPlan(policy, plans) {
  const planName = normalizeName(policy?.planName)

  if (!planName) return null

  return plans.find((plan) => normalizeName(plan.planName) === planName) ?? null
}

function getPayableAmount(policy, plan) {
  return (
    plan?.premiumAmount ??
    policy.premiumAmount ??
    policy.planPremiumAmount ??
    policy.premium ??
    policy.policyPlan?.premiumAmount ??
    0
  )
}

function getPolicyPlanId(policy, plan) {
  return policy.policyPlanId ?? policy.PolicyPlanId ?? policy.planId ?? policy.plan?.id ?? getPlanId(plan)
}

function getPremiumType(policy, plan) {
  return policy?.premiumType ?? policy?.policyPlan?.premiumType ?? policy?.plan?.premiumType ?? plan?.premiumType
}

function getPaymentsContent(data) {
  return data?.data ?? data ?? []
}

function getPaymentDate(payment) {
  return payment.paymentDate
}

function isSuccessfulPayment(payment) {
  return !payment.status || payment.status === 'SUCCESS'
}

function hasPaymentInCurrentPeriod(payments, premiumType) {
  const now = new Date()

  return payments.some((payment) => {
    if (!isSuccessfulPayment(payment)) return false

    const paymentDate = getPaymentDate(payment)
    if (!paymentDate) return false

    const parsed = new Date(paymentDate)
    if (Number.isNaN(parsed.getTime())) return false

    switch (premiumType) {
      case 'MONTHLY':
        return parsed.getFullYear() === now.getFullYear() && parsed.getMonth() === now.getMonth()
      case 'QUARTERLY': {
        const currentQ = Math.floor(now.getMonth() / 3)
        const paymentQ = Math.floor(parsed.getMonth() / 3)
        return parsed.getFullYear() === now.getFullYear() && paymentQ === currentQ
      }
      case 'HALF_YEARLY': {
        const currentH = now.getMonth() < 6 ? 0 : 1
        const paymentH = parsed.getMonth() < 6 ? 0 : 1
        return parsed.getFullYear() === now.getFullYear() && paymentH === currentH
      }
      case 'ANNUAL':
        return parsed.getFullYear() === now.getFullYear()
      default:
        return false
    }
  })
}

const PERIOD_LABELS = {
  MONTHLY: 'month',
  QUARTERLY: 'quarter',
  HALF_YEARLY: 'half-year',
  ANNUAL: 'year',
}

function MakePaymentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: policyData, isLoading } = usePolicy(id)
  const { data: plansData, isLoading: plansLoading } = usePlans(PLAN_LOOKUP_PARAMS)
  const { data: paymentsData, isLoading: paymentsLoading } = usePaymentsByPolicy(id)
  const recordPayment = useRecordPayment()

  const policy = policyData?.data ?? policyData
  const plans = getPlansContent(plansData)
  const payments = getPaymentsContent(paymentsData)
  const policyPlan = findPolicyPlan(policy, plans)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(paymentSchema),
    values: policy ? {
      policyPlanId: getPolicyPlanId(policy, policyPlan),
      policyNumber: policy.policyNumber ?? '',
      amount: getPayableAmount(policy, policyPlan),
      paymentMode: '',
    } : undefined,
  })

  if (isLoading || plansLoading || paymentsLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!policy) return <div className="p-6 text-center text-gray-500">Policy not found.</div>

  const hasPaymentDetails = getPolicyPlanId(policy, policyPlan) > 0 && getPayableAmount(policy, policyPlan) > 0
  const premiumType = getPremiumType(policy, policyPlan)
  const isPeriodPaymentBlocked = premiumType && hasPaymentInCurrentPeriod(payments, premiumType)
  const periodLabel = PERIOD_LABELS[premiumType] ?? 'period'
  const blockMessage = `You have already paid this ${premiumType?.toLowerCase()?.replace('_', '-')} premium for the current ${periodLabel}. Your next installment is scheduled for next ${periodLabel}.`

  function onSubmit(data) {
    if (isPeriodPaymentBlocked) {
      showToast(blockMessage, 'warning')
      return
    }

    recordPayment.mutate({
      policyPlanId: Number(data.policyPlanId),
      policyNumber: data.policyNumber,
      amount: Number(data.amount),
      paymentMode: data.paymentMode,
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
      <BackButton />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Make Payment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {!hasPaymentDetails && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Payment details are missing for this policy. Please try again after refreshing the page.
          </div>
        )}
        {isPeriodPaymentBlocked && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {blockMessage}
          </div>
        )}
        <FormInput label="Policy Number" name="policyNumber" readOnly error={errors.policyNumber?.message} {...register('policyNumber')} />
        <FormInput label="Amount (₹)" name="amount" type="number" step="0.01" readOnly required error={errors.amount?.message} {...register('amount', { valueAsNumber: true })} />
        <FormSelect label="Payment Mode" name="paymentMode" required disabled={isPeriodPaymentBlocked} options={PAYMENT_MODE_OPTIONS} error={errors.paymentMode?.message} {...register('paymentMode')} />
        <input type="hidden" {...register('policyPlanId', { valueAsNumber: true })} />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isBusy || !hasPaymentDetails || isPeriodPaymentBlocked} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
            {isBusy ? 'Processing…' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MakePaymentPage
