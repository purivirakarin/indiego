import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import MuiLink from '@mui/material/Link'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const benefits = [
  {
    title: 'Earn Badges',
    desc: 'Rise from Observer \u2192 Storyteller \u2192 Curator \u2192 Visionary as you engage more.',
  },
  {
    title: 'Earn Points for Participation',
    desc: 'Attend pop-ups, comment on events / art, or submit your creative work.',
  },
  {
    title: 'Unlock Exclusive Access',
    desc: 'Be the first to RSVP for indie screenings, previews, and artist collaborations with exclusive rates.',
  },
  {
    title: 'Get Connected',
    desc: "Active members stand a chance to be spotlighted in The Indiego's online gallery.",
  },
]

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
  })
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
        if (data.displayName)
          localStorage.setItem('displayName', data.displayName)
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
      <Box sx={{ maxWidth: 480, width: '100%' }}>
        <Paper
          elevation={3}
          sx={{
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
            Sign up to cast votes, RSVP, and save your favourite indie
            screenings.
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
              label='Display Name'
              fullWidth
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              helperText='Optional — shown on your posts'
            />
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

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(26,20,17,0.1)',
          }}
        >
          {benefits.map((b) => (
            <Box
              key={b.title}
              sx={{
                display: 'flex',
                gap: 1.5,
                mb: 3,
                '&:last-child': { mb: 0 },
              }}
            >
              <CheckBoxIcon
                sx={{ color: 'primary.main', fontSize: 28, mt: 0.2 }}
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: 'text.primary',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                    mb: 0.5,
                  }}
                >
                  {b.title}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.5 }}
                >
                  {b.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  )
}
