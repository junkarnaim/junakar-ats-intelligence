import { Avatar, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

function CandidateProfile() {
  const { user } = useAuth()
  const skills = user?.skills?.length ? user.skills : ['React', 'JavaScript', 'REST APIs']

  return (
    <Stack spacing={3}>
      <Typography component="h1" variant="h4">
        Candidate profile
      </Typography>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack alignItems="center" direction="row" spacing={2.5}>
            <Avatar sx={{ bgcolor: 'primary.main', height: 72, width: 72 }}>
              {user?.name?.charAt(0) || 'C'}
            </Avatar>
            <Stack>
              <Typography variant="h5">{user?.name}</Typography>
              <Typography color="text.secondary">{user?.email}</Typography>
            </Stack>
          </Stack>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Phone
              </Typography>
              <Typography fontWeight={700}>{user?.phone || 'Not added yet'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Experience
              </Typography>
              <Typography fontWeight={700}>
                {user?.experience || 'Profile experience not added yet'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Education
              </Typography>
              <Typography fontWeight={700}>
                {user?.education || 'Education not added yet'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Resume
              </Typography>
              <Typography fontWeight={700}>
                {user?.resumeUrl || 'Resume will appear after upload support is expanded'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                Skills
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {skills.map((skill) => (
                  <Chip key={skill} label={skill} />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default CandidateProfile
