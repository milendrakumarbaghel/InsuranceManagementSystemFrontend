import { Link, useNavigate } from 'react-router-dom'
import { useAssignedClaims } from '../../hooks/useClaims.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'

import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function AgentClaimQueuePage() {
  const navigate = useNavigate()
  const { params, page, pageSize, setPage, setPageSize } = usePagination({
    defaultSort: 'assignedAt',
    defaultSortDir: 'desc',
  })
  const { data, isLoading } = useAssignedClaims(params)

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  const columns = [
    {
      key: 'claimNumber',
      header: 'Claim',
      render: (row) => (
        <div className="space-y-1 max-w-[320px]">
          <div className="font-medium text-gray-900">{row.claimNumber}</div>
          <div className="text-xs text-gray-500" title={row.assignmentMessage ?? ''}>
            {row.assignmentMessage ?? 'Assigned claim awaiting your review.'}
          </div>
        </div>
      ),
    },
    { key: 'customerName', header: 'Customer', render: (row) => row.customerName ?? '—' },
    { key: 'claimAmount', header: 'Amount', render: (row) => formatCurrency(row.claimAmount) },
    { key: 'claimStatus', header: 'Status', render: (row) => <StatusBadge status={row.claimStatus} /> },
    { key: 'assignedAt', header: 'Assigned At', render: (row) => formatDate(row.assignedAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Link
          to={`/agent/claims/${row.claimId}/review`}
          onClick={(e) => e.stopPropagation()}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${row.claimStatus === 'ASSIGNED' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
        >
          {row.claimStatus === 'ASSIGNED' ? 'Review Claim' : 'View Review'}
        </Link>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-7xl p-6">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assigned Claims</h1>
        <p className="mt-1 text-sm text-gray-500">Claims assigned to you, with context and full details available in the review page.</p>
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No assigned claims found."
        onRowClick={(row) => navigate(`/agent/claims/${row.claimId}/review`)}
        getRowClassName={(row) => (row.claimStatus === 'ASSIGNED' ? 'bg-blue-50/60' : 'bg-emerald-50/40')}
        exportTitle="Agent Assigned Claims Report"
        paginationProps={{
          currentPage: page,
          totalPages,
          pageSize,
          totalRecords: totalElements,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  )
}

export default AgentClaimQueuePage