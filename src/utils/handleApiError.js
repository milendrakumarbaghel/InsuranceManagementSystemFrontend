export function getBackendMessage(error) {
  if (error?.response?.data) {
    const data = error.response.data

    if (data.messages && typeof data.messages === 'object') {
     
      return Object.values(data.messages).join('\n')
    }
    return (
      data.message ||
      data.error ||
      (typeof data === 'string' ? data : null)
    )
  }
  return error?.message || null
}

export function handleApiError(error, showToast, customFallback) {
  if (!error.response) {
    // Network error — no HTTP response received
    showToast('Network error. Please check your connection.', 'error')
    return
  }

  const status = error.response.status
  const backendMessage = getBackendMessage(error)
  const defaultFallback = 'Something went wrong. Please try again.'

  // Requirement: ALWAYS prioritize the exact backend message if it exists
  if (backendMessage) {
    showToast(backendMessage, 'error')
    return
  }

  // Fallbacks applied ONLY if the backend returned no specific message
  switch (status) {
    case 400:
      showToast('Invalid request. Please check your input.', 'error')
      break
    case 401:
      showToast('Unauthorized. Please log in again.', 'error')
      break

    case 403:
      showToast('You do not have permission to perform this action.', 'error')
      break

    case 404:
      showToast('Resource not found.', 'error')
      break

    case 409:
      showToast('A conflict occurred. Please try again.', 'error')
      break

    case 422:
      showToast('The request could not be processed due to validation errors.', 'error')
      break

    case 500:
      showToast('Internal server error. Please try again later.', 'error')
      break

    default:
      showToast(customFallback || defaultFallback, 'error')
      break
  }
}
