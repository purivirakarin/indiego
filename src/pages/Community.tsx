import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Avatar from '@mui/material/Avatar'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import axios from 'axios'
import RankBadge from '../components/RankBadge'

interface Author {
  id: string
  email: string
  displayName?: string
  profileImage?: string
  rank: string
}

interface PostItem {
  id: string
  title: string
  body: string
  author: Author
  commentCount: number
  createdAt: string
}

export default function Community() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState('')

  const isLoggedIn = !!localStorage.getItem('token')

  const fetchPosts = async (p: number) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/posts?page=${p}&limit=10`)
      setPosts(data.posts)
      setTotalPages(data.totalPages)
    } catch {
      console.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(page)
  }, [page])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setPosting(true)
    setPostError('')

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        '/api/posts',
        { title, body },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setTitle('')
      setBody('')
      setPage(1)
      fetchPosts(1)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      setPostError(error.response?.data?.error || 'Failed to create post.')
    } finally {
      setPosting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Box sx={{ bgcolor: 'secondary.main', minHeight: '80vh' }}>
      <Container maxWidth='md' sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant='h1'
          sx={{
            fontSize: { xs: 32, md: 42 },
            color: 'text.primary',
            mb: 2,
          }}
        >
          Community Forum
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: 'text.primary',
            mb: 5,
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          Share your thoughts, discover new perspectives, and connect with
          fellow indie arts enthusiasts across Singapore.
        </Typography>

        {!isLoggedIn && (
          <Card sx={{ mb: 5, borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ fontSize: 15, color: 'text.primary', mb: 2 }}>
                Join the conversation — share your thoughts and connect with
                fellow indie enthusiasts.
              </Typography>
              <Button
                component={Link}
                to='/login'
                variant='contained'
                sx={{ textTransform: 'none' }}
              >
                Log in to post
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoggedIn && (
          <Card sx={{ mb: 5, borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant='h3'
                sx={{ fontSize: 18, mb: 2, color: 'text.primary' }}
              >
                Create a Post
              </Typography>
              {postError && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {postError}
                </Alert>
              )}
              <Box
                component='form'
                onSubmit={handleCreatePost}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <TextField
                  placeholder='Post title'
                  fullWidth
                  size='small'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <TextField
                  placeholder='Share your thoughts...'
                  fullWidth
                  multiline
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={posting}
                    sx={{ minWidth: 120 }}
                  >
                    {posting ? 'Posting...' : 'Post'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : posts.length === 0 ? (
          <Typography
            sx={{ textAlign: 'center', py: 8, color: 'text.primary' }}
          >
            No posts yet. Be the first to share something!
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {posts.map((post) => (
              <Card key={post.id} sx={{ borderRadius: 3 }}>
                <CardActionArea
                  onClick={() => navigate(`/community/${post.id}`)}
                  sx={{ p: 0 }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={post.author.profileImage || undefined}
                        sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                      >
                        {(post.author.displayName ||
                          post.author.email)[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                            {post.author.displayName || post.author.email}
                          </Typography>
                          <RankBadge rank={post.author.rank} />
                        </Box>
                        <Typography
                          sx={{ fontSize: 12, color: 'text.secondary' }}
                        >
                          {formatDate(post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant='h6'
                      sx={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: 'text.primary',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.body}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 13 }}>
                        {post.commentCount}{' '}
                        {post.commentCount === 1 ? 'comment' : 'comments'}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
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
