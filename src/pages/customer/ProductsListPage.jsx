import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts.js'
import { usePagination } from '../../hooks/usePagination.js'
import Spinner from '../../components/common/Spinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'

function ProductsListPage() {
  const { params, page, pageSize, setPage } = usePagination()
  const { data, isLoading } = useProducts({ ...params, active: true })

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insurance Products</h1>
        <p className="text-gray-500 mt-1">Select a product to view available plans.</p>
      </div>
      {records.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No active products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((product) => (
            <div key={product.productId} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">{product.productName}</h2>
                <StatusBadge status={product.productType} size="sm" />
              </div>
              <p className="text-sm text-gray-600 flex-1">{product.description}</p>
              <Link to={`/customer/products/${product.productId}/plans`}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white text-center hover:bg-blue-700">
                View Plans
              </Link>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 text-sm">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  )
}

export default ProductsListPage
