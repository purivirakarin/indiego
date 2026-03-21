import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import EventCard, { EventData } from '../components/EventCard'

interface HostedEvent extends EventData {
  rsvpCount?: number
}

export default function Events() {
  const [events, setEvents] = useState<HostedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState('date_asc')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<HostedEvent | null>(null)
  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '' })
  const [rsvpMessage, setRsvpMessage] = useState('')
  const [rsvpError, setRsvpError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(genre && { genre }),
        ...(sort && { sort }),
      })
      const { data } = await axios.get(
        `/api/events/hosted?${params.toString()}`,
      )
      setEvents(data)
    } catch {
      console.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }, [search, genre, sort])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEvents()
  }

  const openRsvp = (event: HostedEvent) => {
    setSelectedEvent(event)
    setRsvpForm({ name: '', email: '' })
    setRsvpMessage('')
    setRsvpError('')
    setDialogOpen(true)
  }

  const handleRsvpSubmit = async () => {
    if (!rsvpForm.name || !rsvpForm.email) {
      setRsvpError('Name and email are required.')
      return
    }
    if (!selectedEvent?.id) return

    setSubmitting(true)
    setRsvpError('')
    setRsvpMessage('')

    try {
      await axios.post('/api/rsvp', {
        eventId: selectedEvent.id,
        name: rsvpForm.name,
        email: rsvpForm.email,
      })
      setRsvpMessage('RSVP confirmed! We look forward to seeing you.')
      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent.id
            ? { ...e, rsvpCount: (e.rsvpCount || 0) + 1 }
            : e,
        ),
      )
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      setRsvpError(
        error.response?.data?.error ||
          'Failed to submit RSVP. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const genres = ['Musical Discovery', 'Community']

  return (
    <Box sx={{ bgcolor: 'secondary.main', minHeight: '80vh' }}>
      <Container maxWidth='lg' sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant='h1'
          sx={{
            fontSize: { xs: 32, md: 42 },
            color: 'text.primary',
            mb: 2,
          }}
        >
          The Indiego&apos;s Events
        </Typography>
        <Typography
          sx={{
            fontSize: 16,
            mb: 5,
            maxWidth: 600,
            lineHeight: 1.6,
            color: 'text.primary',
          }}
        >
          Join us for our bespoke, carefully curated events designed to connect
          the community. From panel discussions to networking nights, experience
          culture up close.
        </Typography>

        <Box
          component='form'
          onSubmit={handleSearchSubmit}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          <TextField
            placeholder='Search events...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size='small'
            sx={{
              flex: 1,
              minWidth: 220,
              bgcolor: '#fff',
              borderRadius: 1,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type='submit'
            variant='contained'
            sx={{ minWidth: 100, py: 1 }}
          >
            Search
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 5,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <FormControl
            size='small'
            sx={{ minWidth: 180, bgcolor: '#fff', borderRadius: 1 }}
          >
            <InputLabel>Genre</InputLabel>
            <Select
              value={genre}
              label='Genre'
              onChange={(e) => setGenre(e.target.value)}
            >
              <MenuItem value=''>All Genres</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size='small'
            sx={{ minWidth: 160, bgcolor: '#fff', borderRadius: 1 }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sort}
              label='Sort By'
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value='date_asc'>Date (Earliest)</MenuItem>
              <MenuItem value='date_desc'>Date (Latest)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : events.length === 0 ? (
          <Typography sx={{ color: 'text.primary', py: 4 }}>
            No upcoming hosted events at the moment. Keep voting for what
            you&apos;d like to see next!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {events.map((evt, idx) => (
              <Grid key={evt.id || idx} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <EventCard
                    event={{ ...evt, online: evt.venue === 'Online' }}
                    darkBg={false}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <Button
                      variant='contained'
                      onClick={() => openRsvp(evt)}
                      sx={{
                        flex: 1,
                        py: 1.5,
                        fontSize: 14,
                        letterSpacing: 1,
                      }}
                    >
                      RSVP / Tickets
                    </Button>
                  </Box>
                  {evt.rsvpCount !== undefined && evt.rsvpCount > 0 && (
                    <Typography
                      variant='caption'
                      sx={{
                        mt: 1,
                        color: 'text.secondary',
                        textAlign: 'center',
                      }}
                    >
                      {evt.rsvpCount}{' '}
                      {evt.rsvpCount === 1 ? 'person' : 'people'} attending
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth='sm'
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          RSVP — {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          {rsvpMessage && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {rsvpMessage}
            </Alert>
          )}
          {rsvpError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {rsvpError}
            </Alert>
          )}
          {!rsvpMessage && (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}
            >
              <TextField
                label='Full Name'
                value={rsvpForm.name}
                onChange={(e) =>
                  setRsvpForm({ ...rsvpForm, name: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label='Email Address'
                type='email'
                value={rsvpForm.email}
                onChange={(e) =>
                  setRsvpForm({ ...rsvpForm, email: e.target.value })
                }
                fullWidth
                required
              />
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {selectedEvent?.date &&
                  new Date(selectedEvent.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                {selectedEvent?.time ? ` at ${selectedEvent.time}` : ''}
                {selectedEvent?.venue ? ` — ${selectedEvent.venue}` : ''}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              color: 'text.primary',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'none',
            }}
          >
            {rsvpMessage ? 'Close' : 'Cancel'}
          </Button>
          {!rsvpMessage && (
            <Button
              variant='contained'
              onClick={handleRsvpSubmit}
              disabled={submitting}
              sx={{ minWidth: 120 }}
            >
              {submitting ? (
                <CircularProgress size={20} sx={{ color: '#fff' }} />
              ) : (
                'Confirm RSVP'
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
