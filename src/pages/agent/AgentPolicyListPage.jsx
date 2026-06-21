import { useState } from 'react'
import { usePolicies } from '../../hooks/usePolicies.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatDate } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'

const STATUS_OPTIONS = ['', 'PENDING_PAYMENT', 'ACTIVE', 'EXPIRED', 'CANCELLED']

function AgentPolicyListPage() {
  const [status, setStatus] = useState('')
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = usePolicies({ ...params, ...(status ? { status } : {}) })

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  const columns = [
    { key: 'policyNumber', header: 'Policy Number' },
    { key: 'customerName', header: 'Customer' },
    { key: 'planName', header: 'Plan' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'startDate', header: 'Start Date', render: (row) => formatDate(row.startDate) },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Policies</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
      </div>
      <DataTable columns={columns} data={records} isLoading={isLoading} emptyMessage="No policies found."
        paginationProps={{ currentPage: page, totalPages, pageSize, totalRecords: totalElements, onPageChange: setPage, onPageSizeChange: setPageSize }} />
    </div>
  )
}

export default AgentPolicyListPage
