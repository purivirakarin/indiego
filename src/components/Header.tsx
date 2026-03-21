import { useState, useRef, useEffect } from 'react'
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
import Avatar from '@mui/material/Avatar'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import CircularProgress from '@mui/material/CircularProgress'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import axios from 'axios'

const navButtonSx = {
  color: '#fff',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1.5,
  fontFamily: "'Inter', sans-serif",
  '&:hover': { color: 'primary.main' },
}

interface SearchResult {
  events: {
    id: string
    title: string
    venue?: string
    genre?: string
  }[]
  posts: {
    id: string
    title: string
    commentCount: number
  }[]
}

export default function Header() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [searching, setSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate = useNavigate()

  const isLoggedIn = !!localStorage.getItem('token')
  const userEmail = localStorage.getItem('email')
  const profileImage = localStorage.getItem('profileImage')
  const displayName = localStorage.getItem('displayName')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('sessionId')
    localStorage.removeItem('profileImage')
    localStorage.removeItem('displayName')
    navigate('/')
    window.location.reload()
  }

  const handleSearchOpen = () => {
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  const handleSearchClose = () => {
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults(null)
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await axios.get(
          `/api/search?q=${encodeURIComponent(searchQuery)}`,
        )
        setSearchResults(data)
      } catch {
        setSearchResults(null)
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [searchQuery])

  const handleResultClick = (path: string) => {
    navigate(path)
    handleSearchClose()
  }

  const mobileLinks = [
    { label: 'Screenings', to: '/screenings' },
    { label: 'Events', to: '/events' },
    { label: 'Community', to: '/community' },
    { label: 'Contact', to: '/contact' },
    ...(isLoggedIn
      ? [{ label: 'Profile', to: '/profile' }]
      : [{ label: 'Log In', to: '/login' }]),
  ]

  return (
    <>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              component={Link}
              to='/'
              sx={{
                bgcolor: 'primary.main',
                borderRadius: '8px',
                padding: '8px 12px',
                marginRight: 2,
                minWidth: 'auto',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Indiego
              </Typography>
            </IconButton>
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Button component={Link} to='/screenings' sx={navButtonSx}>
                  Screenings
                </Button>
                <Button component={Link} to='/events' sx={navButtonSx}>
                  Events
                </Button>
                <Button component={Link} to='/community' sx={navButtonSx}>
                  Community
                </Button>
                <Button component={Link} to='/contact' sx={navButtonSx}>
                  Contact
                </Button>
              </Box>
            )}
          </Box>

          {isMobile ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  onClick={handleSearchOpen}
                  sx={{ color: '#fff' }}
                  aria-label='Search'
                >
                  <SearchIcon fontSize='small' />
                </IconButton>
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{ color: '#fff' }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
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
                  <IconButton
                    component={Link}
                    to='/profile'
                    sx={{ p: 0.5 }}
                    title='Profile'
                  >
                    <Avatar
                      src={profileImage || undefined}
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: 'primary.main',
                        fontSize: 13,
                      }}
                    >
                      {(displayName || userEmail || 'U')[0].toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 12,
                      fontWeight: 500,
                      maxWidth: 120,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {displayName || userEmail}
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
                onClick={handleSearchOpen}
                sx={{ color: '#fff' }}
                aria-label='Search'
              >
                <SearchIcon fontSize='small' />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {searchOpen && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            bgcolor: 'rgba(26,20,17,0.7)',
            display: 'flex',
            justifyContent: 'center',
            pt: { xs: 10, md: 12 },
            px: 2,
          }}
        >
          <ClickAwayListener onClickAway={handleSearchClose}>
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                }}
              >
                <TextField
                  inputRef={searchInputRef}
                  placeholder='Search screenings, events, posts...'
                  fullWidth
                  size='small'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#fff',
                      borderRadius: 2,
                    },
                  }}
                />
                <IconButton onClick={handleSearchClose} sx={{ color: '#fff' }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {searching && (
                <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                  <CircularProgress size={24} sx={{ color: 'primary.main' }} />
                </Paper>
              )}

              {searchResults &&
                !searching &&
                (searchResults.events.length > 0 ||
                  searchResults.posts.length > 0) && (
                  <Paper
                    sx={{
                      borderRadius: 2,
                      maxHeight: '60vh',
                      overflow: 'auto',
                    }}
                  >
                    {searchResults.events.length > 0 && (
                      <Box sx={{ p: 2 }}>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            color: 'text.secondary',
                            mb: 1,
                          }}
                        >
                          Screenings & Events
                        </Typography>
                        {searchResults.events.map((evt) => (
                          <Box
                            key={evt.id}
                            onClick={() =>
                              handleResultClick(`/screenings/${evt.id}`)
                            }
                            sx={{
                              py: 1,
                              px: 1,
                              borderRadius: 1,
                              cursor: 'pointer',
                              '&:hover': { bgcolor: 'rgba(26,20,17,0.05)' },
                            }}
                          >
                            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                              {evt.title}
                            </Typography>
                            <Typography
                              sx={{ fontSize: 12, color: 'text.secondary' }}
                            >
                              {evt.venue}
                              {evt.genre ? ` — ${evt.genre}` : ''}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    {searchResults.posts.length > 0 && (
                      <Box
                        sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            color: 'text.secondary',
                            mb: 1,
                          }}
                        >
                          Community Posts
                        </Typography>
                        {searchResults.posts.map((post) => (
                          <Box
                            key={post.id}
                            onClick={() =>
                              handleResultClick(`/community/${post.id}`)
                            }
                            sx={{
                              py: 1,
                              px: 1,
                              borderRadius: 1,
                              cursor: 'pointer',
                              '&:hover': { bgcolor: 'rgba(26,20,17,0.05)' },
                            }}
                          >
                            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                              {post.title}
                            </Typography>
                            <Typography
                              sx={{ fontSize: 12, color: 'text.secondary' }}
                            >
                              {post.commentCount}{' '}
                              {post.commentCount === 1 ? 'comment' : 'comments'}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                )}

              {searchResults &&
                !searching &&
                searchResults.events.length === 0 &&
                searchResults.posts.length === 0 &&
                searchQuery.trim() && (
                  <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      No results found for &ldquo;{searchQuery}&rdquo;
                    </Typography>
                  </Paper>
                )}
            </Box>
          </ClickAwayListener>
        </Box>
      )}
    </>
  )
}
