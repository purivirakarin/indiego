import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Screenings() {
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
        <Typography sx={{ color: 'text.primary' }}>
          Screening listings coming soon.
        </Typography>
      </Container>
    </Box>
  )
}
