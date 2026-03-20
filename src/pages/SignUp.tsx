import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import MuiLink from '@mui/material/Link'

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', data.email)
        localStorage.setItem('sessionId', data.email)
        navigate('/')
      } else {
        setError(data.error || 'Registration failed.')
      }
    } catch {
      setError('Unable to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        bgcolor: 'secondary.main',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 420,
          width: '100%',
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
        }}
      >
        <Typography
          variant='h2'
          sx={{
            fontSize: 32,
            textAlign: 'center',
            color: 'text.primary',
            mb: 1,
          }}
        >
          Join The Indiego
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          Sign up to cast votes, RSVP, and save your favourite indie screenings.
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <TextField
            label='Email Address'
            type='email'
            required
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label='Password'
            type='password'
            required
            fullWidth
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            helperText='At least 6 characters'
          />
          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={loading}
            sx={{ mt: 1, py: 1.5, fontSize: 16 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>

        <Typography
          sx={{
            textAlign: 'center',
            mt: 3,
            fontSize: 14,
            color: 'text.primary',
          }}
        >
          Already have an account?{' '}
          <MuiLink
            component={Link}
            to='/login'
            sx={{ color: 'primary.main', fontWeight: 600 }}
          >
            Log In
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  )
}
