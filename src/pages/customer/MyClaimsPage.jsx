import { Link } from 'react-router-dom'
import { useMyClaims } from '../../hooks/useClaims.js'
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function MyClaimsPage() {
  const { data, isLoading } = useMyClaims()
  const claims = data?.data ?? data ?? []

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BackButton />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
        <Link to="/customer/policies" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">+ Raise Claim</Link>
      </div>
      {claims.length === 0 ? (
        <p className="text-center py-12 text-gray-400">No claims submitted yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Claim Number', 'Policy', 'Amount', 'Incident Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {claims.map((c) => (
                <tr key={c.claimId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.claimNumber}</td>
                  <td className="px-4 py-3">{c.policyNumber ?? '—'}</td>
                  <td className="px-4 py-3">{formatCurrency(c.claimAmount)}</td>
                  <td className="px-4 py-3">{formatDate(c.incidentDate)}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.claimStatus} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/customer/claims/${c.claimId}`} className="text-blue-600 hover:underline">View</Link>
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

export default MyClaimsPage
