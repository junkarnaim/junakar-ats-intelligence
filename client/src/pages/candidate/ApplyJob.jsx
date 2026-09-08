import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
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

function AiResultCard({ application }) {
  const score = application.aiScore
  const hasScore = score !== null && score !== undefined

  const scoreColor =
    score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error'

  return (
    <Card sx={{ border: 2, borderColor: 'primary.main' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h5">AI Analysis Result</Typography>
          <Typography color="text.secondary" variant="body2">
            Your resume was analysed against the job requirements.
          </Typography>
        </Stack>

        {hasScore ? (
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={700}>ATS Match Score</Typography>
              <Chip
                color={scoreColor}
                label={`${score}%`}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.875rem' }}
              />
            </Stack>
            <LinearProgress
              color={scoreColor}
              value={score}
              variant="determinate"
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="caption" color="text.secondary">
              {score >= 75
                ? 'Strong match — your profile aligns well with this role.'
                : score >= 50
                ? 'Moderate match — consider addressing the missing skills.'
                : 'Low match — significant skill gaps detected.'}
            </Typography>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            AI score not available for this application. The analysis service may have been temporarily unavailable.
          </Alert>
        )}

        <Grid container spacing={2}>
          {application.matchedSkills?.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography fontWeight={700} color="success.main">
                    Matched Skills
                  </Typography>
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {application.matchedSkills.map((skill) => (
                    <Chip
                      color="success"
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Stack>
            </Grid>
          )}

          {application.missingSkills?.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <HighlightOffIcon color="error" fontSize="small" />
                  <Typography fontWeight={700} color="error.main">
                    Missing Skills
                  </Typography>
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {application.missingSkills.map((skill) => (
                    <Chip
                      color="error"
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Stack>
            </Grid>
          )}

          {(application.matchedSkills?.length > 0 || application.missingSkills?.length > 0) && (
            <Grid item xs={12}>
              <Divider />
            </Grid>
          )}

          {application.strengths?.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.75}>
                <Typography fontWeight={700} color="primary.main">
                  ✦ Strengths
                </Typography>
                <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2 }}>
                  {application.strengths.map((s, i) => (
                    <Typography component="li" variant="body2" key={i}>
                      {s}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          )}

          {application.recommendations?.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.75}>
                <Typography fontWeight={700} color="warning.dark">
                  💡 Recommendations
                </Typography>
                <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2 }}>
                  {application.recommendations.map((r, i) => (
                    <Typography component="li" variant="body2" key={i}>
                      {r}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary" variant="body2">
              Experience Match
            </Typography>
            <Chip
              color={application.experienceMatch ? 'success' : 'default'}
              label={application.experienceMatch ? 'Yes — experience fits the role' : 'No — experience gap detected'}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Grid>

          {application.aiSummary && (
            <Grid item xs={12}>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>
                AI Summary
              </Typography>
              <Typography variant="body2">{application.aiSummary}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

function ApplyJob() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: job, isError, isLoading } = useJob(id)
  const createApplication = useCreateApplication()
  const [resume, setResume] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [submittedApplication, setSubmittedApplication] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!resume) {
      setError('Resume PDF is required.')
      return
    }

    setError('')

    try {
      const result = await createApplication.mutateAsync({
        coverLetter,
        jobId: id,
        resume,
      })
      setSubmittedApplication(result.application)
      setSuccessOpen(true)
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

  // Show AI result screen after successful submission
  if (submittedApplication) {
    return (
      <Stack spacing={3}>
        <Alert
          severity="success"
          action={
            <Button
              color="success"
              size="small"
              onClick={() => navigate('/candidate/applications', { replace: true })}
            >
              View My Applications
            </Button>
          }
        >
          Application submitted successfully!
        </Alert>

        <AiResultCard application={submittedApplication} />
      </Stack>
    )
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
                  Upload your PDF resume and an optional cover letter. Your resume
                  will be analysed by AI to generate a match score for this role.
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
                    startIcon={createApplication.isPending ? <CircularProgress size={18} color="inherit" /> : null}
                  >
                    {createApplication.isPending ? 'Analysing resume…' : 'Submit application'}
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
