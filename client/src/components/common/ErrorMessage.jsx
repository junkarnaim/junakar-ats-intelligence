import { Alert } from '@mui/material'

function ErrorMessage({ message = 'Something went wrong. Please try again.' }) {
  return <Alert severity="error">{message}</Alert>
}

export default ErrorMessage
