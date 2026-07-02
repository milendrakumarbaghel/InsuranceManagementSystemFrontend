
const STATUS_CLASS_MAP = {
  PENDING_PAYMENT:       'bg-yellow-100 text-yellow-800',
  ACTIVE:                'bg-green-100 text-green-800',
  LAPSED:                'bg-gray-100 text-gray-600',
  EXPIRED:               'bg-gray-100 text-gray-600',
  CANCELLED:             'bg-red-100 text-red-700',
  SUBMITTED:             'bg-gray-100 text-gray-700',
  ASSIGNED:              'bg-blue-100 text-blue-800',
  UNDER_REVIEW:          'bg-indigo-100 text-indigo-800',
  RECOMMENDED_APPROVAL:  'border border-green-300 bg-green-50 text-green-700',
  RECOMMENDED_REJECTION: 'border border-red-300 bg-red-50 text-red-700',
  APPROVED:              'bg-green-600 text-white',
  REJECTED:              'bg-red-600 text-white',
  // INACTIVE is used by admin user/product/plan toggles
  INACTIVE:              'bg-gray-100 text-gray-600',
}

const FALLBACK_CLASS = 'bg-gray-100 text-gray-600'

function formatLabel(status) {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function StatusBadge({ status, size = 'md' }) {
  const colorClass = STATUS_CLASS_MAP[status] ?? FALLBACK_CLASS
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
    >
      {formatLabel(status)}
    </span>
  )
}

export default StatusBadge
