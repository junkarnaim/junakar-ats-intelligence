import { Card, CardContent, Stack, Typography } from '@mui/material'
import ApplicationTable from '../../components/applications/ApplicationTable'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loader from '../../components/common/Loader'
import { useMyApplications } from '../../hooks/useApplications'

function MyApplications() {
  const { data: applications = [], isError, isLoading } = useMyApplications()

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography component="h1" variant="h4">
          My applications
        </Typography>
        <Typography color="text.secondary">
          Review every submitted application and its current status.
        </Typography>
      </Stack>
      <Card>
        <CardContent>
          {isLoading ? <Loader minHeight={220} /> : null}
          {isError ? <ErrorMessage message="Unable to load your applications." /> : null}
          {!isLoading && !isError && applications.length === 0 ? (
            <EmptyState
              description="Browse jobs and apply with your resume to start tracking progress."
              title="No applications found"
            />
          ) : null}
          {!isLoading && !isError && applications.length > 0 ? (
            <ApplicationTable applications={applications} />
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  )
}

export default MyApplications
