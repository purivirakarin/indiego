import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import RankBadge from '../components/RankBadge'

interface Author {
  id: string
  email: string
  displayName?: string
  profileImage?: string
  rank: string
}

interface CommentItem {
  id: string
  body: string
  author: Author
  createdAt: string
}

interface PostData {
  id: string
  title: string
  body: string
  author: Author
  comments: CommentItem[]
  createdAt: string
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentBody, setCommentBody] = useState('')
  const [commenting, setCommenting] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  let currentUserId = ''
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      currentUserId = payload.userId
    } catch {
      // ignore
    }
  }

  const fetchPost = useCallback(async () => {
    if (!id) return
    try {
      const { data } = await axios.get(`/api/posts/${id}`)
      setPost(data)
    } catch {
      console.error('Failed to fetch post')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentBody.trim()) return
    setCommenting(true)
    setError('')

    try {
      await axios.post(
        `/api/posts/${id}/comments`,
        { body: commentBody },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setCommentBody('')
      fetchPost()
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { error?: string } } }
      setError(errObj.response?.data?.error || 'Failed to post comment.')
    } finally {
      setCommenting(false)
    }
  }

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate('/community')
    } catch {
      setError('Failed to delete post.')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchPost()
    } catch {
      setError('Failed to delete comment.')
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    )
  }

  if (!post) {
    return (
      <Box sx={{ bgcolor: 'secondary.main', minHeight: '80vh' }}>
        <Container maxWidth='md' sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant='h2' sx={{ color: 'text.primary', mb: 2 }}>
            Post Not Found
          </Typography>
          <Button component={Link} to='/community' variant='contained'>
            Back to Community
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: 'secondary.main', minHeight: '80vh' }}>
      <Container maxWidth='md' sx={{ py: { xs: 4, md: 8 } }}>
        <Button
          component={Link}
          to='/community'
          startIcon={<ArrowBackIcon />}
          sx={{
            color: 'text.primary',
            mb: 3,
            textTransform: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          Back to Community
        </Button>

        <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={post.author.profileImage || undefined}
                sx={{ width: 44, height: 44, bgcolor: 'primary.main' }}
              >
                {(post.author.displayName ||
                  post.author.email)[0].toUpperCase()}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                    {post.author.displayName || post.author.email}
                  </Typography>
                  <RankBadge rank={post.author.rank} />
                </Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {formatDate(post.createdAt)}
                </Typography>
              </Box>
            </Box>
            {currentUserId === post.author.id && (
              <IconButton
                onClick={handleDeletePost}
                sx={{ color: 'error.main' }}
                title='Delete post'
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Typography
            variant='h2'
            sx={{ fontSize: { xs: 24, md: 32 }, color: 'text.primary', mb: 2 }}
          >
            {post.title}
          </Typography>
          <Typography
            sx={{
              fontSize: 15,
              lineHeight: 1.8,
              color: 'text.primary',
              whiteSpace: 'pre-line',
            }}
          >
            {post.body}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant='h3'
            sx={{ fontSize: 18, color: 'text.primary', mb: 3 }}
          >
            Comments ({post.comments.length})
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {post.comments.length === 0 ? (
            <Typography sx={{ color: 'text.secondary', fontSize: 14, mb: 3 }}>
              No comments yet. Be the first to share your thoughts!
            </Typography>
          ) : (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}
            >
              {post.comments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    bgcolor: '#f9f6f3',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Avatar
                        src={comment.author.profileImage || undefined}
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'primary.main',
                          fontSize: 13,
                        }}
                      >
                        {(comment.author.displayName ||
                          comment.author.email)[0].toUpperCase()}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                        {comment.author.displayName || comment.author.email}
                      </Typography>
                      <RankBadge rank={comment.author.rank} />
                      <Typography
                        sx={{ fontSize: 11, color: 'text.secondary' }}
                      >
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                    {currentUserId === comment.author.id && (
                      <IconButton
                        onClick={() => handleDeleteComment(comment.id)}
                        size='small'
                        sx={{ color: 'error.main' }}
                        title='Delete comment'
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.6 }}>
                    {comment.body}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {isLoggedIn ? (
            <Box
              component='form'
              onSubmit={handleComment}
              sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
            >
              <TextField
                placeholder='Write a comment...'
                fullWidth
                multiline
                rows={2}
                size='small'
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                required
              />
              <Button
                type='submit'
                variant='contained'
                disabled={commenting}
                sx={{ minWidth: 100, mt: 0.5 }}
              >
                {commenting ? '...' : 'Reply'}
              </Button>
            </Box>
          ) : (
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
              <Button
                component={Link}
                to='/login'
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 600,
                  p: 0,
                  minWidth: 'auto',
                }}
              >
                Log in
              </Button>{' '}
              to join the conversation.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  )
}
