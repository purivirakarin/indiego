import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'

export interface EventData {
  id?: string
  title: string
  date: string | Date
  time?: string
  venue?: string
  online?: boolean
  image?: string
  sourceLink?: string
  isIndiegoPick?: boolean
  genre?: string
}

const fallbackImage =
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=600&fit=crop'

interface Props {
  event: EventData
  darkBg?: boolean
}

export default function EventCard({ event, darkBg = true }: Props) {
  const dateObj = new Date(event.date)
  const displayDate = isNaN(dateObj.getTime())
    ? String(event.date)
    : dateObj.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

  const handleClick = () => {
    if (event.sourceLink) {
      window.open(event.sourceLink, '_blank', 'noopener,noreferrer')
    }
  }

  const titleColor = darkBg ? '#fff' : '#1a1411'
  const metaColor = darkBg ? '#c4b5a5' : '#6b5e53'

  return (
    <Card
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        flex: { xs: '0 0 180px', sm: '0 0 220px' },
        cursor: event.sourceLink ? 'pointer' : 'default',
      }}
    >
      <CardActionArea
        onClick={handleClick}
        disabled={!event.sourceLink}
        sx={{ borderRadius: 2 }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component='img'
            image={event.image || fallbackImage}
            alt={event.title}
            loading='lazy'
            sx={{
              height: { xs: 220, sm: 260 },
              borderRadius: 2,
              objectFit: 'cover',
              transition: 'transform 0.4s',
              '&:hover': { transform: 'scale(1.03)' },
            }}
          />
          {event.online && (
            <Chip
              label='Online'
              size='small'
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                bgcolor: 'rgba(26,20,17,0.8)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 11,
              }}
            />
          )}
          {event.isIndiegoPick && (
            <Chip
              label='Indiego Pick'
              size='small'
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                bgcolor: 'primary.main',
                color: '#fff',
                fontWeight: 600,
                fontSize: 11,
              }}
            />
          )}
        </Box>
      </CardActionArea>
      <CardContent sx={{ px: 0, pt: 1.2, pb: 0 }}>
        <Typography
          variant='h6'
          sx={{
            fontSize: 15,
            fontWeight: 700,
            color: titleColor,
            lineHeight: 1.3,
            mb: 0.5,
          }}
        >
          {event.title}
        </Typography>
        <Typography variant='body2' sx={{ color: metaColor, fontSize: 12 }}>
          {displayDate}
          {event.time ? `, ${event.time}` : ''}
          {event.venue ? ` @ ${event.venue}` : ''}
        </Typography>
      </CardContent>
    </Card>
  )
}
