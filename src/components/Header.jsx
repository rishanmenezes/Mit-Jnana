import { useState, useEffect, memo } from 'react'
import Search from './Search'

const COUNTER_API_URL = 'https://abacus.jasoncameron.dev/hit/mit-jnana-v1/visits'
const CACHE_KEY = 'mitjnana_visitor_cache'
const CACHE_TTL_MS = 5 * 60 * 1000

/** Read cached visitor count from sessionStorage if still within TTL. */
function getCachedCount() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { value, ts } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_TTL_MS && typeof value === 'number') return value
  } catch { /* ignore corrupted cache */ }
  return null
}

/** Write visitor count + timestamp to sessionStorage. */
function setCachedCount(value) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ value, ts: Date.now() }))
  } catch { /* storage full or unavailable */ }
}

function Header({ onMenuToggle, notes, onSelectNote }) {
  const [visitorCount, setVisitorCount] = useState(() => getCachedCount())
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (visitorCount !== null) return

    let cancelled = false

    async function fetchCount(isRetry = false) {
      try {
        const res = await fetch(COUNTER_API_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (!cancelled && typeof data?.value === 'number') {
          setVisitorCount(data.value)
          setCachedCount(data.value)
        } else if (!cancelled) {
          throw new Error('Invalid response format')
        }
      } catch {
        if (cancelled) return
        if (!isRetry) {
          setTimeout(() => { if (!cancelled) fetchCount(true) }, 1000)
        } else {
          setFailed(true)
        }
      }
    }

    fetchCount()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  let counterNumber
  if (visitorCount !== null) {
    counterNumber = visitorCount.toLocaleString()
  } else if (failed) {
    counterNumber = '0'
  } else {
    counterNumber = '...'
  }

  return (
    <header className="header" id="app-header">
      <button
        className="header__menu-btn"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        id="menu-toggle-btn"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="header__brand" id="header-brand">
        <img
          className="header__brand-logo"
          src="/mit-logo.png"
          alt="MIT Mysore Logo"
          draggable="false"
        />
        <div className="header__brand-text">
          <h1 className="header__logo">
            <span className="header__logo-mit">MIT</span>{' '}
            <span className="header__logo-jnana">Jnana</span>
          </h1>
          <span className="header__tagline">Student Resource Hub</span>
        </div>
      </div>
      <Search notes={notes} onSelect={onSelectNote} />
      <div className="header__visitor-count" id="visitor-counter" title={`${counterNumber} total visits`}>
        <span className="header__visitor-icon" aria-hidden="true">👥</span>
        <span className="header__visitor-number">{counterNumber}</span>
        <span className="header__visitor-label">visits</span>
      </div>
    </header>
  )
}

export default memo(Header)
