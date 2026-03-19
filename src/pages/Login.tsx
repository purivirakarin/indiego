import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export default function Login() {
  return (
    <Box
      sx={{
        bgcolor: 'secondary.main',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 420,
          width: '100%',
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
        }}
      >
        <Typography
          variant='h2'
          sx={{
            fontSize: 32,
            textAlign: 'center',
            color: 'text.primary',
            mb: 1,
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          Log in to access your votes, RSVPs, and curated picks.
        </Typography>
      </Paper>
    </Box>
  )
}
