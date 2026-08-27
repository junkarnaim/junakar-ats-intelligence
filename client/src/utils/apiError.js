export function getApiErrorMessage(error) {
  if (!error.response) {
    return 'Network error. Check that the backend server is running.'
  }

  return (
    error.response.data?.error ||
    error.response.data?.message ||
    'Something went wrong. Please try again.'
  )
}
