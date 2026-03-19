import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Events() {
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
        <Typography sx={{ color: 'text.primary', py: 4 }}>
          Hosted events listing coming soon.
        </Typography>
      </Container>
    </Box>
  )
}
