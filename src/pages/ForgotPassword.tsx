import { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import MuiLink from '@mui/material/Link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [resetLink, setResetLink] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setResetLink('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message)
        if (data.resetToken) {
          setResetLink(`/reset-password/${data.resetToken}`)
        }
      } else {
        setError(data.error || 'Something went wrong.')
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
          Forgot Password
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </Typography>

        {message && (
          <Alert severity='success' sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {resetLink && (
          <Alert severity='info' sx={{ mb: 2 }}>
            Dev mode:{' '}
            <MuiLink
              component={Link}
              to={resetLink}
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              Click here to reset password
            </MuiLink>
          </Alert>
        )}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={loading}
            sx={{ mt: 1, py: 1.5, fontSize: 16 }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
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
          Remember your password?{' '}
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
