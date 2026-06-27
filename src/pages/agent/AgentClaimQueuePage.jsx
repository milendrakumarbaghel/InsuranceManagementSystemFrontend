import { Link } from 'react-router-dom'
import { useClaims } from '../../hooks/useClaims.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BackButton from '../../components/common/BackButton.jsx'
import { exportToPDF } from '../../utils/exportUtils';

function AgentClaimQueuePage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = useClaims({ ...params, status: 'SUBMITTED' })

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  const columns = [
    { key: 'claimNumber', header: 'Claim Number' },
    { key: 'customerName', header: 'Customer', render: (row) => row.customerName ?? '—' },
    { key: 'claimAmount', header: 'Amount', render: (row) => formatCurrency(row.claimAmount) },
    { key: 'claimStatus', header: 'Status', render: (row) => <StatusBadge status={row.claimStatus} /> },
    { key: 'incidentDate', header: 'Incident Date', render: (row) => formatDate(row.incidentDate) },
    {
      key: 'actions', header: 'Actions',
      render: (row) => (
        <Link to={`/agent/claims/${row.claimId}/review`} onClick={(e) => e.stopPropagation()}
          className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100">
          Review
        </Link>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Claim Queue</h1>
      <DataTable columns={columns} data={records} isLoading={isLoading} emptyMessage="No submitted claims."
        exportTitle="Claim Queue Report" paginationProps={{ currentPage: page, totalPages, pageSize, totalRecords: totalElements, onPageChange: setPage, onPageSizeChange: setPageSize }} />
    </div>
  )
}

export default AgentClaimQueuePage
