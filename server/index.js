import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

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
