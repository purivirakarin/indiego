import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import MuiLink from '@mui/material/Link'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', data.email)
        localStorage.setItem('sessionId', data.email)
        if (data.profileImage)
          localStorage.setItem('profileImage', data.profileImage)
        if (data.displayName)
          localStorage.setItem('displayName', data.displayName)
        navigate('/')
      } else {
        setError(data.error || 'Login failed.')
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
          Welcome Back
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          Log in to access your votes, RSVPs, and curated picks.
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
          />
          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={loading}
            sx={{ mt: 1, py: 1.5, fontSize: 16 }}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'right', mt: 1 }}>
          <MuiLink
            component={Link}
            to='/forgot-password'
            sx={{ color: 'text.secondary', fontSize: 13 }}
          >
            Forgot Password?
          </MuiLink>
        </Box>

        <Typography
          sx={{
            textAlign: 'center',
            mt: 2,
            fontSize: 14,
            color: 'text.primary',
          }}
        >
          Don&apos;t have an account?{' '}
          <MuiLink
            component={Link}
            to='/signup'
            sx={{ color: 'primary.main', fontWeight: 600 }}
          >
            Sign Up
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  )
}
