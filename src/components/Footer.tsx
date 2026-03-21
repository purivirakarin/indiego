import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'
import TelegramIcon from '@mui/icons-material/Telegram'
import IconButton from '@mui/material/IconButton'

const linkStyle = {
  color: 'rgba(255,255,255,0.75)',
  fontSize: 13,
  mb: 1.2,
  display: 'block',
  '&:hover': { color: '#fff' },
}

export default function Footer() {
  return (
    <Box component='footer' sx={{ bgcolor: '#a0402e', color: '#fff' }}>
      <Container
        maxWidth='lg'
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 2, md: 3 },
          px: { xs: 3, md: 4 },
        }}
      >
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Typography
              variant='subtitle2'
              sx={{ fontWeight: 600, mb: 2, fontSize: 14 }}
            >
              Explore
            </Typography>
            <Link
              component={RouterLink}
              to='/screenings'
              underline='none'
              sx={linkStyle}
            >
              Screenings
            </Link>
            <Link
              component={RouterLink}
              to='/events'
              underline='none'
              sx={linkStyle}
            >
              Events
            </Link>
            <Link
              component={RouterLink}
              to='/community'
              underline='none'
              sx={linkStyle}
            >
              Community
            </Link>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Typography
              variant='subtitle2'
              sx={{ fontWeight: 600, mb: 2, fontSize: 14 }}
            >
              Support
            </Typography>
            <Link
              component={RouterLink}
              to='/contact'
              underline='none'
              sx={linkStyle}
            >
              Contact Us
            </Link>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Typography
              variant='subtitle2'
              sx={{ fontWeight: 600, mb: 2, fontSize: 14 }}
            >
              Account
            </Typography>
            <Link
              component={RouterLink}
              to='/signup'
              underline='none'
              sx={linkStyle}
            >
              Sign Up
            </Link>
            <Link
              component={RouterLink}
              to='/login'
              underline='none'
              sx={linkStyle}
            >
              Log In
            </Link>
            <Link
              component={RouterLink}
              to='/profile'
              underline='none'
              sx={linkStyle}
            >
              Profile
            </Link>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Typography
              variant='subtitle2'
              sx={{ fontWeight: 600, mb: 2, fontSize: 14 }}
            >
              Connect With Us
            </Typography>
            <IconButton
              href='#'
              sx={{
                bgcolor: 'rgba(26,20,17,0.5)',
                borderRadius: '8px',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(26,20,17,0.8)' },
              }}
            >
              <TelegramIcon fontSize='small' />
            </IconButton>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2.5,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.7)' }}>
            @2026, All Rights Reserved
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Terms of Use', 'Privacy Policy', 'Cookie Policy'].map(
              (label) => (
                <Link
                  key={label}
                  href='#'
                  underline='none'
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 12,
                    '&:hover': { color: '#fff' },
                  }}
                >
                  {label}
                </Link>
              ),
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
