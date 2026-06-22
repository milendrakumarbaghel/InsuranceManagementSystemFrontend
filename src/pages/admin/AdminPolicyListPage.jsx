import { usePolicies } from '../../hooks/usePolicies.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatDate } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function AdminPolicyListPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = usePolicies(params)

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  const columns = [
    { key: 'policyNumber', header: 'Policy Number' },
    { key: 'customerName', header: 'Customer', render: (row) => row.customerName ?? '—' },
    { key: 'planName', header: 'Plan', render: (row) => row.planName ?? '—' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'startDate', header: 'Start Date', render: (row) => formatDate(row.startDate) },
    { key: 'endDate', header: 'End Date', render: (row) => formatDate(row.endDate) },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Policies</h1>
      </div>
      <DataTable columns={columns} data={records} isLoading={isLoading} emptyMessage="No policies found."
        paginationProps={{ currentPage: page, totalPages, pageSize, totalRecords: totalElements, onPageChange: setPage, onPageSizeChange: setPageSize }} />
    </div>
  )
}

export default AdminPolicyListPage
