import { Link, useParams } from 'react-router-dom'
import { usePolicy } from '../../hooks/usePolicies.js'
import { usePaymentsByPolicy } from '../../hooks/usePayments.js'
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'

function PolicyDetailPage() {
  const { id } = useParams()
  const { data: policyData, isLoading } = usePolicy(id)
  const { data: paymentsData } = usePaymentsByPolicy(id)

  const policy = policyData?.data ?? policyData
  const payments = paymentsData?.data ?? paymentsData ?? []

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!policy) return <div className="p-6 text-center text-gray-500">Policy not found.</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{policy.policyNumber}</h1>
          <p className="text-gray-500 mt-1">{policy.planName}</p>
        </div>
        <StatusBadge status={policy.status} size="md" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold border-b pb-3 mb-4">Policy Details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          {[
            ['Customer', policy.customerName],
            ['Plan', policy.planName],
            ['Start Date', formatDate(policy.startDate)],
            ['End Date', formatDate(policy.endDate)],
            ['Total Premium Paid', formatCurrency(policy.totalPremiumPaid ?? 0)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase">{label}</dt>
              <dd className="mt-1 text-gray-900">{value ?? '—'}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex gap-3">
          {(policy.status === 'PENDING_PAYMENT' || policy.status === 'ACTIVE') && (
            <Link to={`/customer/policies/${id}/pay`} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">Make Payment</Link>
          )}
          {policy.status === 'ACTIVE' && (
            <Link to={`/customer/claims/raise/${id}`} className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">Raise Claim</Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold border-b pb-3 mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-400">No payments recorded yet.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                <th className="pb-2">Date</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Mode</th>
                <th className="pb-2">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.paymentId}>
                  <td className="py-2">{formatDate(p.paymentDate)}</td>
                  <td className="py-2">{formatCurrency(p.amount)}</td>
                  <td className="py-2">{p.paymentMode}</td>
                  <td className="py-2 text-gray-500">{p.transactionReference ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default PolicyDetailPage
