import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function Home() {
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
    </>
  )
}
