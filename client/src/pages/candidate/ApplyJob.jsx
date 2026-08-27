import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import ResumeUpload from '../../components/applications/ResumeUpload'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loader from '../../components/common/Loader'
import { useCreateApplication } from '../../hooks/useApplications'
import { useJob } from '../../hooks/useJobs'
import { getApiErrorMessage } from '../../utils/apiError'

function ApplyJob() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: job, isError, isLoading } = useJob(id)
  const createApplication = useCreateApplication()
  const [resume, setResume] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!resume) {
      setError('Resume PDF is required.')
      return
    }

    setError('')

    try {
      await createApplication.mutateAsync({
        coverLetter,
        jobId: id,
        resume,
      })
      setSuccessOpen(true)
      navigate('/candidate/applications', { replace: true })
    } catch (apiError) {
      setError(getApiErrorMessage(apiError))
    }
  }

  if (isLoading) {
    return <Loader minHeight={420} />
  }

  if (isError || !job) {
    return <ErrorMessage message="Unable to load this job application page." />
  }

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start' }}
        to={`/jobs/${id}`}
      >
        Back to job details
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5">{job.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {job.company} • {job.location}
              </Typography>
              <Divider sx={{ my: 2.5 }} />
              <Typography color="text.secondary">{job.description}</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                {job.requiredSkills.map((skill) => (
                  <Chip key={skill} label={skill} size="small" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography component="h1" variant="h4">
                  Apply for this job
                </Typography>
                <Typography color="text.secondary">
                  Submit a PDF resume and optional cover letter. AI parsing will be
                  connected after the backend service is ready.
                </Typography>
              </Stack>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  {error ? <Alert severity="error">{error}</Alert> : null}
                  <ResumeUpload
                    disabled={createApplication.isPending}
                    file={resume}
                    onChange={setResume}
                  />
                  <TextField
                    fullWidth
                    label="Cover letter"
                    minRows={5}
                    multiline
                    placeholder="Optional note for the recruiter"
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value)}
                  />
                  <Button
                    disabled={createApplication.isPending}
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    {createApplication.isPending ? 'Submitting...' : 'Submit application'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        autoHideDuration={3000}
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success">Application submitted successfully.</Alert>
      </Snackbar>
    </Stack>
  )
}

export default ApplyJob
