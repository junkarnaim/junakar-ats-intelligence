import MenuIcon from '@mui/icons-material/Menu'
import WorkOutlineIcon from '@mui/icons-material/WorkOutlineOutlined'
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Jobs', path: '/jobs' },
]

function NavButton({ item, onClick }) {
  return (
    <Button
      component={NavLink}
      to={item.path}
      onClick={onClick}
      sx={{
        color: 'text.primary',
        '&.active': {
          bgcolor: 'primary.light',
          color: 'primary.dark',
        },
      }}
    >
      {item.label}
    </Button>
  )
}

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const dashboardPath =
    user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    navigate('/', { replace: true })
  }

  return (
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
            component={NavLink}
            direction="row"
            spacing={1.25}
            to="/"
            sx={{ color: 'text.primary', mr: 'auto' }}
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
              <WorkOutlineIcon fontSize="small" />
            </Box>
            <Typography variant="h6">ATS Intelligence</Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            {navItems.map((item) => (
              <NavButton item={item} key={item.path} />
            ))}
          </Stack>

          {isAuthenticated ? (
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Button component={NavLink} to={dashboardPath}>
                Dashboard
              </Button>
              <Button
                component={NavLink}
                to={user?.role === 'candidate' ? '/candidate/profile' : dashboardPath}
              >
                Profile
              </Button>
              <Button onClick={handleLogout} variant="outlined">
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Button component={NavLink} to="/login" variant="text">
                Login
              </Button>
              <Button component={NavLink} to="/register" variant="contained">
                Create account
              </Button>
            </Stack>
          )}

          <IconButton
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        PaperProps={{ sx: { p: 2, width: 280 } }}
      >
        <Stack spacing={1}>
          {navItems.map((item) => (
            <NavButton
              item={item}
              key={item.path}
              onClick={() => setMobileOpen(false)}
            />
          ))}
          {isAuthenticated ? (
            <>
              <Button
                component={NavLink}
                to={dashboardPath}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Button>
              <Button
                component={NavLink}
                to={user?.role === 'candidate' ? '/candidate/profile' : dashboardPath}
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Button>
              <Button onClick={handleLogout} variant="outlined">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={NavLink} to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Button>
              <Button
                component={NavLink}
                to="/register"
                variant="contained"
                onClick={() => setMobileOpen(false)}
              >
                Create account
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </AppBar>
  )
}

export default Navbar
