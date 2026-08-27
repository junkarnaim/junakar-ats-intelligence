import { Card, CardContent, Container, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'

function Login() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography component="h1" variant="h4">
              Login
            </Typography>
            <Typography color="text.secondary">
              Access your ATS workspace when backend authentication is connected.
            </Typography>
          </Stack>
          <LoginForm />
          <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
            New to ATS Intelligence?{' '}
            <Link component={RouterLink} to="/register">
              Create an account
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Login
