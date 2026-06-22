
function getBackendMessage(error) {
  return error?.response?.data?.message ?? null
}
 

export function handleApiError(error, showToast) {
  if (!error.response) {
    // Network error — no HTTP response received
    showToast('Network error. Please check your connection.', 'error')
    return
  }

  const status = error.response.status
  const backendMessage = getBackendMessage(error)

  switch (status) {
    case 400:
      showToast(backendMessage || 'Invalid request. Please check your input.', 'error')
      break

    case 403:
      showToast('You do not have permission to perform this action.', 'error')
      break

    case 404:
      showToast(backendMessage || 'Resource not found.', 'error')
      break

    case 409:
      showToast(backendMessage || 'A conflict occurred. Please try again.', 'error')
      break

    case 422:
      showToast(backendMessage || 'The request could not be processed.', 'error')
      break

    case 500:
      showToast('Something went wrong. Please try again later.', 'error')
      break

    default:
      showToast(backendMessage || 'An unexpected error occurred.', 'error')
      break
  }
}
