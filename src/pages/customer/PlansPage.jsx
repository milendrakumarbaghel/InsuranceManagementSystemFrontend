import { Link, useParams } from 'react-router-dom'
import { usePlansByProduct } from '../../hooks/usePlans.js'
import { formatCurrency } from '../../utils/formatters.js'
import Spinner from '../../components/common/Spinner.jsx'

function PlansPage() {
  const { id: productId } = useParams()
  const { data, isLoading } = usePlansByProduct(productId)
  const plans = data?.data ?? data ?? []

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Plans</h1>
        <p className="text-gray-500 mt-1">Choose a plan to purchase.</p>
      </div>
      {plans.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No plans available for this product.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div key={plan.PolicyPlanId ?? plan.policyPlanId} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
              <h2 className="text-base font-semibold text-gray-900 mb-3">{plan.planName}</h2>
              <dl className="grid grid-cols-2 gap-2 text-sm flex-1">
                <div><dt className="text-gray-500">Coverage</dt><dd className="font-medium">{formatCurrency(plan.coverageAmount)}</dd></div>
                <div><dt className="text-gray-500">Premium</dt><dd className="font-medium">{formatCurrency(plan.premiumAmount)}</dd></div>
                <div><dt className="text-gray-500">Type</dt><dd>{plan.premiumType}</dd></div>
                <div><dt className="text-gray-500">Duration</dt><dd>{plan.duration} months</dd></div>
              </dl>
              <Link to={`/customer/policies/purchase/${plan.PolicyPlanId ?? plan.policyPlanId}`}
                className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white text-center hover:bg-green-700">
                Purchase
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PlansPage
