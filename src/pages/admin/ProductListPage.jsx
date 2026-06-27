import { Link } from 'react-router-dom'
import { useProducts, useToggleProduct } from '../../hooks/useProducts.js'
import { usePagination } from '../../hooks/usePagination.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BackButton from '../../components/common/BackButton.jsx'
import { exportToPDF } from '../../utils/exportUtils';

function ProductListPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = useProducts(params)
  const toggleProduct = useToggleProduct()
  const { showToast } = useToast()

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  function handleToggle(row) {
    toggleProduct.mutate({ id: row.productId, active: !row.active }, {
      onSuccess: () => showToast(`Product "${row.productName}" ${!row.active ? 'activated' : 'deactivated'}.`, 'success'),
      onError: (err) => handleApiError(err, showToast),
    })
  }

  const columns = [
    { key: 'productName', header: 'Product Name', sortable: true },
    { key: 'productType', header: 'Type', sortable: true },
    { key: 'description', header: 'Description' },
    { key: 'active', header: 'Status', render: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/products/${row.productId}/edit`} onClick={(e) => e.stopPropagation()} className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">Edit</Link>
          <button onClick={(e) => { e.stopPropagation(); handleToggle(row) }} disabled={toggleProduct.isPending} className={`rounded-md px-3 py-1 text-xs font-medium disabled:opacity-50 ${row.active ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
            {row.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Products</h1></div>
        <Link to="/admin/products/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ New Product</Link>
      </div>
      <DataTable columns={columns} data={records} isLoading={isLoading} exportTitle="Admin Products List" emptyMessage="No products found."
        paginationProps={{ currentPage: page, totalPages, pageSize, totalRecords: totalElements, onPageChange: setPage, onPageSizeChange: setPageSize }} />
    </div>
  )
}

export default ProductListPage
