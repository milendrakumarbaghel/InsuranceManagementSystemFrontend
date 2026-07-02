import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClaims, useAssignClaim } from '../../hooks/useClaims.js'
import { useAdminUsers } from '../../hooks/useUsers.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatCurrency, formatDate, getEnumOptions } from '../../utils/formatters.js'
import { CLAIM_STATUSES } from '../../utils/constants.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'

import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BackButton from '../../components/common/BackButton.jsx'
import SearchFilterBar from '../../components/common/SearchFilterBar.jsx'
import Modal from '../../components/common/Modal.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import FormSelect from '../../components/common/FormSelect.jsx'

const ASSIGNABLE_STATUSES = new Set(['SUBMITTED', 'ASSIGNED'])
const DECISION_STATUSES = new Set(['RECOMMENDED_APPROVAL', 'RECOMMENDED_REJECTION'])

function AdminClaimListPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { params, page, pageSize, setPage, setPageSize } = usePagination({
    defaultSort: 'id',
    defaultSortDir: 'desc',
  })
  const [filters, setFilters] = useState({})
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [selectedAgentId, setSelectedAgentId] = useState('')
  const [pendingAssignment, setPendingAssignment] = useState(null)

  const queryParams = { ...params, ...filters }
  const { data, isLoading } = useClaims(queryParams)
  const assignClaim = useAssignClaim()
  const { data: agentsData, isLoading: isAgentsLoading } = useAdminUsers({
    role: 'AGENT',
    active: true,
    page: 0,
    size: 100,
    sortBy: 'username',
    sortDir: 'asc',
  })

  const records = data?.data?.content ?? data?.content ?? []
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0
  const agents = agentsData?.data?.content ?? agentsData?.content ?? []

  const filteredClaims = useMemo(() => {
    return records.filter((claim) => {
      const matchesName = filters.customerName
        ? claim.customerName?.toLowerCase().includes(filters.customerName.toLowerCase())
        : true
      return matchesName
    })
  }, [records, filters.customerName])

  const selectedAgentLabel =
    agents.find((agent) => String(agent.id ?? agent.userId) === String(selectedAgentId))?.name
    ?? agents.find((agent) => String(agent.id ?? agent.userId) === String(selectedAgentId))?.username
    ?? 'selected agent'

  const columns = [
    {
      key: 'claimNumber',
      header: 'Claim',
      render: (row) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{row.claimNumber}</div>
          <div className="text-xs text-gray-500">{row.policyNumber ?? '—'}</div>
        </div>
      ),
    },
    { key: 'customerName', header: 'Customer', render: (row) => row.customerName ?? '—' },
    { key: 'claimAmount', header: 'Amount', render: (row) => formatCurrency(row.claimAmount) },
    { key: 'assignedAgentName', header: 'Assigned Agent', render: (row) => row.assignedAgentName ?? '—' },
    { key: 'incidentDate', header: 'Incident Date', render: (row) => formatDate(row.incidentDate) },
    { key: 'assignedAt', header: 'Assigned At', render: (row) => formatDate(row.assignedAt) },
    { key: 'claimStatus', header: 'Status', render: (row) => <StatusBadge status={row.claimStatus} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {ASSIGNABLE_STATUSES.has(row.claimStatus) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedClaim(row)
                setSelectedAgentId(String(row.assignedAgentId ?? ''))
              }}
              className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              Assign Agent
            </button>
          )}

          {DECISION_STATUSES.has(row.claimStatus) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/admin/claims/${row.claimId}/decide`)
              }}
              className="rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
            >
              Review & Decide
            </button>
          )}

          {!ASSIGNABLE_STATUSES.has(row.claimStatus) && !DECISION_STATUSES.has(row.claimStatus) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/admin/claims/${row.claimId}/decide`)
              }}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              View
            </button>
          )}
        </div>
      ),
    },
  ]

  const filterConfig = [
    { key: 'customerName', label: 'Customer Name', type: 'text' },
    { key: 'status', label: 'Claim Status', type: 'select', options: getEnumOptions(CLAIM_STATUSES) },
  ]

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      if (!value) delete next[key]
      return next
    })
    setPage(0)
  }

  const confirmAssignment = () => {
    if (!pendingAssignment) return

    assignClaim.mutate(
      { id: pendingAssignment.claimId, agentId: pendingAssignment.agentId },
      {
        onSuccess: () => {
          showToast(`Claim ${pendingAssignment.claimNumber} assigned successfully.`, 'success')
          setPendingAssignment(null)
          setSelectedClaim(null)
          setSelectedAgentId('')
        },
        onError: (error) => handleApiError(error, showToast),
      },
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
        <p className="mt-1 text-sm text-gray-500">Assign claims to agents, review recommendations, and finalize decisions.</p>
      </div>

      <div className="mb-6">
        <SearchFilterBar
          filters={filterConfig}
          values={filters}
          onChange={handleFilterChange}
          onReset={() => {
            setFilters({})
            setPage(0)
          }}
          searchPlaceholder="Search by customer name"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredClaims}
        isLoading={isLoading}
        emptyMessage="No claims found."
        onRowClick={(row) => navigate(`/admin/claims/${row.claimId}/decide`)}
        getRowClassName={(row) => {
          if (DECISION_STATUSES.has(row.claimStatus)) return 'bg-green-50/40'
          if (row.claimStatus === 'ASSIGNED') return 'bg-blue-50/60'
          return ''
        }}
        exportTitle="Admin Claims Report"
        paginationProps={{
          currentPage: page,
          totalPages,
          pageSize,
          totalRecords: totalElements,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <Modal
        isOpen={!!selectedClaim}
        onClose={() => {
          setSelectedClaim(null)
          setSelectedAgentId('')
        }}
        title={selectedClaim ? `Assign ${selectedClaim.claimNumber}` : 'Assign claim'}
        size="lg"
      >
        {selectedClaim && (
          <div className="space-y-5">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-medium text-gray-900">{selectedClaim.customerName}</p>
              <p className="mt-1">Claim amount: {formatCurrency(selectedClaim.claimAmount)}</p>
              <p className="mt-1">Current status: <StatusBadge status={selectedClaim.claimStatus} /></p>
            </div>

            <FormSelect
              label="Available Agent"
              name="agentId"
              required
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              options={[
                { value: '', label: isAgentsLoading ? 'Loading agents...' : 'Select agent' },
                ...agents.map((agent) => ({
                  value: String(agent.id ?? agent.userId),
                  label: `${agent.name ?? agent.username ?? 'Agent'}${agent.email ? ` (${agent.email})` : ''}`,
                })),
              ]}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedClaim(null)
                  setSelectedAgentId('')
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedAgentId) return
                  setPendingAssignment({
                    claimId: selectedClaim.claimId,
                    claimNumber: selectedClaim.claimNumber,
                    agentId: Number(selectedAgentId),
                  })
                  setSelectedClaim(null)
                }}
                disabled={!selectedAgentId || assignClaim.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Assign Agent
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!pendingAssignment}
        title="Confirm assignment"
        message={`Assign claim ${pendingAssignment?.claimNumber} to ${selectedAgentLabel}?`}
        confirmLabel={assignClaim.isPending ? 'Assigning...' : 'Assign'}
        variant="default"
        onConfirm={confirmAssignment}
        onCancel={() => setPendingAssignment(null)}
        isLoading={assignClaim.isPending}
      />
    </div>
  )
}

export default AdminClaimListPage