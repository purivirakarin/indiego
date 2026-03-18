import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret'

app.use(cors())
app.use(express.json())

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

// --- AUTH ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body
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
      data: { email, passwordHash, sessionId: email },
    })

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    })
    res.json({ token, email: user.email })
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
    res.json({ token, email: user.email })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
