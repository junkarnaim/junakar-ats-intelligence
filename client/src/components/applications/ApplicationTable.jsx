import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { formatDate } from '../../utils/formatDate'
import ApplicationStatus from './ApplicationStatus'

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
              <TableCell>{application.resumeFileName || 'Resume uploaded'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ApplicationTable
