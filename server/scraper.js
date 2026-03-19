import cron from 'node-cron'
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

async function scrapeThirdParties() {
  try {
    const url = 'https://peatix.com/search?q=indie+film+singapore'
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    const $ = cheerio.load(data)
    const events = []

    $('.event-list__item').each((_i, el) => {
      const title = $(el).find('.event-list__title').text().trim()
      const link = $(el).find('a').attr('href')
      const image = $(el).find('.event-list__image img').attr('src')
      if (title && link) {
        events.push({
          title,
          sourceLink: link,
          image,
          date: new Date(),
          venue: 'Singapore',
          genre: 'Short Films',
        })
      }
    })

    if (events.length > 0) {
      await upsertEvents(events)
    }
    console.log(`Peatix: scraped ${events.length} events`)
    return events.length
  } catch (error) {
    console.error('Error scraping Peatix:', error.message)
    return 0
  }
}

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

async function seedScreenings() {
  const count = await prisma.event.count({ where: { isHosted: false } })
  if (count > 0) return

  const screenings = [
    {
      title: 'Shirkers: A Stolen Vision',
      date: daysFromNow(2),
      time: '7:00 PM',
      venue: 'The Projector',
      sourceLink: 'https://theprojector.sg/films/shirkers',
      image:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop',
      genre: 'Documentary',
      isIndiegoPick: true,
      accessibility: 'Closed Captions',
    },
    {
      title: 'A Yellow Bird',
      date: daysFromNow(3),
      time: '8:30 PM',
      venue: 'Golden Village Suntec',
      sourceLink: 'https://singaporefilmsociety.com/a-yellow-bird',
      image:
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&fit=crop',
      genre: 'Local Feature',
      isIndiegoPick: true,
    },
    {
      title: 'Ilo Ilo',
      date: daysFromNow(4),
      time: '6:00 PM',
      venue: 'Oldham Theatre',
      sourceLink: 'https://www.objectifs.com.sg/ilo-ilo-screening',
      image:
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&fit=crop',
      genre: 'Local Feature',
      isIndiegoPick: true,
      accessibility: 'Wheelchair Accessible',
    },
    {
      title: 'Pop Aye',
      date: daysFromNow(5),
      time: '9:00 PM',
      venue: 'The Projector',
      sourceLink: 'https://theprojector.sg/films/pop-aye',
      image:
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&fit=crop',
      genre: 'Indie Film',
    },
    {
      title: 'Apprentice',
      date: daysFromNow(5),
      time: '7:30 PM',
      venue: 'Shaw Theatres Lido',
      sourceLink: 'https://singaporefilmsociety.com/apprentice',
      image:
        'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&fit=crop',
      genre: 'Art House',
      accessibility: 'Closed Captions',
    },
    {
      title: 'Sandcastle',
      date: daysFromNow(6),
      time: '4:00 PM',
      venue: 'National Gallery Singapore',
      sourceLink: 'https://www.nationalgallery.sg/sandcastle',
      image:
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&fit=crop',
      genre: 'Documentary',
    },
    {
      title: 'Singapore Dreaming',
      date: daysFromNow(7),
      time: '8:00 PM',
      venue: 'Golden Village Suntec',
      sourceLink: 'https://singaporefilmsociety.com/sg-dreaming',
      image:
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&fit=crop',
      genre: 'Local Feature',
    },
    {
      title: 'Wet Season',
      date: daysFromNow(8),
      time: '7:00 PM',
      venue: 'The Projector',
      sourceLink: 'https://theprojector.sg/films/wet-season',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop',
      genre: 'Art House',
      isIndiegoPick: true,
    },
    {
      title: 'Camera Japan Film Night',
      date: daysFromNow(9),
      time: '7:30 PM',
      venue: 'Objectifs Centre',
      sourceLink: 'https://www.objectifs.com.sg/camera-japan',
      image:
        'https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=800&fit=crop',
      genre: 'Photography & Film',
    },
    {
      title: 'Southeast Asian Short Films',
      date: daysFromNow(10),
      time: '6:30 PM',
      venue: 'Oldham Theatre',
      sourceLink: 'https://www.objectifs.com.sg/sea-shorts',
      image:
        'https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=800&fit=crop',
      genre: 'Short Films',
      accessibility: 'Sign Language',
    },
    {
      title: '12 Storeys',
      date: daysFromNow(11),
      time: '8:00 PM',
      venue: 'Shaw Theatres Lido',
      sourceLink: 'https://singaporefilmsociety.com/12-storeys',
      image:
        'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&fit=crop',
      genre: 'Local Feature',
    },
    {
      title: 'Forever Fever',
      date: daysFromNow(12),
      time: '9:00 PM',
      venue: 'The Projector',
      sourceLink: 'https://theprojector.sg/films/forever-fever',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop',
      genre: 'Indie Film',
    },
    {
      title: 'Invisible Stories Screening',
      date: daysFromNow(13),
      time: '5:00 PM',
      venue: 'National Gallery Singapore',
      sourceLink: 'https://www.nationalgallery.sg/invisible-stories',
      image:
        'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&fit=crop',
      genre: 'Documentary',
      accessibility: 'Wheelchair Accessible',
    },
    {
      title: 'The Songs We Sang',
      date: daysFromNow(14),
      time: '7:00 PM',
      venue: 'Golden Village Suntec',
      sourceLink: 'https://singaporefilmsociety.com/songs-we-sang',
      image:
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&fit=crop',
      genre: 'Documentary',
      isIndiegoPick: true,
    },
    {
      title: 'Reunification Experiment II',
      date: daysFromNow(15),
      time: '8:30 PM',
      venue: 'Objectifs Centre',
      sourceLink: 'https://www.objectifs.com.sg/reunification-2',
      image:
        'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&fit=crop',
      genre: 'Photography & Film',
    },
    {
      title: 'Thai Indie Cinema Night',
      date: daysFromNow(16),
      time: '7:30 PM',
      venue: 'The Projector',
      sourceLink: 'https://theprojector.sg/films/thai-indie-night',
      image:
        'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&fit=crop',
      genre: 'Art House',
    },
    {
      title: 'Mee Pok Man Remastered',
      date: daysFromNow(17),
      time: '9:00 PM',
      venue: 'Shaw Theatres Lido',
      sourceLink: 'https://singaporefilmsociety.com/mee-pok-man',
      image:
        'https://images.unsplash.com/photo-1518676590747-1e3dcf5a0f32?w=800&fit=crop',
      genre: 'Local Feature',
    },
    {
      title: 'Filipino New Wave Showcase',
      date: daysFromNow(18),
      time: '6:00 PM',
      venue: 'Oldham Theatre',
      sourceLink: 'https://www.objectifs.com.sg/filipino-new-wave',
      image:
        'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&fit=crop',
      genre: 'Short Films',
      accessibility: 'Closed Captions',
    },
    {
      title: 'A Land Imagined',
      date: daysFromNow(20),
      time: '8:00 PM',
      venue: 'The Projector',
      sourceLink: 'https://theprojector.sg/films/a-land-imagined',
      image:
        'https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?w=800&fit=crop',
      genre: 'Indie Film',
      isIndiegoPick: true,
    },
    {
      title: 'Be With Me — 20th Anniversary',
      date: daysFromNow(22),
      time: '7:00 PM',
      venue: 'National Gallery Singapore',
      sourceLink: 'https://www.nationalgallery.sg/be-with-me',
      image:
        'https://images.unsplash.com/photo-1568876694728-451bbf694b83?w=800&fit=crop',
      genre: 'Art House',
      accessibility: 'Wheelchair Accessible',
    },
  ]

  await upsertEvents(screenings)
  console.log(`Seeded ${screenings.length} screening events.`)
}

