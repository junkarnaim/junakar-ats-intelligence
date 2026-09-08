import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loader from '../../components/common/Loader'
import { useAllApplications } from '../../hooks/useApplications'
import { useJobs } from '../../hooks/useJobs'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/formatDate'

function StatusBadge({ status }) {
  const colors = {
    Applied: 'info',
    Interview: 'warning',
    Offered: 'success',
    Rejected: 'error',
  }
  return <Chip color={colors[status] || 'default'} label={status} size="small" />
}

function AiChip({ score }) {
  if (score === null || score === undefined) {
    return <Typography color="text.disabled" variant="body2">—</Typography>
  }
  const color = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error'
  return (
    <Tooltip title="AI match score">
      <Chip color={color} label={`${score}%`} size="small" />
    </Tooltip>
  )
}

function RecruiterDashboard() {
  const { user } = useAuth()
  const { data: allJobs = [], isLoading: jobsLoading, isError: jobsError } = useJobs({})
  const {
    data: applications = [],
    isLoading: appsLoading,
    isError: appsError,
  } = useAllApplications()

  // Filter jobs belonging to this recruiter
  const myJobs = allJobs.filter(
    (job) =>
      String(job.recruiterId) === String(user?.id) ||
      String(job.recruiterId) === String(user?._id),
  )

  const activeJobsCount = myJobs.filter(
    (j) => j.rawStatus === 'active' || j.status === 'Active' || j.status === 'active',
  ).length

  const inReviewCount = applications.filter(
    (a) => a.status === 'Interview' || a.status === 'Offered',
  ).length

  const metrics = [
    {
      label: 'My Posted Jobs',
      value: myJobs.length,
      icon: WorkOutlineOutlinedIcon,
      color: 'primary',
    },
    {
      label: 'Active Listings',
      value: activeJobsCount,
      icon: BusinessCenterOutlinedIcon,
      color: 'success',
    },
    {
      label: 'Total Applications',
      value: applications.length,
      icon: DescriptionOutlinedIcon,
      color: 'info',
    },
    {
      label: 'In Review / Offered',
      value: inReviewCount,
      icon: EventAvailableOutlinedIcon,
      color: 'warning',
    },
  ]

  const isLoading = jobsLoading || appsLoading
  const isError = jobsError || appsError

  return (
    <Stack spacing={3}>
      <Stack
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack spacing={0.5}>
          <Typography component="h1" variant="h4">
            Recruiter dashboard
          </Typography>
          <Typography color="text.secondary">
            Manage your open jobs, track candidate applications, and evaluate AI match scores.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button
            component={RouterLink}
            to="/recruiter/jobs"
            variant="contained"
          >
            Post new job
          </Button>
          <Button
            component={RouterLink}
            to="/recruiter/applications"
            variant="outlined"
          >
            Review applications
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Grid item xs={12} sm={6} md={3} key={metric.label}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={1}>
                    <Icon color={metric.color} />
                    <Typography color="text.secondary" variant="body2">
                      {metric.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {isLoading ? '…' : metric.value}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Recent applications</Typography>
            {applications.length > 5 ? (
              <Button
                component={RouterLink}
                size="small"
                to="/recruiter/applications"
              >
                View all ({applications.length})
              </Button>
            ) : null}
          </Stack>

          {isLoading ? <Loader minHeight={180} /> : null}
          {isError ? <ErrorMessage message="Unable to load dashboard data." /> : null}

          {!isLoading && !isError && applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Applications submitted for your job postings will appear here."
              actionLabel="Manage jobs"
              onAction={() => window.location.assign('/recruiter/jobs')}
            />
          ) : null}

          {!isLoading && !isError && applications.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Job</TableCell>
                    <TableCell>Applied</TableCell>
                    <TableCell>AI Match</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.slice(0, 5).map((app) => (
                    <TableRow hover key={app.id}>
                      <TableCell>
                        <Typography fontWeight={700}>
                          {app.candidate?.name || 'Unknown candidate'}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {app.candidate?.email || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>
                          {app.job?.title || 'Archived job'}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {app.job?.location || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(app.appliedAt)}</TableCell>
                      <TableCell>
                        <AiChip score={app.aiScore} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  )
}

export default RecruiterDashboard
