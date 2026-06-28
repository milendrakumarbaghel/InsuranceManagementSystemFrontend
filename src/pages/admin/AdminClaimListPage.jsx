// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useClaims } from '../../hooks/useClaims.js'
// import { usePagination } from '../../hooks/usePagination.js'
// import { formatCurrency } from '../../utils/formatters.js'
// import { CLAIM_STATUSES } from '../../utils/constants.js'
// import { getEnumOptions } from '../../utils/formatters.js'

// import DataTable from '../../components/common/DataTable.jsx'
// import StatusBadge from '../../components/common/StatusBadge.jsx'
// import BackButton from '../../components/common/BackButton.jsx'
// import SearchFilterBar from '../../components/common/SearchFilterBar.jsx'
// import { exportToPDF } from '../../utils/exportUtils';

// function AdminClaimListPage() {
//   const navigate = useNavigate()
//   const { params, page, pageSize, setPage, setPageSize } = usePagination()
//   const [filters, setFilters] = useState({})

//   // Fetch data
//   const queryParams = { ...params, ...filters }
//   const { data, isLoading } = useClaims(queryParams)

//   const records = data?.data?.content ?? data?.content ?? []
//   const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
//   const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

//   const filteredClaims = records.filter((claim) => {
//     const matchesName = filters.customerName
//       ? claim.customerName?.toLowerCase().includes(filters.customerName.toLowerCase())
//       : true;
//     const matchesStatus = filters.status
//       ? claim.claimStatus === filters.status
//       : true;
//     return matchesName && matchesStatus;
//   });

//   const columns = [
//     { key: 'claimNumber', header: 'Claim Number' },
//     { key: 'policyNumber', header: 'Policy Number', render: (row) => row.policyNumber ?? '—' },
//     { key: 'customerName', header: 'Customer', render: (row) => row.customerName ?? '—' },
//     { key: 'claimAmount', header: 'Amount', render: (row) => formatCurrency(row.claimAmount) },
//     { key: 'claimStatus', header: 'Status', render: (row) => <StatusBadge status={row.claimStatus} /> },
//   ]

//   const filterConfig = [
//     { key: 'customerName', label: 'Customer Name', type: 'text' },
//     { key: 'status', label: 'Claim Status', type: 'select', options: getEnumOptions(CLAIM_STATUSES) }
//   ]

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => {
//       const newFilters = { ...prev, [key]: value };
//       if (!value) delete newFilters[key];
//       return newFilters;
//     });
//     setPage(0); 
//   }

//   const handleFilterReset = () => {
//     setFilters({})
//     setPage(0)
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <BackButton />
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">All Claims</h1>
//       </div>

//       <div className="mb-6">
//         <SearchFilterBar
//           filters={filterConfig}
//           values={filters} 
//           onChange={handleFilterChange}
//           onReset={handleFilterReset}
//           searchPlaceholder="Search by Customer name"
//         />
//       </div>

//       <DataTable 
//         columns={columns} 
//         data={filteredClaims} 
//         isLoading={isLoading} 
//         emptyMessage="No claims found."
//         onRowClick={(row) => navigate(`/admin/claims/${row.claimId}/decide`)}
//         exportTitle="Admin Claims Report"
//         paginationProps={{ 
//           currentPage: page, 
//           totalPages, 
//           pageSize, 
//           totalRecords: totalElements, 
//           onPageChange: setPage, 
//           onPageSizeChange: setPageSize 
//         }} 
//       />
//     </div>
//   )
// }

// export default AdminClaimListPage
