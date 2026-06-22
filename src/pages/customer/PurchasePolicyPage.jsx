import { useParams, useNavigate } from 'react-router-dom'
import { usePlan } from '../../hooks/usePlans.js'
import { usePurchasePolicy } from '../../hooks/usePolicies.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import { formatCurrency } from '../../utils/formatters.js'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function PurchasePolicyPage() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data, isLoading } = usePlan(planId)
  const purchasePolicy = usePurchasePolicy()

  const plan = data?.data ?? data

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!plan) return <div className="p-6 text-center text-gray-500">Plan not found.</div>

  function handlePurchase() {
    purchasePolicy.mutate(planId, {
      onSuccess: () => {
        showToast('Policy purchased successfully!', 'success')
        navigate('/customer/policies')
      },
      onError: (err) => handleApiError(err, showToast),
    })
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirm Purchase</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{plan.planName}</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-gray-500">Coverage</dt><dd className="font-medium">{formatCurrency(plan.coverageAmount)}</dd></div>
          <div><dt className="text-gray-500">Premium</dt><dd className="font-medium">{formatCurrency(plan.premiumAmount)}</dd></div>
          <div><dt className="text-gray-500">Premium Type</dt><dd>{plan.premiumType}</dd></div>
          <div><dt className="text-gray-500">Duration</dt><dd>{plan.duration} months</dd></div>
        </dl>
      </div>
      <button
        onClick={handlePurchase}
        disabled={purchasePolicy.isPending}
        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        {purchasePolicy.isPending ? 'Processing…' : 'Confirm Purchase'}
      </button>
      <button onClick={() => navigate(-1)} className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
        Cancel
      </button>
    </div>
  )
}

export default PurchasePolicyPage
