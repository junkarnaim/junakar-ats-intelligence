import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { formatDate } from '../../utils/formatDate'
import ApplicationStatus from './ApplicationStatus'

function AiScoreChip({ score }) {
  if (score === null || score === undefined) {
    return (
      <Typography color="text.disabled" variant="body2">
        —
      </Typography>
    )
  }

  const color = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error'

  return (
    <Tooltip title="AI match score for this application">
      <Chip color={color} label={`${score}%`} size="small" />
    </Tooltip>
  )
}

function ApplicationTable({ applications }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Applied</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>AI Score</TableCell>
            <TableCell>Resume</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((application) => (
            <TableRow hover key={application.id}>
              <TableCell>
                <Typography fontWeight={700}>
                  {application.job?.title || 'Archived job'}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {application.job?.location || 'Location unavailable'}
                </Typography>
              </TableCell>
              <TableCell>{application.job?.company || 'ATS Hiring Team'}</TableCell>
              <TableCell>{formatDate(application.appliedAt)}</TableCell>
              <TableCell>
                <ApplicationStatus status={application.status} />
              </TableCell>
              <TableCell>
                <AiScoreChip score={application.aiScore} />
              </TableCell>
              <TableCell>{application.resumeFileName || 'Resume uploaded'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ApplicationTable
