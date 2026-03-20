import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    proposal: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setForm({ name: '', email: '', subject: '', proposal: '' })
      } else {
        setError(data.error || 'Failed to send message.')
      }
    } catch {
      setError('Unable to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ bgcolor: 'secondary.main', minHeight: '80vh' }}>
      <Container maxWidth='lg' sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant='h1'
          sx={{
            fontSize: { xs: 32, md: 48 },
            color: 'text.primary',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Get in Touch with{' '}
          <Box component='span' sx={{ color: 'primary.main' }}>
            The Indiego
          </Box>
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            maxWidth: 700,
            mx: 'auto',
            mb: 6,
            color: 'text.primary',
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          Contribute your creation to our next curation. Join the community that
          connects culture. Reach out to The Indiego team! We&apos;re here to
          assist you with any inquiries or proposals you may have.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'rgba(26,20,17,0.12)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              minHeight: 450,
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: { xs: 3, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='h2'
                sx={{ fontSize: { xs: 28, md: 36 }, mb: 2 }}
              >
                <Box component='span' sx={{ color: 'primary.main' }}>
                  Contact
                </Box>{' '}
                Information
              </Typography>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: 14,
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 420,
                }}
              >
                Got any creatives you want to share? Get in touch with The
                Indiego! Email us your proposal and we can see how we can curate
                your ideas live! Alternatively, you can fill out our form, and
                we&apos;ll connect with you soon!
              </Typography>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
              >
                <PhoneIcon sx={{ color: 'text.primary', fontSize: 20 }} />
                <Typography sx={{ fontSize: 14, color: 'text.primary' }}>
                  +65 9078 5682
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
              >
                <EmailIcon sx={{ color: 'text.primary', fontSize: 20 }} />
                <Typography sx={{ fontSize: 14, color: 'text.primary' }}>
                  admin@theindiego.com
                </Typography>
              </Box>
            </Box>

            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{
                flex: 1,
                p: { xs: 3, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                justifyContent: 'center',
              }}
            >
              {success && (
                <Alert severity='success'>
                  Message sent! We&apos;ll get back to you soon.
                </Alert>
              )}
              {error && <Alert severity='error'>{error}</Alert>}

              <Box>
                <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 13 }}>
                  Name
                </Typography>
                <TextField
                  placeholder='Enter your name'
                  fullWidth
                  required
                  size='small'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#1a1411',
                      color: '#fff',
                      borderRadius: 2,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 13 }}>
                  Email
                </Typography>
                <TextField
                  placeholder='Enter your email'
                  type='email'
                  fullWidth
                  required
                  size='small'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#1a1411',
                      color: '#fff',
                      borderRadius: 2,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 13 }}>
                  Subject
                </Typography>
                <TextField
                  placeholder='Enter your creation title'
                  fullWidth
                  required
                  size='small'
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#1a1411',
                      color: '#fff',
                      borderRadius: 2,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 13 }}>
                  Proposal
                </Typography>
                <TextField
                  placeholder='Type here...'
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={form.proposal}
                  onChange={(e) =>
                    setForm({ ...form, proposal: e.target.value })
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#1a1411',
                      color: '#fff',
                      borderRadius: 2,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }}
                />
              </Box>
              <Button
                type='submit'
                variant='contained'
                fullWidth
                disabled={loading}
                sx={{ py: 1.5, fontSize: 16, mt: 1 }}
              >
                {loading ? 'Sending...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
