import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import JobCard from '../../components/jobs/JobCard'
import { jobs } from '../../data/mockData'

const featuredJobs = jobs.filter((job) => job.featured).slice(0, 3)

const workflowSteps = [
  {
    title: 'Recruiters publish jobs',
    description:
      'Structured job posts collect role requirements, experience, skills, salary, and deadlines.',
    icon: FactCheckOutlinedIcon,
  },
  {
    title: 'Candidates apply with resumes',
    description:
      'Candidates browse active opportunities and submit resumes through a guided application flow.',
    icon: ManageSearchOutlinedIcon,
  },
  {
    title: 'AI ranking supports review',
    description:
      'The AI backend parses resumes and returns match scores, skill gaps, and summaries.',
    icon: AutoAwesomeOutlinedIcon,
  },
]

function Home() {
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const query = formData.get('search')
    navigate(query ? `/jobs?search=${encodeURIComponent(query)}` : '/jobs')
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                color="secondary"
                label="AI-ready applicant tracking"
                sx={{ mb: 2 }}
              />
              <Typography
                component="h1"
                variant="h1"
                sx={{ fontSize: { xs: 42, md: 64 }, maxWidth: 760 }}
              >
                Hire smarter with structured jobs and candidate intelligence.
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 18, mt: 2.5, maxWidth: 680 }}
              >
                A complete ATS platform for recruiters to manage jobs and
                candidates to apply — with AI-powered resume parsing and match
                scoring.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
                <Button
                  component={RouterLink}
                  endIcon={<ArrowForwardIcon />}
                  size="large"
                  to="/jobs"
                  variant="contained"
                >
                  Browse jobs
                </Button>
                <Button component={RouterLink} size="large" to="/register" variant="outlined">
                  Create account
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: '#f8fafc',
                  border: 1,
                  borderColor: 'divider',
                  p: 3,
                }}
              >
                <Stack spacing={2}>
                  {[
                    ['94%', 'Aarav Sharma', 'Frontend Developer', 'Interview'],
                    ['88%', 'Meera Iyer', 'MERN Stack Developer', 'Applied'],
                    ['82%', 'Rohan Das', 'React Developer', 'Applied'],
                  ].map(([score, name, role, status]) => (
                    <Card key={name} sx={{ boxShadow: 'none' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Box
                            sx={{
                              alignItems: 'center',
                              bgcolor: 'primary.light',
                              borderRadius: 2,
                              color: 'primary.dark',
                              display: 'grid',
                              fontWeight: 800,
                              height: 56,
                              placeItems: 'center',
                              width: 56,
                            }}
                          >
                            {score}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography fontWeight={800}>{name}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              {role}
                            </Typography>
                          </Box>
                          <Chip label={status} size="small" />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{ p: { xs: 2, md: 3 }, mb: { xs: 5, md: 7 } }}
        >
          <Typography variant="h5" gutterBottom>
            Find your next opportunity
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Search jobs"
              name="search"
              placeholder="React, backend, MERN, remote"
            />
            <Button size="large" type="submit" variant="contained">
              Search jobs
            </Button>
          </Stack>
        </Paper>

        <Stack
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4">Featured jobs</Typography>
            <Typography color="text.secondary">
              Active roles posted by recruiters on the platform.
            </Typography>
          </Box>
          <Button component={RouterLink} to="/jobs">
            View all jobs
          </Button>
        </Stack>
        <Stack spacing={2.5}>
          {featuredJobs.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </Stack>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3 }}>
            How the ATS works
          </Typography>
          <Grid container spacing={2.5}>
            {workflowSteps.map((step) => {
              const Icon = step.icon
              return (
                <Grid item xs={12} md={4} key={step.title}>
                  <Card sx={{ height: 1 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Icon color="primary" />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        {step.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <SpeedOutlinedIcon color="secondary" />
                <Typography variant="h5" sx={{ mt: 2 }}>
                  For candidates
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Discover relevant roles, view clear requirements, and apply
                  with AI-powered resume analysis that scores your match to
                  the role.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <AutoAwesomeOutlinedIcon color="secondary" />
                <Typography variant="h5" sx={{ mt: 2 }}>
                  For recruiters
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Manage jobs, review applications, and leverage AI-assisted
                  ranking, matched skills, missing skills, and summary insights.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          sx={{
            bgcolor: '#111827',
            color: 'common.white',
            mt: 6,
            p: { xs: 3, md: 5 },
          }}
        >
          <Stack
            alignItems={{ xs: 'flex-start', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={3}
          >
            <Box>
              <Typography variant="h4">Ready to get started?</Typography>
              <Typography sx={{ color: '#cbd5e1', mt: 1 }}>
                Create an account to browse jobs, apply with your resume, or
                post positions as a recruiter.
              </Typography>
            </Box>
            <Button component={RouterLink} to="/register" variant="contained">
              Get started
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  )
}

export default Home
