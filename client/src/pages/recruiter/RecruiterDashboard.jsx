import { Alert, Card, CardContent, Grid, Stack, Typography } from '@mui/material'

function RecruiterDashboard() {
  return (
    <Stack spacing={3}>
      <Typography component="h1" variant="h4">
        Recruiter dashboard
      </Typography>
      <Alert severity="info">
        Recruiter job management and candidate ranking screens are planned for the
        next phase. Role protection is active now.
      </Alert>
      <Grid container spacing={2}>
        {['Total Jobs', 'Active Jobs', 'Total Applications', 'Shortlisted'].map(
          (label) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">{label}</Typography>
                  <Typography variant="h4">0</Typography>
                </CardContent>
              </Card>
            </Grid>
          ),
        )}
      </Grid>
    </Stack>
  )
}

export default RecruiterDashboard