async function seedHostedAndPolls() {
  const hostedCount = await prisma.event.count({ where: { isHosted: true } })
  if (hostedCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: 'Soundscapes',
          date: daysFromNow(14),
          time: '7:30PM',
          venue: 'Online',
          image:
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&fit=crop',
          isHosted: true,
          genre: 'Musical Discovery',
        },
        {
          title: 'Sip & Zine',
          date: daysFromNow(16),
          time: '5:00PM',
          venue: "Pearl's Hill Terrace",
          image:
            'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&fit=crop',
          isHosted: true,
          genre: 'Community',
        },
      ],
    })
    console.log('Seeded hosted events.')
  }

  const voteOptionCount = await prisma.voteOption.count()
  if (voteOptionCount === 0) {
    await prisma.voteOption.createMany({
      data: [
        { title: 'Reel Nostalgia', venue: 'Heritage Cafe' },
        { title: 'Under the Neon Sky', venue: 'Rooftop Venue' },
      ],
    })
    console.log('Seeded vote options.')
  }
}

export async function runScrapers() {
  console.log('Starting fetch jobs...')
  const results = await Promise.allSettled([
    scrapeObjectifs(),
    scrapeSFS(),
    scrapeThirdParties(),
  ])
  const totalScraped = results.reduce(
    (sum, r) => sum + (r.status === 'fulfilled' ? r.value : 0),
    0,
  )

  if (totalScraped === 0) {
    await seedScreenings()
  }

  await seedHostedAndPolls()
  console.log('Fetch jobs completed.')
}

cron.schedule('0 0 * * *', () => {
  runScrapers()
})

runScrapers()
