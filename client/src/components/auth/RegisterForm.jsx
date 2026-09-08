import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isEmail, isStrongEnoughPassword } from '../../utils/validators'
import RoleSelector from './RoleSelector'

function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }

    if (!isEmail(form.email)) {
      setError('Enter a valid email address.')
      return
    }

    if (!isStrongEnoughPassword(form.password)) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role === 'recruiter' ? 'recruiter' : 'candidate',
      }
      const user = await register(payload)
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard', {
        replace: true,
      })
    } catch (registerError) {
      setError(registerError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.25}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          autoComplete="name"
          fullWidth
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
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
          autoComplete="new-password"
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
        <TextField
          autoComplete="new-password"
          fullWidth
          label="Confirm password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <RoleSelector
          value={form.role}
          onChange={(role) => setForm((current) => ({ ...current, role }))}
        />
        <Button disabled={submitting} fullWidth size="large" type="submit" variant="contained">
          {submitting ? 'Creating account...' : 'Create account'}
        </Button>
      </Stack>
    </Box>
  )
}

export default RegisterForm
