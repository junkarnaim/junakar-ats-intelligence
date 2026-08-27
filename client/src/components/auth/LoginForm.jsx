import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isEmail } from '../../utils/validators'

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: true,
  })

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isEmail(form.email)) {
      setError('Enter a valid email address.')
      return
    }

    if (!form.password) {
      setError('Password is required.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const user = await login(form)
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard', {
        replace: true,
      })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.25}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          autoComplete="email"
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          autoComplete="current-password"
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  edge="end"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={
            <Checkbox checked={form.remember} name="remember" onChange={handleChange} />
          }
          label="Remember me"
        />
        <Button fullWidth size="large" type="submit" variant="contained">
          {submitting ? 'Logging in...' : 'Login'}
        </Button>
      </Stack>
    </Box>
  )
}

export default LoginForm
