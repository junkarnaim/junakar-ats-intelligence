import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import ApplicationTable from '../../components/applications/ApplicationTable'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loader from '../../components/common/Loader'
import { useMyApplications } from '../../hooks/useApplications'

const metricConfig = [
  { label: 'Total applications', status: null, icon: DescriptionOutlinedIcon },
  { label: 'Applied', status: 'Applied', icon: DescriptionOutlinedIcon },
  { label: 'Interview', status: 'Interview', icon: EventAvailableOutlinedIcon },
  { label: 'Offered', status: 'Offered', icon: WorkspacePremiumOutlinedIcon },
  { label: 'Rejected', status: 'Rejected', icon: HighlightOffOutlinedIcon },
]

function CandidateDashboard() {
  const { data: applications = [], isError, isLoading } = useMyApplications()

  const getCount = (status) =>
    status
      ? applications.filter((application) => application.status === status).length
      : applications.length

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography component="h1" variant="h4">
          Candidate dashboard
        </Typography>
        <Typography color="text.secondary">
          Track your job applications and hiring progress.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {metricConfig.map((metric) => {
          const Icon = metric.icon
          return (
            <Grid item xs={12} sm={6} lg={2.4} key={metric.label}>
              <Card sx={{ height: 1 }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Icon color="primary" />
                    <Typography color="text.secondary" variant="body2">
                      {metric.label}
                    </Typography>
                    <Typography variant="h4">{getCount(metric.status)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Recent applications
          </Typography>
          {isLoading ? <Loader minHeight={180} /> : null}
          {isError ? <ErrorMessage message="Unable to load your applications." /> : null}
          {!isLoading && !isError && applications.length === 0 ? (
            <EmptyState
              description="Applications you submit will appear here with status updates."
              title="No applications yet"
            />
          ) : null}
          {!isLoading && !isError && applications.length > 0 ? (
            <ApplicationTable applications={applications.slice(0, 5)} />
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  )
}

export default CandidateDashboard
