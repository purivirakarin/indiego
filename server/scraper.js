import axios from 'axios'
import * as cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function upsertEvents(events) {
  for (const event of events) {
    if (!event.title || !event.sourceLink || !event.date) continue
    try {
      await prisma.event.upsert({
        where: { sourceLink: event.sourceLink },
        update: {
          title: event.title,
          date: event.date,
          time: event.time || null,
          venue: event.venue || null,
          image: event.image || null,
          genre: event.genre || null,
        },
        create: {
          title: event.title,
          date: event.date,
          time: event.time || null,
          venue: event.venue || null,
          sourceLink: event.sourceLink,
          image:
            event.image ||
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&fit=crop',
          isHosted: false,
          genre: event.genre || 'Indie Film',
          isIndiegoPick: event.isIndiegoPick || false,
          accessibility: event.accessibility || null,
        },
      })
    } catch (err) {
      console.error(`Error saving event ${event.title}:`, err.message)
    }
  }
}

async function scrapeObjectifs() {
  try {
    const url = 'https://www.objectifs.com.sg/category/events/'
    const { data } = await axios.get(url, { headers: { 'User-Agent': UA } })
    const $ = cheerio.load(data)
    const events = []

    $('.post, .type-post').each((_i, el) => {
      const title = $(el).find('.entry-title').text().trim()
      const link = $(el).find('a').attr('href')
      const image = $(el).find('img').attr('src')
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      if (title && link) {
        events.push({
          title,
          sourceLink: link,
          image,
          date: tomorrow,
          venue: 'Objectifs Centre',
          genre: 'Photography & Film',
        })
      }
    })

    if (events.length > 0) {
      await upsertEvents(events)
    }
    console.log(`Objectifs: scraped ${events.length} events`)
    return events.length
  } catch (error) {
    console.error('Error scraping Objectifs:', error.message)
    return 0
  }
}

async function scrapeSFS() {
  try {
    const url = 'https://singaporefilmsociety.com/events/'
    const { data } = await axios.get(url, { headers: { 'User-Agent': UA } })
    const $ = cheerio.load(data)
    const events = []

    $('.mec-event-article').each((_i, el) => {
      const title = $(el).find('.mec-event-title a').text().trim()
      const link = $(el).find('.mec-event-title a').attr('href')
      const image = $(el).find('img').attr('src')
      if (title && link) {
        events.push({
          title,
          sourceLink: link,
          image,
          date: new Date(),
          venue: 'Golden Village Suntec',
          genre: 'Local Feature',
        })
      }
    })

    if (events.length > 0) {
      await upsertEvents(events)
    }
    console.log(`SFS: scraped ${events.length} events`)
    return events.length
  } catch (error) {
    console.error('Error scraping SFS:', error.message)
    return 0
  }
}
