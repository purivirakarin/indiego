import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import { runSeed } from './seed.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret'

app.use(cors())
app.use(express.json({ limit: '5mb' }))

function authenticateToken(req, res, next) {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token required' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid token' })
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET)
    } catch {
      // ignore invalid token
    }
  }
  next()
}

async function awardXP(userId, amount) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  })
  const newRank =
    user.xp >= 500
      ? 'Visionary'
      : user.xp >= 150
        ? 'Curator'
        : user.xp >= 50
          ? 'Storyteller'
          : 'Observer'
  if (newRank !== user.rank) {
    await prisma.user.update({
      where: { id: userId },
      data: { rank: newRank },
    })
  }
  return { xp: user.xp, rank: newRank }
}

// --- AUTH ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' })
    if (password.length < 6)
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing)
      return res.status(400).json({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        sessionId: email,
        displayName: displayName || null,
      },
    })

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    })
    res.json({
      token,
      email: user.email,
      displayName: user.displayName,
      profileImage: user.profileImage,
      xp: user.xp,
      rank: user.rank,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user)
      return res.status(400).json({ error: 'Invalid email or password' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid)
      return res.status(400).json({ error: 'Invalid email or password' })

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    })
    res.json({
      token,
      email: user.email,
      displayName: user.displayName,
      profileImage: user.profileImage,
      xp: user.xp,
      rank: user.rank,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        profileImage: true,
        xp: true,
        rank: true,
        createdAt: true,
      },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, profileImage } = req.body
    const data = {}
    if (displayName !== undefined) data.displayName = displayName
    if (profileImage !== undefined) data.profileImage = profileImage

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data,
      select: {
        id: true,
        email: true,
        displayName: true,
        profileImage: true,
        xp: true,
        rank: true,
        createdAt: true,
      },
    })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// --- FORGOT / RESET PASSWORD ---

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.json({
        success: true,
        message: 'If that email is registered, a reset link has been sent.',
      })
    }

    const resetToken = crypto.randomUUID()
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    })

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`
    console.log(`\n  Password reset link: ${resetUrl}\n`)

    res.json({
      success: true,
      message: 'If that email is registered, a reset link has been sent.',
      resetToken,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword)
      return res.status(400).json({ error: 'Token and new password required' })
    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' })

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() },
      },
    })
    if (!user)
      return res.status(400).json({ error: 'Invalid or expired reset token' })

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExp: null },
    })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// --- EVENTS ---

app.get('/api/events', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      genre,
      accessibility,
      isIndiegoPick,
    } = req.query
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const where = { isHosted: false }
    if (search) where.title = { contains: search }
    if (genre) where.genre = genre
    if (accessibility) where.accessibility = { contains: accessibility }
    if (isIndiegoPick === 'true') where.isIndiegoPick = true

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.event.count({ where }),
    ])

    res.json({
      events,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

app.get('/api/events/hosted', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { isHosted: true },
      orderBy: { date: 'asc' },
      include: { rsvps: { select: { id: true } } },
    })
    res.json(
      events.map((e) => ({
        ...e,
        rsvpCount: e.rsvps.length,
        rsvps: undefined,
      })),
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch hosted events' })
  }
})

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { rsvps: { select: { id: true } } },
    })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.json({ ...event, rsvpCount: event.rsvps.length, rsvps: undefined })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})

// --- RSVP ---

app.post('/api/rsvp', async (req, res) => {
  try {
    const { eventId, name, email } = req.body
    if (!eventId || !name || !email)
      return res
        .status(400)
        .json({ error: 'Event ID, name, and email are required' })

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event || !event.isHosted)
      return res.status(404).json({ error: 'Hosted event not found' })

    const existing = await prisma.rsvp.findUnique({
      where: { email_eventId: { email, eventId } },
    })
    if (existing)
      return res
        .status(400)
        .json({ error: 'You have already RSVPd for this event' })

    await prisma.rsvp.create({ data: { eventId, name, email } })
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to submit RSVP' })
  }
})

// --- VOTES ---

app.get('/api/votes', async (req, res) => {
  try {
    const { sessionId } = req.query
    let userVoted = false

    if (sessionId) {
      const user = await prisma.user.findUnique({ where: { sessionId } })
      if (user) {
        const vote = await prisma.vote.findFirst({ where: { userId: user.id } })
        if (vote) userVoted = true
      }
    }

    const options = await prisma.voteOption.findMany({
      include: { _count: { select: { votes: true } } },
    })

    res.json({
      userVoted,
      options: options.map((opt) => ({
        id: opt.id,
        title: opt.title,
        venue: opt.venue,
        image: opt.image,
        votes: userVoted ? opt._count.votes : null,
      })),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch votes' })
  }
})

app.post('/api/votes', async (req, res) => {
  try {
    const { sessionId, voteOptionId } = req.body
    if (!sessionId || !voteOptionId)
      return res
        .status(400)
        .json({ error: 'Missing sessionId or voteOptionId' })

    let user = await prisma.user.findUnique({ where: { sessionId } })
    if (!user) {
      const hash = await bcrypt.hash(crypto.randomUUID(), 10)
      user = await prisma.user.create({
        data: {
          sessionId,
          email: `anon-${sessionId}@indiego.local`,
          passwordHash: hash,
        },
      })
    }

    const existing = await prisma.vote.findFirst({ where: { userId: user.id } })
    if (existing) return res.status(400).json({ error: 'Already voted' })

    await prisma.vote.create({ data: { userId: user.id, voteOptionId } })
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to cast vote' })
  }
})

// TODO: scraper removed — using seed data for now (tech debt)
runSeed().catch(console.error)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
