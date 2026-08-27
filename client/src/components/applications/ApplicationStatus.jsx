import { Chip } from '@mui/material'

const statusColors = {
  Applied: 'info',
  Interview: 'warning',
  Offered: 'success',
  Rejected: 'error',
}

function ApplicationStatus({ status }) {
  return <Chip color={statusColors[status] || 'default'} label={status} size="small" />
}

export default ApplicationStatus
