import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function RecruiterLayout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Stack alignItems="center" direction="row" spacing={2}>
            <Typography variant="h6" sx={{ mr: 'auto' }}>
              Recruiter Workspace
            </Typography>
            <Typography color="text.secondary">{user?.name}</Typography>
            <Button onClick={handleLogout} variant="outlined">
              Logout
            </Button>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default RecruiterLayout
