import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutlineOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'
import { useJob } from '../../hooks/useJobs'
import { formatDate } from '../../utils/formatDate'

function JobDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const { data: job, isError, isLoading } = useJob(id)
  const [recruiterWarningOpen, setRecruiterWarningOpen] = useState(false)

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role === 'recruiter') {
      setRecruiterWarningOpen(true)
      return
    }

    navigate(`/candidate/jobs/${job.id}/apply`)
  }

  if (isLoading) {
    return <Loader minHeight={520} />
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <ErrorMessage message="Unable to load this job." />
      </Container>
    )
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <EmptyState
          actionLabel="Back to jobs"
          description="The job may have been archived or the link is incorrect."
          title="Job not found"
        />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Button
        component={RouterLink}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        to="/jobs"
      >
        Back to jobs
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography component="h1" variant="h3">
                    {job.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {job.company} • Recruiter: {job.recruiter}
                  </Typography>
                </Box>
                <Chip color="success" label={job.status} />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {job.requiredSkills.map((skill) => (
                  <Chip color="primary" key={skill} label={skill} variant="outlined" />
                ))}
              </Stack>

              <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
                Description
              </Typography>
              <Typography color="text.secondary">{job.description}</Typography>

              <Typography variant="h5" sx={{ mt: 4 }}>
                Responsibilities
              </Typography>
              <List>
                {job.responsibilities.map((responsibility) => (
                  <ListItem disableGutters key={responsibility}>
                    <ListItemText primary={responsibility} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: { md: 'sticky' }, top: 96 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5">Job overview</Typography>
              <Stack spacing={2.25} sx={{ my: 3 }}>
                <Stack direction="row" spacing={1.25}>
                  <LocationOnOutlinedIcon color="primary" />
                  <Box>
                    <Typography fontWeight={700}>Location</Typography>
                    <Typography color="text.secondary">{job.location}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.25}>
                  <PaymentsOutlinedIcon color="primary" />
                  <Box>
                    <Typography fontWeight={700}>Salary</Typography>
                    <Typography color="text.secondary">{job.salary}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.25}>
                  <WorkOutlineIcon color="primary" />
                  <Box>
                    <Typography fontWeight={700}>Experience</Typography>
                    <Typography color="text.secondary">{job.experience}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.25}>
                  <CalendarMonthOutlinedIcon color="primary" />
                  <Box>
                    <Typography fontWeight={700}>Deadline</Typography>
                    <Typography color="text.secondary">{formatDate(job.deadline)}</Typography>
                  </Box>
                </Stack>
              </Stack>
              <Button fullWidth size="large" onClick={handleApply} variant="contained">
                Apply for this job
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        autoHideDuration={4000}
        open={recruiterWarningOpen}
        onClose={() => setRecruiterWarningOpen(false)}
      >
        <Alert severity="warning">Recruiters cannot apply for jobs.</Alert>
      </Snackbar>
    </Container>
  )
}

export default JobDetails
