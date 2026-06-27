import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClaims } from '../../hooks/useClaims.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatCurrency } from '../../utils/formatters.js'
import { CLAIM_STATUSES } from '../../utils/constants.js'
import { getEnumOptions } from '../../utils/formatters.js'

import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BackButton from '../../components/common/BackButton.jsx'
import SearchFilterBar from '../../components/common/SearchFilterBar.jsx'
import { exportToPDF } from '../../utils/exportUtils';

function AdminClaimListPage() {
  const navigate = useNavigate()
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  
  // 1. STATE: Hold the currently selected filter values (e.g., { status: 'APPROVED' })
  const [filters, setFilters] = useState({})

  // 2. MERGE: Combine pagination params with the active filters for the API call
  const queryParams = { ...params, ...filters }
  const { data, isLoading } = useClaims(queryParams)

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

  // 3. CONFIG: Define what the filter bar should render using your enums
  const filterConfig = [
    { key: 'search', label: 'Search Claim No', type: 'text' },
    { 
      key: 'status', 
      label: 'Claim Status', 
      type: 'select',
      options: getEnumOptions(CLAIM_STATUSES) // Generates the dropdown automatically
    }
  ]

  // 4. HANDLERS: Update state when a user types or selects a dropdown option
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      // If the user selects "All" (empty value), remove it from the query params
      if (!value) {
        const newFilters = { ...prev }
        delete newFilters[key]
        return newFilters
      }
      return { ...prev, [key]: value }
    })
    setPage(0) // Crucial: Always reset to the first page when a new filter is applied
  }

  // 5. HANDLERS: Clear all filters when the reset button is clicked
  const handleFilterReset = () => {
    setFilters({})
    setPage(0)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Claims</h1>
        <p className="text-gray-500 mt-1">Click a row to review or decide on a claim.</p>
      </div>

      {/* 6. RENDER: Drop the component into your UI and pass the props */}
      <div className="mb-6">
        <SearchFilterBar
          filters={filterConfig}
          values={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
          searchPlaceholder="Search by Claim No..."
        />
      </div>

      <DataTable 
        columns={columns} 
        data={records} 
        isLoading={isLoading} 
        emptyMessage="No claims found."
        onRowClick={(row) => navigate(`/admin/claims/${row.claimId}/decide`)}
        exportTitle="Admin Claims Report"
        paginationProps={{ 
          currentPage: page, 
          totalPages, 
          pageSize, 
          totalRecords: totalElements, 
          onPageChange: setPage, 
          onPageSizeChange: setPageSize 
        }} 
      />
    </div>
  )
}

export default AdminClaimListPage
