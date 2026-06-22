import { useNavigate } from 'react-router-dom'
import { useClaims } from '../../hooks/useClaims.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatCurrency } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function AdminClaimListPage() {
  const navigate = useNavigate()
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = useClaims(params)

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  const columns = [
    { key: 'claimNumber', header: 'Claim Number' },
    { key: 'policyNumber', header: 'Policy Number', render: (row) => row.policyNumber ?? '—' },
    { key: 'customerName', header: 'Customer', render: (row) => row.customerName ?? '—' },
    { key: 'claimAmount', header: 'Amount', render: (row) => formatCurrency(row.claimAmount) },
    { key: 'claimStatus', header: 'Status', render: (row) => <StatusBadge status={row.claimStatus} /> },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Claims</h1>
        <p className="text-gray-500 mt-1">Click a row to review or decide on a claim.</p>
      </div>
      <DataTable columns={columns} data={records} isLoading={isLoading} emptyMessage="No claims found."
        onRowClick={(row) => navigate(`/admin/claims/${row.claimId}/decide`)}
        paginationProps={{ currentPage: page, totalPages, pageSize, totalRecords: totalElements, onPageChange: setPage, onPageSizeChange: setPageSize }} />
    </div>
  )
}

export default AdminClaimListPage
