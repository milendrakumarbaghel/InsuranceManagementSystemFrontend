import { usePayments } from '../../hooks/usePayments.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'

function MyPaymentsPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = usePayments(params)

  // Extract the paginated array content based on the API envelope design
  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  const columns = [
    { key: 'paymentId', header: 'Payment ID' },
    { key: 'policyNumber', header: 'Policy Number', render: (row) => row.policyNumber ?? ' ' },
    { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'paymentMode', header: 'Mode' },
    { key: 'paymentDate', header: 'Date', render: (row) => formatDate(row.paymentDate) },
    { key: 'transactionReference', header: 'Transaction Ref', render: (row) => row.transactionReference ?? ' ' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Payments</h1>
        <p className="text-gray-500 mt-1">Track premium payments made for your insurance policies.</p>
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No premium payments recorded yet."
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

export default MyPaymentsPage