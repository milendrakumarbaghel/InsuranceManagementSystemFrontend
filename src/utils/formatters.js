
// formatDate('2024-03-15T10:30:00')  // → '15 Mar 2024'
// formatDate(null)                   // → '—'
export function formatDate(dateString) {
  if (dateString === null || dateString === undefined) {
    return '—'
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}


// formatDateTime('2024-03-15T10:30:00')  // → '15 Mar 2024, 10:30 AM'
// formatDateTime(null)                   // → '—'

export function formatDateTime(dateTimeString) {
  if (dateTimeString === null || dateTimeString === undefined) {
    return '—'
  }
  const date = new Date(dateTimeString)
  if (isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// formatCurrency(50000)   // → '₹50,000.00'
// formatCurrency(1234.5)  // → '₹1,234.50'

export function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}


// formatStatus('PENDING_PAYMENT')       // → 'Pending Payment'
// formatStatus('RECOMMENDED_APPROVAL') // → 'Recommended Approval'
// formatStatus('ACTIVE')               // → 'Active'
export function formatStatus(status) {
  if (!status) return ''
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
