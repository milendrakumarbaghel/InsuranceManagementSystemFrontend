import { useParams, Link } from 'react-router-dom'
import { useClaim } from '../../hooks/useClaims.js'
import { useClaimHistory } from '../../hooks/useClaimHistory.js'
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function ClaimDetailPage() {
  const { id } = useParams()
  const { data: claimData, isLoading } = useClaim(id)
  const { data: historyData } = useClaimHistory(id)

  const claim = claimData?.data ?? claimData
  const history = historyData?.data ?? historyData ?? []

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!claim) return <div className="p-6 text-center text-gray-500">Claim not found.</div>

  return (
    
    <div className="p-6 max-w-3xl mx-auto space-y-6">
       <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{claim.claimNumber}</h1>
          <p className="text-gray-500 mt-1">Policy: {claim.policyNumber}</p>
        </div>
        <StatusBadge status={claim.claimStatus} size="md" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold border-b pb-3">Claim Details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          {[
            ['Claim Amount', formatCurrency(claim.claimAmount)],
            ['Customer', claim.customerName],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase">{label}</dt>
              <dd className="mt-1 text-gray-900">{value ?? '—'}</dd>
            </div>
          ))}
        </dl>
        {claim.agentRemarks && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Agent Remarks</p>
            <p className="text-sm bg-indigo-50 rounded p-3">{claim.agentRemarks}</p>
          </div>
        )}
        {claim.adminRemarks && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Admin Remarks</p>
            <p className="text-sm bg-teal-50 rounded p-3">{claim.adminRemarks}</p>
          </div>
        )}
      </div>

      {claim.documents?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold border-b pb-3 mb-4">Documents</h2>
          <ul className="space-y-2">
            {claim.documents.map((doc, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">{doc.documentType}</span>
                <a href={doc.documentReference} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">{doc.documentName}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold border-b pb-3 mb-4">Status History</h2>
          <ol className="space-y-3">
            {history.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mt-0.5" />
                  {i < history.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                </div>
                <div>
                  <StatusBadge status={h.status ?? h.toStatus} size="sm" />
                  <p className="text-gray-500 text-xs mt-1">{formatDate(h.changedAt ?? h.timestamp)}</p>
                  {h.remarks && <p className="text-gray-700 mt-0.5">{h.remarks}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default ClaimDetailPage
