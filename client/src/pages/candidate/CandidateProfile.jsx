import { useEffect, useRef, useState } from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import {
  Alert,
  Avatar,
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
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/authService'
import { getApiErrorMessage } from '../../utils/apiError'
import Loader from '../../components/common/Loader'
import ErrorMessage from '../../components/common/ErrorMessage'

function CandidateProfile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(user || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dialogError, setDialogError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  // Resume upload state
  const resumeInputRef = useRef(null)
  const [resumeUploading, setResumeUploading] = useState(false)

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
  })

  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await authService.getCurrentUser()
        if (isMounted && response?.user) {
          setProfile(response.user)
          updateUser(response.user)
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err))
          if (user) {
            setProfile(user)
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      isMounted = false
    }
  }, [updateUser])

  const handleOpenEditDialog = () => {
    const currentSkills = Array.isArray(profile?.skills) ? profile.skills.join(', ') : ''
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      education: profile?.education || '',
      experience: profile?.experience || '',
      skills: currentSkills,
    })
    setDialogError(null)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    if (!saving) {
      setIsEditDialogOpen(false)
      setDialogError(null)
    }
  }

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const parsedSkillsPreview = formData.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setDialogError('Full name is required.')
      return
    }

    try {
      setSaving(true)
      setDialogError(null)

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        skills: parsedSkillsPreview,
      }

      const response = await authService.updateProfile(payload)

      if (response?.user) {
        setProfile(response.user)
        updateUser(response.user)
        setSuccessMessage('Profile updated successfully!')
        setIsEditDialogOpen(false)
      } else {
        setDialogError('Failed to update profile. Invalid server response.')
      }
    } catch (err) {
      setDialogError(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleResumeSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setSuccessMessage('')
      setError('Please upload a PDF file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setSuccessMessage('')
      setError('Resume must be 5 MB or smaller.')
      return
    }

    try {
      setResumeUploading(true)
      setError(null)

      const response = await authService.updateProfile({
        resumeUrl: file.name,
      })

      if (response?.user) {
        setProfile(response.user)
        updateUser(response.user)
        setSuccessMessage('Resume updated successfully!')
      }
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setResumeUploading(false)
      // Reset input so the same file can be re-selected
      if (resumeInputRef.current) {
        resumeInputRef.current.value = ''
      }
    }
  }

  const skillsList = Array.isArray(profile?.skills) ? profile.skills : []

  if (loading && !profile) {
    return <Loader minHeight={300} />
  }

  return (
    <Stack spacing={3}>
      <Stack
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Typography component="h1" variant="h4">
          Candidate profile
        </Typography>
        <Button
          onClick={handleOpenEditDialog}
          startIcon={<EditOutlinedIcon />}
          variant="contained"
        >
          Edit Profile
        </Button>
      </Stack>

      {error ? <ErrorMessage message={error} /> : null}

      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            spacing={2.5}
          >
            <Stack alignItems="center" direction="row" spacing={2.5}>
              <Avatar sx={{ bgcolor: 'primary.main', height: 72, width: 72, fontSize: '1.75rem', fontWeight: 600 }}>
                {profile?.name?.charAt(0)?.toUpperCase() || <PersonOutlineOutlinedIcon />}
              </Avatar>
              <Stack>
                <Typography variant="h5">{profile?.name || 'Candidate'}</Typography>
                <Typography color="text.secondary">{profile?.email}</Typography>
                <Typography color="primary" sx={{ textTransform: 'capitalize', mt: 0.5 }} variant="caption">
                  {profile?.role || 'candidate'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Phone
              </Typography>
              <Typography fontWeight={600}>{profile?.phone || 'Not added yet'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Experience
              </Typography>
              <Typography fontWeight={600}>
                {profile?.experience || 'Not added yet'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Education
              </Typography>
              <Typography fontWeight={600}>
                {profile?.education || 'Not added yet'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Resume
              </Typography>
              {profile?.resumeUrl ? (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                  <UploadFileOutlinedIcon color="primary" fontSize="small" />
                  <Typography fontWeight={600}>{profile.resumeUrl}</Typography>
                  <Button
                    disabled={resumeUploading}
                    onClick={() => resumeInputRef.current?.click()}
                    size="small"
                    variant="outlined"
                  >
                    Replace
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={1} sx={{ mt: 0.5 }}>
                  <Typography color="text.secondary" fontWeight={600}>
                    No resume uploaded yet
                  </Typography>
                  <Button
                    disabled={resumeUploading}
                    onClick={() => resumeInputRef.current?.click()}
                    size="small"
                    startIcon={resumeUploading ? <CircularProgress size={16} /> : <UploadFileOutlinedIcon />}
                    variant="contained"
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {resumeUploading ? 'Uploading…' : 'Upload Resume'}
                  </Button>
                </Stack>
              )}
              <input
                accept="application/pdf"
                hidden
                ref={resumeInputRef}
                type="file"
                onChange={handleResumeSelect}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                Skills
              </Typography>
              {skillsList.length > 0 ? (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {skillsList.map((skill) => (
                    <Chip key={skill} label={skill} color="primary" variant="outlined" />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No skills added yet. Click &quot;Edit Profile&quot; to add your technical skills.
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={handleCloseEditDialog}
        open={isEditDialogOpen}
      >
        <form onSubmit={handleSaveProfile}>
          <DialogTitle>Edit Candidate Profile</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {dialogError ? <Alert severity="error">{dialogError}</Alert> : null}

              <TextField
                autoFocus
                disabled={saving}
                fullWidth
                label="Full Name"
                onChange={handleInputChange('name')}
                required
                value={formData.name}
              />

              <TextField
                disabled={saving}
                fullWidth
                label="Phone Number"
                onChange={handleInputChange('phone')}
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
              />

              <TextField
                disabled={saving}
                fullWidth
                label="Education"
                onChange={handleInputChange('education')}
                placeholder="e.g. B.S. in Computer Science, Stanford University"
                value={formData.education}
              />

              <TextField
                disabled={saving}
                fullWidth
                label="Experience"
                onChange={handleInputChange('experience')}
                placeholder="e.g. 3+ years in Full Stack Web Development"
                value={formData.experience}
              />

              <Box>
                <TextField
                  disabled={saving}
                  fullWidth
                  helperText="Separate multiple skills with commas (e.g. React, Node.js, Python, MongoDB)"
                  label="Skills"
                  onChange={handleInputChange('skills')}
                  placeholder="React, Node.js, MongoDB, TypeScript"
                  value={formData.skills}
                />
                {parsedSkillsPreview.length > 0 && (
                  <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 1.5 }}>
                    {parsedSkillsPreview.map((skill, index) => (
                      <Chip key={`${skill}-${index}`} label={skill} size="small" />
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button disabled={saving} onClick={handleCloseEditDialog} variant="outlined">
              Cancel
            </Button>
            <Button
              disabled={saving}
              startIcon={saving ? <CircularProgress size={18} /> : null}
              type="submit"
              variant="contained"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        autoHideDuration={4000}
        message={successMessage}
        onClose={() => setSuccessMessage('')}
        open={Boolean(successMessage)}
      />
    </Stack>
  )
}

export default CandidateProfile
