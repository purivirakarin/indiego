import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import axios from 'axios'
import EventCard, { EventData } from '../components/EventCard'

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [events, setEvents] = useState<EventData[]>([])
  const [pollOptions, setPollOptions] = useState<
    {
      id: string
      title: string
      venue: string
      image: string | null
      votes: number | null
    }[]
  >([])
  const [userVoted, setUserVoted] = useState(false)

  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  useEffect(() => {
    axios
      .get('/api/events?limit=6')
      .then((res) => setEvents(res.data.events))
      .catch(console.error)

    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    axios
      .get('/api/votes', { headers })
      .then((res) => {
        setUserVoted(res.data.userVoted)
        setPollOptions(res.data.options)
      })
      .catch(console.error)
  }, [token])

  const handleVote = async (voteOptionId: string) => {
    if (userVoted || !isLoggedIn) return
    try {
      await axios.post(
        '/api/votes',
        { voteOptionId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const res = await axios.get('/api/votes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserVoted(res.data.userVoted)
      setPollOptions(res.data.options)
    } catch (err) {
      console.error(err)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({
      left: direction === 'right' ? 260 : -260,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '70vh', md: '100vh' },
          minHeight: 500,
          maxHeight: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          component='img'
          src='https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1600&h=900&fit=crop'
          alt='Colourful Singapore shophouses'
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
              'linear-gradient(to bottom, rgba(26,20,17,0.3), rgba(26,20,17,0.5) 50%, rgba(26,20,17,0.85))',
            zIndex: 1,
          }}
        />
        <Container
          maxWidth='md'
          sx={{ position: 'relative', zIndex: 2, px: { xs: 3, md: 4 } }}
        >
          <Typography
            variant='h1'
            sx={{
              fontSize: { xs: 28, sm: 36, md: 48 },
              fontStyle: 'italic',
              lineHeight: 1.15,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 2,
            }}
          >
            Emily of Emerald Hill,
            <br />
            Where It Belongs
          </Typography>
          <Typography
            sx={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', mb: 1 }}
          >
            The house is alive again. Don&apos;t just watch — step inside.
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', mb: 4 }}
          >
            30 January, 2026 | 8PM @ 37 Emerald Hill
          </Typography>
          <Button
            variant='contained'
            size='large'
            sx={{
              px: 7,
              py: 2,
              fontSize: 18,
              borderRadius: '40px',
              letterSpacing: 2,
            }}
          >
            Tickets
          </Button>
        </Container>
      </Box>

      {/* Voting */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'text.primary' }}>
        <Container
          maxWidth='lg'
          sx={{
            py: { xs: 5, md: 9 },
            px: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 4, md: 10 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='h2'
              sx={{
                fontSize: { xs: 28, md: 42 },
                lineHeight: 1.1,
                mb: 3,
              }}
            >
              <Box
                component='span'
                sx={{
                  display: 'block',
                  color: 'primary.main',
                  fontStyle: 'italic',
                }}
              >
                You Curate,
              </Box>
              <Box component='span' sx={{ display: 'block' }}>
                We Create
              </Box>
            </Typography>
            <Typography
              sx={{ fontSize: 15, lineHeight: 1.7, color: '#3d3029', mb: 1.5 }}
            >
              This month, we&apos;re choosing between two stories of Singapore,
              told through different lenses.
            </Typography>
            <Typography
              sx={{ fontSize: 15, lineHeight: 1.7, color: '#3d3029' }}
            >
              Your vote decides what unfolds next.
              <br />
              Join us in curating the next chapter.
            </Typography>
            {!userVoted && isLoggedIn && (
              <Typography sx={{ mt: 1.5, fontWeight: 'bold', fontSize: 15 }}>
                Vote to see the results!
              </Typography>
            )}
            {!isLoggedIn && (
              <Button
                component={Link}
                to='/login'
                variant='contained'
                sx={{ mt: 2, textTransform: 'none' }}
              >
                Log in to vote
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            {pollOptions.map((opt, i) => (
              <Box
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                sx={{
                  width: { xs: 140, md: 180 },
                  height: {
                    xs: i === 0 ? 220 : 180,
                    md: i === 0 ? 280 : 230,
                  },
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  background:
                    'linear-gradient(180deg, #b53a2a 0%, #d4887b 100%)',
                  cursor: userVoted || !isLoggedIn ? 'default' : 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform:
                      userVoted || !isLoggedIn ? 'none' : 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    fontSize: 13,
                    lineHeight: 1.4,
                    color: '#1a1411',
                    background:
                      'linear-gradient(to top, rgba(213,136,123,0.9), transparent)',
                  }}
                >
                  {opt.title}
                  <br />@ {opt.venue}
                  {userVoted && opt.votes !== null && (
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#fff',
                      }}
                    >
                      {opt.votes} Votes
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* What's On */}
      <Container
        maxWidth='lg'
        sx={{ py: { xs: 5, md: 9 }, px: { xs: 3, md: 4 } }}
      >
        <Typography
          variant='h2'
          sx={{
            textAlign: 'center',
            fontSize: { xs: 28, md: 36 },
            textTransform: 'uppercase',
            letterSpacing: 2,
            color: '#fff',
            mb: 1.5,
          }}
        >
          What&apos;s On
        </Typography>
        <Typography
          sx={{
            color: 'primary.main',
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontStyle: 'italic',
            fontWeight: 600,
            mb: 3,
          }}
        >
          Happening This Week
        </Typography>

        <Box sx={{ position: 'relative', mx: -1 }}>
          <IconButton
            onClick={() => scroll('left')}
            aria-label='Scroll left'
            sx={{
              position: 'absolute',
              left: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: 'rgba(26,20,17,0.85)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(26,20,17,1)' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Box
            ref={carouselRef}
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              px: 1,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {events.length > 0 ? (
              events.map((event, idx) => (
                <EventCard key={event.id || idx} event={event} />
              ))
            ) : (
              <Typography sx={{ color: '#fff', py: 4 }}>
                Loading events...
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={() => scroll('right')}
            aria-label='Scroll right'
            sx={{
              position: 'absolute',
              right: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: 'rgba(26,20,17,0.85)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(26,20,17,1)' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'right', pt: 2 }}>
          <Button
            component={Link}
            to='/screenings'
            sx={{
              color: 'text.secondary',
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              textTransform: 'none',
              '&:hover': { color: '#fff' },
            }}
          >
            View All
          </Button>
        </Box>
      </Container>
    </>
  )
}
