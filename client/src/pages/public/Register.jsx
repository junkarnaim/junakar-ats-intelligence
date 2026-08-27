import { Card, CardContent, Container, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import RegisterForm from '../../components/auth/RegisterForm'

function Register() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography component="h1" variant="h4">
              Create account
            </Typography>
            <Typography color="text.secondary">
              Choose candidate or recruiter access. Real authentication will be
              connected through AuthContext and the service layer later.
            </Typography>
          </Stack>
          <RegisterForm />
          <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Register
