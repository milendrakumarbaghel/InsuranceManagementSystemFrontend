import { usePayments } from '../../hooks/usePayments.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import BackButton from '../../components/common/BackButton.jsx'
import { exportToPDF } from '../../utils/exportUtils';

function AgentPaymentListPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = usePayments(params)

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  const columns = [
    { key: 'paymentId', header: 'ID' },
    { key: 'policyNumber', header: 'Policy Number', render: (row) => row.policyNumber ?? '—' },
    { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'paymentMode', header: 'Mode' },
    { key: 'paymentDate', header: 'Date', render: (row) => formatDate(row.paymentDate) },
    { key: 'transactionReference', header: 'Reference', render: (row) => row.transactionReference ?? '—' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>
      <DataTable columns={columns} data={records} isLoading={isLoading} emptyMessage="No payments found."
       exportTitle="Agent Payments Report" paginationProps={{ currentPage: page, totalPages, pageSize, totalRecords: totalElements, onPageChange: setPage, onPageSizeChange: setPageSize }} />
    </div>
  )
}

export default AgentPaymentListPage
