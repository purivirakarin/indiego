import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
      description:
        'In 1992, Sandi Tan and her friends shot a road movie across Singapore with a mysterious American mentor — who then vanished with all the footage. Decades later, the film reappears. Shirkers is a story about friendship, creativity, and the things that get stolen from us.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&fit=crop',
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&fit=crop',
        'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&fit=crop',
      ]),
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
      description:
        'After eight years in prison, a man returns to Singapore to find his ex-wife remarried and his daughter given away. A raw and unflinching debut feature that explores guilt, redemption, and the cost of second chances in a city that never slows down.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&fit=crop',
        'https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=800&fit=crop',
      ]),
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
      description:
        "Set during the 1997 Asian financial crisis, Ilo Ilo tells the story of a Singaporean family and their Filipino maid. Winner of the Camera d'Or at Cannes, it is a tender, deeply human film about class, love, and the invisible bonds between strangers who become family.",
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop',
        'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&fit=crop',
        'https://images.unsplash.com/photo-1568876694728-451bbf694b83?w=800&fit=crop',
      ]),
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
      description:
        'A disillusioned architect finds his childhood elephant on the streets of Bangkok and embarks on an unlikely road trip back to their hometown. Equal parts absurd and heartfelt, Pop Aye is a gentle fable about memory, midlife, and finding your way home.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop',
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&fit=crop',
      ]),
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
      description:
        'A young correctional officer takes a job at a maximum-security prison and is gradually drawn into a complicated relationship with the chief executioner. Apprentice is a morally gripping thriller that asks how far we go before we become complicit.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&fit=crop',
        'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&fit=crop',
      ]),
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
      description:
        'Through a treasure trove of never-before-seen home videos from the 1960s, Sandcastle pieces together the personal and political history of a Singapore Chinese family during the turbulent post-independence years. A nostalgic yet revealing look at national identity.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&fit=crop',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop',
      ]),
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
      description:
        "When the patriarch of a Singaporean family passes away, the inheritance he leaves behind unravels the family's carefully maintained facade. Singapore Dreaming is a bittersweet comedy-drama about the gap between aspiration and reality in the Lion City.",
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&fit=crop',
        'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&fit=crop',
      ]),
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
      description:
        'A Chinese-language teacher in a Singapore secondary school navigates a crumbling marriage and a culture that no longer values what she teaches. When a student begins staying after class, an unexpected connection forms during the monsoon season.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=800&fit=crop',
        'https://images.unsplash.com/photo-1568876694728-451bbf694b83?w=800&fit=crop',
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop',
      ]),
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
      description:
        'An evening celebrating the intersection of Japanese photography and cinema. Featuring two short documentaries about Tokyo street photographers, followed by a panel discussion on the visual language shared between still and moving images.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&fit=crop',
        'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&fit=crop',
      ]),
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
      description:
        'A curated programme of six short films from across Southeast Asia — from a Myanmar animation about displacement, to a Vietnamese love letter shot on 16mm. Each film captures a different facet of life in the region, united by bold storytelling and visual poetry.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&fit=crop',
        'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&fit=crop',
      ]),
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
      description:
        "Three interlocking stories set within an HDB block paint a vivid portrait of everyday Singaporean life — the tensions, the loneliness, and the quiet resilience. Eric Khoo's landmark film that helped launch Singapore's indie cinema movement.",
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&fit=crop',
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&fit=crop',
      ]),
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
      description:
        'Inspired by Saturday Night Fever, a grocery store assistant in 1970s Singapore dreams of winning a disco dance competition. A feel-good, nostalgic romp that celebrates the universal desire to be somebody, set against a uniquely Singaporean backdrop.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&fit=crop',
        'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&fit=crop',
      ]),
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
      description:
        'A screening of selected episodes from the acclaimed drama series that follows diverse residents of a fictional HDB estate. Each story reveals the hidden struggles and quiet dignity of ordinary Singaporeans — the immigrant worker, the single mother, the ageing hawker.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop',
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&fit=crop',
        'https://images.unsplash.com/photo-1568876694728-451bbf694b83?w=800&fit=crop',
      ]),
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
      description:
        "A love letter to Singapore's xinyao movement — the Mandarin folk music scene that swept campuses in the 1980s. Through archival footage and interviews with original musicians, the film traces how a generation found its voice through song.",
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=800&fit=crop',
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop',
      ]),
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
      description:
        'Part documentary, part social experiment — filmmaker Miko Revereza traces his undocumented journey across the United States and back to the Philippines. A deeply personal meditation on borders, belonging, and the cost of the American dream.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=800&fit=crop',
        'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&fit=crop',
      ]),
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
      description:
        'A double bill of contemporary Thai independent cinema — featuring a slow-burn mystery set in the northern highlands and an experimental short about Bangkok nightlife. Curated in partnership with the Thai Film Archive.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&fit=crop',
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&fit=crop',
      ]),
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
      description:
        "Eric Khoo's debut feature — a noodle seller becomes obsessed with a sex worker he rescues from a hit-and-run. Dark, unflinching, and entirely original, Mee Pok Man was the film that proved Singapore cinema could be daring. Now remastered in 4K.",
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop',
      ]),
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
      description:
        'Four short films from a new generation of Filipino filmmakers redefining indie cinema in Southeast Asia. Themes range from urban isolation in Manila to magical realism in the provinces — bold, inventive, and uncompromising.',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&fit=crop',
        'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&fit=crop',
      ]),
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
      description:
        "A detective investigates the disappearance of a migrant worker from a land reclamation site. As he digs deeper, reality and dreams begin to blur. Winner of the Golden Leopard at Locarno, A Land Imagined is a haunting noir set in Singapore's hidden margins.",
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1518676590747-1e3dcf5a0f32?w=800&fit=crop',
        'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&fit=crop',
        'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&fit=crop',
      ]),
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
      description:
        "Three love stories weave through Eric Khoo's lyrical ode to connection — a deaf-blind woman learning to communicate, two teenage girls discovering first love, and a lonely security guard pining for a hawker stall owner. Celebrating 20 years of quiet beauty.",
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&fit=crop',
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&fit=crop',
        'https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?w=800&fit=crop',
      ]),
    },
  ]

  for (const s of screenings) {
    await prisma.event.create({
      data: {
        title: s.title,
        date: s.date,
        time: s.time || null,
        venue: s.venue || null,
        sourceLink: s.sourceLink,
        image: s.image,
        isHosted: false,
        genre: s.genre || 'Indie Film',
        isIndiegoPick: s.isIndiegoPick || false,
        accessibility: s.accessibility || null,
        description: s.description || null,
        galleryImages: s.galleryImages || null,
      },
    })
  }
  console.log(`Seeded ${screenings.length} screenings.`)
}

