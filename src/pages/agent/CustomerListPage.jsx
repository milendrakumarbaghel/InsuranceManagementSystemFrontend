import { useNavigate } from 'react-router-dom'
import { useCustomers } from '../../hooks/useCustomers.js'
import { usePagination } from '../../hooks/usePagination.js'
import { useAuth } from '../../context/AuthContext.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import SearchFilterBar from '../../components/common/SearchFilterBar.jsx'
import BackButton from '../../components/common/BackButton.jsx'
import { exportToPDF } from '../../utils/exportUtils';

const FILTER_DEFS = [
  { 
    key: 'search', 
    label: 'Search by Name or Email', 
    type: 'text',
    placeholder: 'Enter name or email...' 
  }
];

function CustomerListPage() {
  const navigate = useNavigate()
  const { user } = useAuth() 
  const { params, page, pageSize, setPage, setPageSize, setFilter, resetFilters } = usePagination()

  // Catch the error object here too
  const { data, isLoading, error, isError } = useCustomers(params)

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  const filterValues = {
    search: params.search ?? '',
  }

  const columns = [
    { key: 'customerId', header: 'Customer ID', sortable: true, render: (row) => row.customerId ?? '-' },
    { key: 'fullName', header: 'Full Name', sortable: true, render: (row) => row.fullName ?? '-' },
    { key: 'city', header: 'City', sortable: true, render: (row) => row.city ?? '-' },
    { key: 'state', header: 'State', render: (row) => row.state ?? '-' },
  ]

  const basePath = user?.role === 'ADMIN' ? '/admin' : '/agent'

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">
          Browse and search customers. Click a row to view full profile.
        </p>
      </div>

      <div className="mb-4">
        <SearchFilterBar
          filters={FILTER_DEFS}
          values={{ search: params.search ?? '' }}
          onChange={(key, value) => setFilter(key, value)}
          onReset={resetFilters}
          searchPlaceholder="Search by name or email"
        />
      </div>

      {/* Show Error clearly if API fails */}
      {isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 border border-red-200">
          <strong>Error loading customers: </strong> 
          {error?.response?.data?.message || error?.message || 'Something went wrong on the server.'}
        </div>
      )}

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No customers found. (Have any customers completed their profiles?)"
        onRowClick={(row) => navigate(`${basePath}/customers/${row.customerId}`)}
        exportTitle="Agent Customers List"
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

export default CustomerListPage