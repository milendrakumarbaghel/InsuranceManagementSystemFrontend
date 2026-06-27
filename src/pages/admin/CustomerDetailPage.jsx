import { useParams } from 'react-router-dom'
// 1. Updated import to use the userId hook
import { useCustomerByUserId } from '../../hooks/useCustomers.js'
import { usePolicies } from '../../hooks/usePolicies.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatDate } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value ?? '—'}</dd>
    </div>
  )
}

const POLICY_COLUMNS = [
  {
    key: 'policyNumber',
    header: 'Policy Number',
    render: (row) => row.policyNumber ?? '—',
  },
  {
    key: 'planName',
    header: 'Plan',
    render: (row) => row.planName ?? row.plan?.planName ?? '—',
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'startDate',
    header: 'Start Date',
    render: (row) => formatDate(row.startDate),
  },
]

function CustomersDetailPage() {
  // 'id' represents the userId passed in the URL
  const { id } = useParams()

  // 2. Switched to useCustomerByUserId
  const { data: customerData, isLoading: customerLoading, error } = useCustomerByUserId(id)

  const { params, page, pageSize, setPage, setPageSize } = usePagination({
    defaultSort: 'startDate',
  })

  // Fetch policies using the customerId retrieved from the customer object, 
  // or fallback to the URL ID if the API allows userId filtering
  const { data: policiesData, isLoading: policiesLoading } = usePolicies({
    ...params,
    customerId: customerData?.customerId, 
  })

  const policies = policiesData?.data?.content ?? policiesData?.content ?? []
  const totalPages = policiesData?.data?.totalPages ?? policiesData?.totalPages ?? 0
  const totalElements = policiesData?.data?.totalElements ?? policiesData?.totalElements ?? 0

  if (customerLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (error || !customerData) {
    return (
      <div className="p-6 text-center text-red-500">
        {error ? 'Error loading customer profile.' : 'Customer not found.'}
      </div>
    )
  }

  const customer = customerData
  const fullName = customer.fullName || '—'
  
  const fullAddress = [customer.address, customer.city, customer.state, customer.pinCode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <BackButton />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
        <p className="text-gray-500 mt-1">Customer ID: {customer.customerId}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
          Profile Details
        </h2>
        
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DetailItem label="Full Name" value={customer.fullName} />
          <DetailItem label="Email" value={customer.email} />
          <DetailItem label="Mobile Number" value={customer.mobileNumber} />
          <DetailItem label="Date of Birth" value={formatDate(customer.dateOfBirth)} />
          <DetailItem label="Address" value={fullAddress || '—'} />
          <DetailItem label="Nominee Name" value={customer.nomineeName} />
          <DetailItem label="Nominee Relation" value={customer.nomineeRelation} />
        </dl>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Policies</h2>
        <DataTable
          columns={POLICY_COLUMNS}
          data={policies}
          isLoading={policiesLoading}
          emptyMessage="No policies found for this customer."
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
    </div>
  )
}

export default CustomersDetailPage