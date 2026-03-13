import { useRef } from 'react'
import './App.css'

const events = [
  {
    title: 'Soundscapes',
    date: '29 Jan, 7:30PM',
    venue: '',
    online: true,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=600&fit=crop',
    curator: true,
  },
  {
    title: 'Sip & Zine',
    date: '31 Jan, 5PM',
    venue: "Pearl's Hill Terrace",
    online: false,
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&h=600&fit=crop',
  },
  {
    title: 'Frames of Home',
    date: '2 Feb, 7:30PM',
    venue: 'Picturehouse',
    online: true,
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=600&fit=crop',
    curator: true,
  },
  {
    title: 'Body/Space',
    date: '3 Feb, 8PM',
    venue: 'Gillman Barracks Courtyard',
    online: false,
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=500&h=600&fit=crop',
  },
  {
    title: 'Late 2 the Party',
    date: '6 Feb, 8PM',
    venue: 'Crane Club',
    online: true,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=600&fit=crop',
  },
  {
    title: 'City After Dark',
    date: '10 Feb, 8PM',
    venue: 'The Hive Rooftop',
    online: false,
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500&h=600&fit=crop',
  },
]

const footerColumns = [
  { title: 'Home', links: ['Canvas', 'Collaborations', 'Collectives'] },
  { title: 'Films', links: ['Genres', 'Trending', 'New Release'] },
  { title: 'Collectives', links: ['Theme', 'Reviews', 'Art Submission'] },
  { title: 'Support', links: ['Contact Us'] },
  { title: 'Account', links: ['Profile Creation', 'Features'] },
]

function App() {
  const carouselRef = useRef(null)

  const scroll = (direction) => {
    if (!carouselRef.current) return
    const amount = 260
    carouselRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header__left">
          <a href="#" className="header__logo">
            <span className="header__logo-icon">♥</span>
          </a>
          <a href="#" className="nav-link">All Events</a>
          <a href="#" className="nav-link">Art Gallery</a>
        </div>
        <a href="#" className="header__logo">
          <span className="header__logo-text">The Curator</span>
        </a>
        <div className="header__right">
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Sign Up</a>
          <button className="header__search" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <img
          className="hero__bg"
          src="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1600&h=900&fit=crop"
          alt="Colorful Singapore shophouses"
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title">
            Emily of Emerald Hill,<br />Where It Belongs
          </h1>
          <p className="hero__subtitle">
            The house is alive again. Don&apos;t just watch — step inside.
          </p>
          <p className="hero__meta">
            30 January, 2025 | 8PM @ 37 Emerald Hill
          </p>
          <a href="#" className="hero__cta">Tickets</a>
        </div>
      </section>

      {/* VOTING */}
      <section className="voting">
        <div className="voting__text">
          <h2 className="voting__heading">
            <span className="accent">You Curate,</span>
            <span>We Create</span>
          </h2>
          <p className="voting__description">
            This month, we&apos;re choosing between two stories
            of Singapore, told through different lenses.
          </p>
          <p className="voting__description">
            Your vote decides what unfolds next.<br />
            Join us in curating the next chapter.
          </p>
          <a href="#" className="voting__cta">Vote Now</a>
        </div>
        <div className="voting__cards">
          <div className="voting__card voting__card--tall">
            <div className="voting__card-label">
              Reel Nostalgia<br />@ Heritage Café
            </div>
          </div>
          <div className="voting__card voting__card--short">
            <div className="voting__card-label">
              Under the Neon Sky<br />@ Rooftop Venue
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S ON */}
      <section className="whats-on">
        <div className="whats-on__header">
          <h2 className="whats-on__title">What&apos;s On</h2>
        </div>
        <p className="whats-on__subtitle">Happening This Week</p>
        <div className="whats-on__carousel-wrapper">
          <button
            className="whats-on__arrow whats-on__arrow--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <div className="whats-on__carousel" ref={carouselRef}>
            {events.map((event) => (
              <article key={event.title} className="event-card">
                <div className="event-card__image">
                  <img src={event.image} alt={event.title} loading="lazy" />
                  {event.online && (
                    <span className="event-card__badge">Online</span>
                  )}
                  {event.curator && (
                    <div className="event-card__curator-badge">
                      <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop"
                        alt="The Curator"
                      />
                    </div>
                  )}
                </div>
                <h3 className="event-card__title">{event.title}</h3>
                <p className="event-card__meta">
                  {event.date}
                  {event.venue && ` @ ${event.venue}`}
                </p>
              </article>
            ))}
          </div>
          <button
            className="whats-on__arrow whats-on__arrow--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
        <a href="#" className="whats-on__view-all">View All</a>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__grid">
          {footerColumns.map((col) => (
            <div key={col.title} className="footer__col">
              <h4 className="footer__col-title">{col.title}</h4>
              {col.links.map((link) => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
          ))}
          <div className="footer__col">
            <h4 className="footer__col-title">Connect With Us</h4>
            <div className="footer__social">
              <a href="#" className="footer__social-icon" aria-label="Telegram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>@2025, All Rights Reserved</span>
          <div className="footer__legal">
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
