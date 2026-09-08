import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
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
import { useState } from 'react'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loader from '../../components/common/Loader'
import { useAllApplications, useUpdateApplicationStatus } from '../../hooks/useApplications'
import { useJobs } from '../../hooks/useJobs'
import { useAuth } from '../../hooks/useAuth'
import { APPLICATION_STATUSES } from '../../utils/constants'
import { formatDate } from '../../utils/formatDate'

function AiScoreCell({ score }) {
  if (score === null || score === undefined) {
    return <Typography color="text.disabled" variant="body2">—</Typography>
  }

  const color = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error'

  return (
    <Stack spacing={0.75} sx={{ minWidth: 80 }}>
      <Chip color={color} label={`${score}%`} size="small" />
      <LinearProgress
        color={color}
        value={score}
        variant="determinate"
        sx={{ height: 4, borderRadius: 2 }}
      />
    </Stack>
  )
}

function SkillsCell({ matched, missing }) {
  return (
    <Stack spacing={0.75}>
      {matched?.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          {matched.map((s) => (
            <Chip
              color="success"
              icon={<CheckCircleIcon />}
              key={s}
              label={s}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      )}
      {missing?.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          {missing.map((s) => (
            <Chip
              color="error"
              icon={<HighlightOffIcon />}
              key={s}
              label={s}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      )}
      {!matched?.length && !missing?.length && (
        <Typography color="text.disabled" variant="body2">—</Typography>
      )}
    </Stack>
  )
}

function StatusSelect({ applicationId, currentStatus }) {
  const updateStatus = useUpdateApplicationStatus()
  const [status, setStatus] = useState(currentStatus)

  const handleChange = async (e) => {
    const newStatus = e.target.value
    setStatus(newStatus)

    try {
      await updateStatus.mutateAsync({ id: applicationId, status: newStatus })
    } catch {
      // Revert on error
      setStatus(currentStatus)
    }
  }

  return (
    <FormControl size="small" sx={{ minWidth: 130 }}>
      <Select value={status} onChange={handleChange} disabled={updateStatus.isPending}>
        {APPLICATION_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

function RecruiterApplications() {
  const { user } = useAuth()
  const { data: allJobs = [] } = useJobs({})
  const [selectedJobId, setSelectedJobId] = useState('')

  // Filter jobs to only this recruiter's
  const myJobs = allJobs.filter(
    (job) =>
      String(job.recruiterId) === String(user?.id) ||
      String(job.recruiterId) === String(user?._id),
  )

  const params = selectedJobId ? { jobId: selectedJobId } : {}
  const { data: applications = [], isError, isLoading } = useAllApplications(params)

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography component="h1" variant="h4">
          Applications
        </Typography>
        <Typography color="text.secondary">
          Review candidate applications, AI scores, and update their status.
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 340, mb: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="job-filter-label">Filter by job</InputLabel>
              <Select
                label="Filter by job"
                labelId="job-filter-label"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                <MenuItem value="">All jobs</MenuItem>
                {myJobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {isLoading ? <Loader minHeight={220} /> : null}
          {isError ? <ErrorMessage message="Unable to load applications." /> : null}

          {!isLoading && !isError && applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Applications will appear here once candidates apply to your jobs."
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
                    <TableCell>AI Score</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>Exp. Match</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow hover key={application.id}>
                      <TableCell>
                        <Typography fontWeight={700}>
                          {application.candidate?.name || 'Unknown'}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {application.candidate?.email || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>
                          {application.job?.title || 'Archived job'}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {application.job?.location || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(application.appliedAt)}</TableCell>
                      <TableCell>
                        <AiScoreCell score={application.aiScore} />
                      </TableCell>
                      <TableCell>
                        <SkillsCell
                          matched={application.matchedSkills}
                          missing={application.missingSkills}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={application.experienceMatch ? 'Experience matches' : 'Experience does not match'}>
                          <Chip
                            color={application.experienceMatch ? 'success' : 'default'}
                            label={application.experienceMatch ? 'Yes' : 'No'}
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <StatusSelect
                          applicationId={application.id}
                          currentStatus={application.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </CardContent>
      </Card>

      {!isLoading && !isError && applications.length > 0 && (
        <Alert severity="info">
          AI summary is available on each application when the AI service was active at the time of submission.
        </Alert>
      )}
    </Stack>
  )
}

export default RecruiterApplications
