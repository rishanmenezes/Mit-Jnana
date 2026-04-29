import { useState, useEffect, memo } from 'react'
import Search from './Search'

const API_PRIMARY = 'https://abacus.jasoncameron.dev/hit/mit-jnana/visits'
const API_FALLBACK = 'https://api.countapi.xyz/hit/mit-jnana/visits'

function Header({ onMenuToggle, notes, onSelectNote }) {
  const [visitorCount, setVisitorCount] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetch(API_PRIMARY, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (!cancelled && typeof data?.value === 'number') {
          setVisitorCount(data.value)
        } else if (!cancelled) {
          throw new Error('Invalid response format')
        }
      })
      .catch(() => {
        if (cancelled) return
        fetch(API_FALLBACK)
          .then(res => res.json())
          .then(data => {
            if (!cancelled && typeof data?.value === 'number') {
              setVisitorCount(data.value)
            }
          })
          .catch(() => {
            if (!cancelled) setVisitorCount(0)
          })
      })

    return () => { cancelled = true }
  }, [])

  const counterNumber = visitorCount !== null
    ? visitorCount.toLocaleString()
    : '...'

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
