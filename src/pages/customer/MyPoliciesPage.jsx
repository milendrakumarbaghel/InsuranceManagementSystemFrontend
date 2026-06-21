import { Link } from 'react-router-dom'
import { useMyPolicies } from '../../hooks/usePolicies.js'
import { formatDate } from '../../utils/formatters.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'

function MyPoliciesPage() {
  const { data, isLoading } = useMyPolicies()
  const policies = data?.data ?? data ?? []

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Policies</h1>
      {policies.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No policies yet.</p>
          <Link to="/customer/products" className="mt-3 inline-block text-blue-600 hover:underline text-sm">Browse products</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Policy Number', 'Plan', 'Status', 'Start Date', 'End Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {policies.map((p) => (
                <tr key={p.policyId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.policyNumber}</td>
                  <td className="px-4 py-3">{p.planName ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">{formatDate(p.startDate)}</td>
                  <td className="px-4 py-3">{formatDate(p.endDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/customer/policies/${p.policyId}`} className="text-blue-600 hover:underline">View</Link>
                      {(p.status === 'PENDING_PAYMENT' || p.status === 'ACTIVE') && (
                        <Link to={`/customer/policies/${p.policyId}/pay`} className="text-green-600 hover:underline">Pay</Link>
                      )}
                      {p.status === 'ACTIVE' && (
                        <Link to={`/customer/claims/raise/${p.policyId}`} className="text-orange-600 hover:underline">Claim</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyPoliciesPage
