import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import MuiLink from '@mui/material/Link'

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>()
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: form.newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to reset password.')
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
          Reset Password
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          Enter your new password below.
        </Typography>

        {success ? (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity='success' sx={{ mb: 3 }}>
              Password reset successfully!
            </Alert>
            <MuiLink
              component={Link}
              to='/login'
              sx={{ color: 'primary.main', fontWeight: 600, fontSize: 16 }}
            >
              Go to Login
            </MuiLink>
          </Box>
        ) : (
          <>
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
                label='New Password'
                type='password'
                required
                fullWidth
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                helperText='At least 6 characters'
              />
              <TextField
                label='Confirm Password'
                type='password'
                required
                fullWidth
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
              <Button
                type='submit'
                variant='contained'
                fullWidth
                disabled={loading}
                sx={{ mt: 1, py: 1.5, fontSize: 16 }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  )
}
