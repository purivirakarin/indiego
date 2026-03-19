import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LogoutIcon from '@mui/icons-material/Logout'

const navButtonSx = {
  color: '#fff',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1.5,
  fontFamily: "'Inter', sans-serif",
  '&:hover': { color: 'primary.main' },
}

export default function Header() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const isLoggedIn = !!localStorage.getItem('token')
  const userEmail = localStorage.getItem('email')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('sessionId')
    navigate('/')
    window.location.reload()
  }

  const mobileLinks = [
    { label: 'Screenings', to: '/screenings' },
    { label: 'Events', to: '/events' },
    ...(isLoggedIn ? [] : [{ label: 'Log In', to: '/login' }]),
  ]

  return (
    <AppBar
      position='fixed'
      sx={{
        bgcolor: 'rgba(26, 20, 17, 0.94)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, md: 5 },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            component={Link}
            to='/'
            sx={{
              bgcolor: 'primary.main',
              borderRadius: '6px',
              width: 32,
              height: 32,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <FavoriteIcon sx={{ color: '#fff', fontSize: 18 }} />
          </IconButton>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, ml: 3 }}>
              <Button component={Link} to='/screenings' sx={navButtonSx}>
                Screenings
              </Button>
              <Button component={Link} to='/events' sx={navButtonSx}>
                Events
              </Button>
            </Box>
          )}
        </Box>

        <Typography
          component={Link}
          to='/'
          variant='h6'
          sx={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            position: { md: 'absolute' },
            left: { md: '50%' },
            transform: { md: 'translateX(-50%)' },
          }}
        >
          Indiego
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: '#fff' }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor='right'
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: { bgcolor: '#1a1411', color: '#fff', width: 240 },
              }}
            >
              <List sx={{ pt: 4 }}>
                {mobileLinks.map((link) => (
                  <ListItemButton
                    key={link.to}
                    onClick={() => {
                      navigate(link.to)
                      setDrawerOpen(false)
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: 13,
                          fontWeight: 600,
                          letterSpacing: 1.5,
                          textTransform: 'uppercase',
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
                {isLoggedIn && (
                  <ListItemButton
                    onClick={() => {
                      handleLogout()
                      setDrawerOpen(false)
                    }}
                  >
                    <ListItemText
                      primary='Log Out'
                      primaryTypographyProps={{
                        sx: {
                          fontSize: 13,
                          fontWeight: 600,
                          letterSpacing: 1.5,
                          textTransform: 'uppercase',
                        },
                      }}
                    />
                  </ListItemButton>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isLoggedIn ? (
              <>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 500,
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userEmail}
                </Typography>
                <IconButton
                  onClick={handleLogout}
                  sx={{ color: '#fff' }}
                  aria-label='Log out'
                  title='Log out'
                >
                  <LogoutIcon fontSize='small' />
                </IconButton>
              </>
            ) : (
              <Button component={Link} to='/login' sx={navButtonSx}>
                Log In
              </Button>
            )}
            <IconButton
              component={Link}
              to='/screenings'
              sx={{ color: '#fff' }}
              aria-label='Search'
            >
              <SearchIcon fontSize='small' />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
