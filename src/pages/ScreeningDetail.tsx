import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PlaceIcon from '@mui/icons-material/Place'
import AccessibleIcon from '@mui/icons-material/Accessible'
import axios from 'axios'

interface EventDetail {
  id: string
  title: string
  date: string
  time?: string
  venue?: string
  image?: string
  description?: string
  galleryImages?: string
  sourceLink?: string
  genre?: string
  accessibility?: string
  isIndiegoPick: boolean
  rsvpCount?: number
}

export default function ScreeningDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    axios
      .get(`/api/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

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

  if (!event) {
    return (
      <Box sx={{ bgcolor: 'secondary.main', minHeight: '80vh' }}>
        <Container maxWidth='lg' sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant='h2' sx={{ color: 'text.primary', mb: 2 }}>
            Event Not Found
          </Typography>
          <Button component={Link} to='/screenings' variant='contained'>
            Back to Screenings
          </Button>
        </Container>
      </Box>
    )
  }

  const dateObj = new Date(event.date)
  const displayDate = isNaN(dateObj.getTime())
    ? String(event.date)
    : dateObj.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

  let gallery: string[] = []
  if (event.galleryImages) {
    try {
      gallery = JSON.parse(event.galleryImages)
    } catch {
      // ignore parse error
    }
  }

  const fallbackImage =
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&h=900&fit=crop'

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '50vh', md: '60vh' },
          minHeight: 350,
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <Box
          component='img'
          src={event.image || fallbackImage}
          alt={event.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(26,20,17,0.95) 0%, rgba(26,20,17,0.3) 50%, rgba(26,20,17,0.1) 100%)',
            zIndex: 1,
          }}
        />
        <Container
          maxWidth='lg'
          sx={{ position: 'relative', zIndex: 2, pb: 5, px: { xs: 3, md: 4 } }}
        >
          <Button
            component={Link}
            to='/screenings'
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#fff',
              fontSize: 13,
              mb: 3,
              textTransform: 'none',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Back to Screenings
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
            {event.genre && (
              <Chip
                label={event.genre}
                size='small'
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            )}
            {event.isIndiegoPick && (
              <Chip
                label='Indiego Pick'
                size='small'
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Typography
            variant='h1'
            sx={{
              fontSize: { xs: 32, md: 48 },
              color: '#fff',
              lineHeight: 1.1,
            }}
          >
            {event.title}
          </Typography>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'secondary.main' }}>
        <Container
          maxWidth='lg'
          sx={{ py: { xs: 4, md: 8 }, px: { xs: 3, md: 4 } }}
        >
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 8 }}>
              {event.description ? (
                <Typography
                  sx={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: 'text.primary',
                    mb: 4,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {event.description}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: 16, color: 'text.primary', mb: 4 }}>
                  Details for this screening will be available soon. Check back
                  for more information about showtimes and ticketing.
                </Typography>
              )}

              {gallery.length > 0 && (
                <>
                  <Typography
                    variant='h3'
                    sx={{
                      fontSize: { xs: 22, md: 28 },
                      color: 'primary.main',
                      mb: 3,
                    }}
                  >
                    Event Highlights
                  </Typography>
                  <Grid container spacing={2}>
                    {gallery.map((img, idx) => (
                      <Grid key={idx} size={{ xs: 12, sm: 4 }}>
                        <Box
                          component='img'
                          src={img}
                          alt={`${event.title} gallery ${idx + 1}`}
                          sx={{
                            width: '100%',
                            height: 220,
                            objectFit: 'cover',
                            borderRadius: 2,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 3,
                  p: 3,
                  position: { md: 'sticky' },
                  top: { md: 80 },
                }}
              >
                <Typography
                  variant='h3'
                  sx={{ fontSize: 20, color: 'text.primary', mb: 3 }}
                >
                  Event Details
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <CalendarTodayIcon
                    sx={{ color: 'primary.main', fontSize: 20 }}
                  />
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                      {displayDate}
                    </Typography>
                    {event.time && (
                      <Typography
                        sx={{ fontSize: 13, color: 'text.secondary' }}
                      >
                        {event.time}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {event.venue && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <PlaceIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography sx={{ fontSize: 14 }}>{event.venue}</Typography>
                  </Box>
                )}

                {event.accessibility && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 3,
                    }}
                  >
                    <AccessibleIcon
                      sx={{ color: 'primary.main', fontSize: 20 }}
                    />
                    <Typography sx={{ fontSize: 14 }}>
                      {event.accessibility}
                    </Typography>
                  </Box>
                )}

                {event.sourceLink && (
                  <Button
                    variant='contained'
                    fullWidth
                    href={event.sourceLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{ py: 1.5, fontSize: 15, mb: 1 }}
                  >
                    Get Tickets
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
