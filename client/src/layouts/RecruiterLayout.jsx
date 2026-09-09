import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', path: '/recruiter/dashboard' },
  { label: 'My Jobs', path: '/recruiter/jobs' },
  { label: 'Applications', path: '/recruiter/applications' },
]

function RecruiterLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  const currentTab = navItems.findIndex((item) => location.pathname.startsWith(item.path))
  const tabValue = currentTab >= 0 ? currentTab : 0

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="sticky"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2, minHeight: 72 }}>
            <Stack
              alignItems="center"
              component={RouterLink}
              direction="row"
              spacing={1.25}
              to="/recruiter/dashboard"
              sx={{ color: 'text.primary', mr: 'auto', textDecoration: 'none' }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  color: 'common.white',
                  display: 'grid',
                  height: 38,
                  placeItems: 'center',
                  width: 38,
                }}
              >
                <WorkOutlineOutlinedIcon fontSize="small" />
              </Box>
              <Typography variant="h6">ATS Intelligence</Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
            <Button id="recruiter-logout-btn" onClick={handleLogout} type="button" variant="outlined">
              Logout
            </Button>
          </Toolbar>
        </Container>
        <Container maxWidth="lg">
          <Tabs
            value={tabValue}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 42 }}
          >
            {navItems.map((item) => (
              <Tab
                component={RouterLink}
                key={item.path}
                label={item.label}
                to={item.path}
                sx={{ minHeight: 42, textTransform: 'none', fontWeight: 600 }}
              />
            ))}
          </Tabs>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default RecruiterLayout
