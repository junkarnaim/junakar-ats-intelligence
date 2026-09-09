import WorkOutlineIcon from '@mui/icons-material/WorkOutlineOutlined'
import { Box, Container, Divider, Grid, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0f172a', color: 'common.white', mt: 8 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Stack alignItems="center" direction="row" spacing={1.25}>
              <Box
                sx={{
                  alignItems: 'center',
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  display: 'grid',
                  height: 38,
                  placeItems: 'center',
                  width: 38,
                }}
              >
                <WorkOutlineIcon fontSize="small" />
              </Box>
              <Typography variant="h6">ATS Intelligence</Typography>
            </Stack>
            <Typography sx={{ color: '#cbd5e1', mt: 2, maxWidth: 460 }}>
              AI-ready applicant tracking screens for recruiters and candidates,
              prepared for resume parsing, match scoring, and ranking workflows.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight={700} gutterBottom>
              Platform
            </Typography>
            <Stack spacing={1}>
              <Link color="#cbd5e1" component={RouterLink} to="/jobs">
                Browse jobs
              </Link>
              <Link color="#cbd5e1" component={RouterLink} to="/register">
                Candidate signup
              </Link>
              <Link color="#cbd5e1" component={RouterLink} to="/register">
                Recruiter signup
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography fontWeight={700} gutterBottom>
              About
            </Typography>
            <Typography sx={{ color: '#cbd5e1' }}>
              AI-powered resume analysis, skill matching, and intelligent
              candidate ranking to accelerate hiring decisions.
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.16)', my: 4 }} />
        <Typography color="#94a3b8" variant="body2">
          © 2026 ATS Intelligence. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
