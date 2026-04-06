import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import axios from 'axios'
import EventCard, { EventData } from '../components/EventCard'

const genres = [
  'Indie Film',
  'Photography & Film',
  'Documentary',
  'Local Feature',
  'Short Films',
  'Art House',
]

const accessibilityOptions = [
  'Wheelchair Accessible',
  'Closed Captions',
  'Sign Language',
]

export default function Screenings() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [accessibility, setAccessibility] = useState('')
  const [isIndiegoPick, setIsIndiegoPick] = useState(false)
  const [sort, setSort] = useState('date_asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 12

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(genre && { genre }),
        ...(accessibility && { accessibility }),
        ...(isIndiegoPick && { isIndiegoPick: 'true' }),
        ...(sort && { sort }),
      })
      const { data } = await axios.get(`/api/events?${params.toString()}`)
      setEvents(data.events)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, genre, accessibility, isIndiegoPick, sort])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchEvents()
  }

  return (
    <Box sx={{ bgcolor: 'secondary.main', minHeight: '80vh' }}>
      <Container maxWidth='lg' sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant='h1'
          sx={{
            fontSize: { xs: 32, md: 42 },
            color: 'text.primary',
            mb: 4,
          }}
        >
          All Screenings
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
            placeholder='Search titles...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size='small'
            sx={{
              flex: 1,
              minWidth: 250,
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
              onChange={(e) => {
                setGenre(e.target.value)
                setPage(1)
              }}
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
            sx={{ minWidth: 200, bgcolor: '#fff', borderRadius: 1 }}
          >
            <InputLabel>Accessibility</InputLabel>
            <Select
              value={accessibility}
              label='Accessibility'
              onChange={(e) => {
                setAccessibility(e.target.value)
                setPage(1)
              }}
            >
              <MenuItem value=''>Any Accessibility</MenuItem>
              {accessibilityOptions.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
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
              onChange={(e) => {
                setSort(e.target.value)
                setPage(1)
              }}
            >
              <MenuItem value='date_asc'>Date (Earliest)</MenuItem>
              <MenuItem value='date_desc'>Date (Latest)</MenuItem>
              <MenuItem value='title_asc'>Title (A-Z)</MenuItem>
              <MenuItem value='title_desc'>Title (Z-A)</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={isIndiegoPick}
                onChange={(e) => {
                  setIsIndiegoPick(e.target.checked)
                  setPage(1)
                }}
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': { color: 'primary.main' },
                }}
              />
            }
            label={
              <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                Indiego Picks Only
              </Typography>
            }
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : events.length === 0 ? (
          <Typography
            sx={{ textAlign: 'center', py: 8, color: 'text.primary' }}
          >
            No screenings found matching your criteria.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {events.map((evt, idx) => (
              <Grid key={evt.id || idx} size={{ xs: 6, sm: 4, md: 3 }}>
                <EventCard
                  event={{ ...evt, online: evt.venue === 'Online' }}
                  darkBg={false}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_e, value) => setPage(value)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'text.primary',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}
