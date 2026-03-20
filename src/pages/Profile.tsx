import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import axios from 'axios'
import RankBadge from '../components/RankBadge'

interface UserProfile {
  id: string
  email: string
  displayName?: string
  profileImage?: string
  xp: number
  rank: string
  createdAt: string
}

const ranks = [
  { name: 'Observer', minXP: 0 },
  { name: 'Storyteller', minXP: 50 },
  { name: 'Curator', minXP: 150 },
  { name: 'Visionary', minXP: 500 },
]

export default function Profile() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    axios
      .get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data)
        setDisplayName(res.data.displayName || '')
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [token, navigate])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = async () => {
      const size = 200
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0, size, size)
      const base64 = canvas.toDataURL('image/jpeg', 0.8)

      try {
        const { data } = await axios.put(
          '/api/auth/profile',
          { profileImage: base64 },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setProfile(data)
        localStorage.setItem('profileImage', base64)
        setMessage('Profile image updated!')
      } catch {
        setError('Failed to upload image.')
      }
    }
    img.src = URL.createObjectURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const { data } = await axios.put(
        '/api/auth/profile',
        { displayName },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setProfile(data)
      localStorage.setItem('displayName', displayName)
      setMessage('Profile updated!')
    } catch {
      setError('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    )
  }

  if (!profile) return null

  const currentRankIdx = ranks.findIndex((r) => r.name === profile.rank)
  const nextRank = ranks[currentRankIdx + 1]
  const currentMin = ranks[currentRankIdx]?.minXP || 0
  const nextMin = nextRank?.minXP || profile.xp
  const progress = nextRank
    ? ((profile.xp - currentMin) / (nextMin - currentMin)) * 100
    : 100

  return (
    <Box sx={{ bgcolor: 'secondary.main', minHeight: '80vh' }}>
      <Container maxWidth='sm' sx={{ py: { xs: 4, md: 8 } }}>
        <Paper
          elevation={3}
          sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, textAlign: 'center' }}
        >
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
            <Avatar
              src={profile.profileImage || undefined}
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: 48,
                mx: 'auto',
              }}
            >
              {(profile.displayName || profile.email)[0].toUpperCase()}
            </Avatar>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <CameraAltIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              hidden
              onChange={handleImageUpload}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <RankBadge rank={profile.rank} size='medium' />
          </Box>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 3 }}>
            {profile.email}
          </Typography>

          {message && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label='Display Name'
            fullWidth
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant='contained'
            fullWidth
            onClick={handleSave}
            disabled={saving}
            sx={{ py: 1.5, mb: 4 }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>

          <Box
            sx={{
              bgcolor: '#f9f6f3',
              borderRadius: 2,
              p: 3,
              textAlign: 'left',
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
              Experience & Rank
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {profile.xp} XP
              </Typography>
              {nextRank && (
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {nextRank.minXP - profile.xp} XP to {nextRank.name}
                </Typography>
              )}
            </Box>
            <LinearProgress
              variant='determinate'
              value={Math.min(progress, 100)}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: 'rgba(26,20,17,0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
                mb: 3,
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {ranks.map((r) => (
                <Box
                  key={r.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: profile.xp >= r.minXP ? 1 : 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RankBadge rank={r.name} />
                    {profile.rank === r.name && (
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: 'primary.main',
                          fontWeight: 700,
                        }}
                      >
                        CURRENT
                      </Typography>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {r.minXP} XP
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Typography
            sx={{
              mt: 3,
              fontSize: 12,
              color: 'text.secondary',
            }}
          >
            Member since{' '}
            {new Date(profile.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
