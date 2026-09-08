export function getApiErrorMessage(error) {
  if (error?.response?.data) {
    if (typeof error.response.data === 'string' && error.response.data.length < 200) {
      return error.response.data
    }
    if (error.response.data.error) {
      return error.response.data.error
    }
    if (error.response.data.message) {
      return error.response.data.message
    }
  }

  if (error?.response?.statusText) {
    return `${error.response.status}: ${error.response.statusText}`
  }

  if (error?.message && error.message !== 'Network Error') {
    return error.message
  }

  return 'Network error. Check that the backend server is running.'
}