async function seedHostedEvents() {
  const count = await prisma.event.count({ where: { isHosted: true } })
  if (count > 0) return

  await prisma.event.createMany({
    data: [
      {
        title: 'Soundscapes',
        date: daysFromNow(14),
        time: '7:30 PM',
        venue: 'Online',
        image:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&fit=crop',
        isHosted: true,
        genre: 'Musical Discovery',
        description:
          'A virtual listening party exploring how film composers across Southeast Asia create sonic landscapes for indie cinema. Hear exclusive behind-the-scenes commentary from composers, followed by a live Q&A and curated playlist drop.',
      },
      {
        title: 'Sip & Zine',
        date: daysFromNow(16),
        time: '5:00 PM',
        venue: "Pearl's Hill Terrace",
        image:
          'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&fit=crop',
        isHosted: true,
        genre: 'Community',
        description:
          "Bring your favourite film stills, scissors, and a thirst for creativity. We're hosting an afternoon of zine-making, specialty coffee, and conversations about visual storytelling. All materials provided — just bring yourself and your imagination.",
      },
    ],
  })
  console.log('Seeded hosted events.')
}

async function seedVoteOptions() {
  const count = await prisma.voteOption.count()
  if (count > 0) return

  await prisma.voteOption.createMany({
    data: [
      { title: 'Reel Nostalgia', venue: 'Heritage Cafe' },
      { title: 'Under the Neon Sky', venue: 'Rooftop Venue' },
    ],
  })
  console.log('Seeded vote options.')
}

export async function runSeed() {
  console.log('Running seed...')
  await seedScreenings()
  await seedHostedEvents()
  await seedVoteOptions()
  console.log('Seed completed.')
}
