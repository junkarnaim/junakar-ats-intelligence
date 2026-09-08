import AddIcon from '@mui/icons-material/Add'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loader from '../../components/common/Loader'
import { useCreateJob, useJobs, useUpdateJob } from '../../hooks/useJobs'
import { useAuth } from '../../hooks/useAuth'
import { getApiErrorMessage } from '../../utils/apiError'
import { formatDate } from '../../utils/formatDate'

const emptyForm = {
  title: '',
  description: '',
  skills: '',
  experience: '',
  location: '',
  deadline: '',
}

function CreateJobDialog({ open, onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const createJob = useCreateJob()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title || !form.description || !form.experience || !form.location) {
      setError('Title, description, experience, and location are required.')
      return
    }

    setError('')

    try {
      await createJob.mutateAsync({
        ...form,
        skills: form.skills
          ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        deadline: form.deadline || undefined,
      })
      setForm(emptyForm)
      onCreate()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Post a new job</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2.5}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              fullWidth
              label="Job title"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              minRows={3}
              name="description"
              required
              value={form.description}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              helperText="Comma-separated (e.g. React, Node.js, MongoDB)"
              label="Required skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Experience required"
              name="experience"
              placeholder="e.g. 1-3 years"
              required
              value={form.experience}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              required
              value={form.location}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Application deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            disabled={createJob.isPending}
            startIcon={createJob.isPending ? <CircularProgress size={16} /> : null}
            type="submit"
            variant="contained"
          >
            {createJob.isPending ? 'Posting…' : 'Post job'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

function RecruiterJobs() {
  const { user } = useAuth()
  const { data: allJobs = [], isError, isLoading } = useJobs({})
  const updateJob = useUpdateJob()
  const [dialogOpen, setDialogOpen] = useState(false)

  // Filter to only this recruiter's jobs
  const myJobs = allJobs.filter(
    (job) =>
      String(job.recruiterId) === String(user?.id) ||
      String(job.recruiterId) === String(user?._id),
  )

  const handleToggleStatus = async (job) => {
    const newStatus = job.rawStatus === 'active' ? 'archived' : 'active'
    await updateJob.mutateAsync({ id: job.id, status: newStatus })
  }

  return (
    <Stack spacing={3}>
      <Stack alignItems="flex-start" direction="row" justifyContent="space-between">
        <Stack spacing={0.5}>
          <Typography component="h1" variant="h4">
            My jobs
          </Typography>
          <Typography color="text.secondary">
            Manage your job postings and archive roles that are no longer active.
          </Typography>
        </Stack>
        <Button
          onClick={() => setDialogOpen(true)}
          startIcon={<AddIcon />}
          variant="contained"
        >
          Post job
        </Button>
      </Stack>

      {isLoading ? <Loader minHeight={220} /> : null}
      {isError ? <ErrorMessage message="Unable to load your jobs." /> : null}

      {!isLoading && !isError && myJobs.length === 0 ? (
        <EmptyState
          title="No jobs posted yet"
          description='Click "Post job" to create your first job listing.'
          actionLabel="Post a job"
          onAction={() => setDialogOpen(true)}
        />
      ) : null}

      {!isLoading && !isError && myJobs.length > 0 ? (
        <Grid container spacing={2.5}>
          {myJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    alignItems={{ sm: 'center' }}
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box>
                      <Stack alignItems="center" direction="row" spacing={1.5}>
                        <Typography variant="h6">{job.title}</Typography>
                        <Chip
                          color={job.rawStatus === 'active' ? 'success' : 'default'}
                          label={job.status}
                          size="small"
                        />
                      </Stack>
                      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.25 }}>
                        {job.location} • {job.experience}
                        {job.deadline
                          ? ` • Deadline: ${formatDate(job.deadline)}`
                          : ''}
                      </Typography>
                    </Box>
                    <Tooltip
                      title={job.rawStatus === 'active' ? 'Archive this job' : 'Reactivate this job'}
                    >
                      <IconButton
                        color={job.rawStatus === 'active' ? 'default' : 'primary'}
                        onClick={() => handleToggleStatus(job)}
                        size="small"
                      >
                        {job.rawStatus === 'active' ? (
                          <ArchiveOutlinedIcon />
                        ) : (
                          <UnarchiveOutlinedIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography color="text.secondary" variant="body2">
                    {job.description}
                  </Typography>

                  {job.requiredSkills?.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 2 }}>
                      {job.requiredSkills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}

      <CreateJobDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={() => setDialogOpen(false)}
      />
    </Stack>
  )
}

export default RecruiterJobs
