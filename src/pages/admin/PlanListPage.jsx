import { Link } from 'react-router-dom'
// Import useActivatePlan
import { usePlans, useTogglePlan, useActivatePlan } from '../../hooks/usePlans.js'
import { usePagination } from '../../hooks/usePagination.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import { formatCurrency } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function PlanListPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = usePlans(params)
  
  const togglePlan = useTogglePlan() // Deactivate
  const activatePlan = useActivatePlan() // Activate
  
  const { showToast } = useToast()

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0

  function handleDeactivate(row) {
    togglePlan.mutate({ id: row.PolicyPlanId ?? row.policyPlanId }, {
      onSuccess: () => showToast(`Plan "${row.planName}" deactivated.`, 'success'),
      onError: (err) => handleApiError(err, showToast),
    })
  }

  // Add handleActivate function
  function handleActivate(row) {
    activatePlan.mutate({ id: row.PolicyPlanId ?? row.policyPlanId }, {
      onSuccess: () => showToast(`Plan "${row.planName}" activated.`, 'success'),
      onError: (err) => handleApiError(err, showToast),
    })
  }

  const columns = [
    { key: 'planName', header: 'Plan Name', sortable: true },
    { key: 'productName', header: 'Product', render: (row) => row.productName ?? '—' },
    { key: 'coverageAmount', header: 'Coverage', render: (row) => formatCurrency(row.coverageAmount) },
    { key: 'premiumAmount', header: 'Premium', render: (row) => formatCurrency(row.premiumAmount) },
    { key: 'premiumType', header: 'Type' },
    { key: 'duration', header: 'Duration', render: (row) => `${row.duration} mo` },
    { key: 'active', header: 'Status', render: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/plans/${row.PolicyPlanId ?? row.policyPlanId}/edit`} onClick={(e) => e.stopPropagation()} className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">Edit</Link>
          
          {/* Conditionally render Activate or Deactivate based on plan status */}
          {row.active ? (
            <button onClick={(e) => { e.stopPropagation(); handleDeactivate(row) }} disabled={togglePlan.isPending} className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50">
              Deactivate
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); handleActivate(row) }} disabled={activatePlan.isPending} className="rounded-md bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50">
              Activate
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
        <Link to="/admin/plans/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ New Plan</Link>
      </div>
      <DataTable columns={columns} data={records} isLoading={isLoading} emptyMessage="No plans found."
        paginationProps={{ currentPage: page, totalPages, pageSize, totalRecords: totalElements, onPageChange: setPage, onPageSizeChange: setPageSize }} />
    </div>
  )
}

export default PlanListPage
