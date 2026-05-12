import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react'
import { LABEL_COLORS } from '../data/constants'
import SEARCH_ALIASES from '../data/searchAliases'

/** Debounce a value by the given delay (ms). */
function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/** Escape regex special characters in a string. */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Highlight matching portions of text by wrapping them in <mark> tags. */
function highlightMatch(text, query) {
  const safeText = typeof text === 'string' ? text : ''
  if (!query) return safeText
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  return safeText.replace(regex, '<mark>$1</mark>')
}

/**
 * Resolve alias expansions for a query.
 * Returns a Set of lowercase full subject names that match via aliases.
 * Checks exact alias match first, then partial alias matches.
 */
function resolveAliases(q) {
  const expanded = new Set()

  // Exact alias match (highest priority)
  if (SEARCH_ALIASES[q]) {
    SEARCH_ALIASES[q].forEach(s => expanded.add(s.toLowerCase()))
  }

  // Also check if query is a prefix/substring of any alias key
  for (const [alias, subjects] of Object.entries(SEARCH_ALIASES)) {
    if (alias.startsWith(q) || q.startsWith(alias)) {
      subjects.forEach(s => expanded.add(s.toLowerCase()))
    }
  }

  return expanded
}

function Search({ notes, onSelect }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const debouncedQuery = useDebounce(query)

  // Ranked search: exact alias (3) > exact match (3) > prefix match (2) > contains (1)
  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q || !Array.isArray(notes)) return []

    // Resolve abbreviations to full subject names
    const aliasMatches = resolveAliases(q)

    return notes
      .map((note) => {
        const title = (note.title || '').toLowerCase()
        const subject = (note.subject || '').toLowerCase()
        const branch = (note.branch || '').toLowerCase()
        const semester = (note.semester || '').toLowerCase()
        const label = (note.label || '').toLowerCase()

        let score = 0

        // Alias match — treat as high-priority match
        if (aliasMatches.size > 0 && aliasMatches.has(subject)) score = 3
        else if (title === q || subject === q) score = 3
        else if (title.startsWith(q) || subject.startsWith(q)) score = 2
        else if (
          title.includes(q) ||
          subject.includes(q) ||
          branch.includes(q) ||
          semester.includes(q) ||
          label.includes(q)
        ) score = 1

        return { ...note, _score: score }
      })
      .filter(n => n._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 10)
  }, [debouncedQuery, notes])

  useEffect(() => { setActiveIndex(-1) }, [results])

  // Keep active item visible in the scrollable dropdown
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex]
      if (item) item.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback((note) => {
    onSelect(note)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }, [onSelect])

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const showDropdown = isOpen && query.trim().length > 0

  return (
    <div className="search" ref={wrapperRef} id="search-wrapper">
      <div className="search__input-wrapper">
        <svg className="search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className="search__input"
          type="text"
          placeholder='Search notes (e.g., DBMS, Module 1, PYQ)'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => { if (query.trim()) setIsOpen(true) }}
          onKeyDown={handleKeyDown}
          id="search-input"
          autoComplete="off"
        />
        <span className="search__shortcut-hint" aria-hidden="true">/</span>
        {query && (
          <button
            className="search__clear"
            onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus() }}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="search__dropdown" id="search-dropdown">
          {results.length === 0 ? (
            <div className="search__no-results">No matching notes found</div>
          ) : (
            <ul className="search__results" ref={listRef} role="listbox">
              {results.map((note, i) => {
                const labelStyle = LABEL_COLORS[note.label]
                return (
                  <li
                    key={note.id}
                    className={`search__result ${i === activeIndex ? 'search__result--active' : ''}`}
                    onClick={() => handleSelect(note)}
                    role="option"
                    aria-selected={i === activeIndex}
                    id={`search-result-${note.id}`}
                  >
                    <div className="search__result-main">
                      <span
                        className="search__result-title"
                        dangerouslySetInnerHTML={{ __html: highlightMatch(note.title, debouncedQuery.trim()) }}
                      />
                      {note.label && labelStyle && (
                        <span
                          className="search__result-badge"
                          style={{ background: labelStyle.bg, color: labelStyle.color }}
                        >
                          {note.label}
                        </span>
                      )}
                    </div>
                    <div className="search__result-meta">
                      <span dangerouslySetInnerHTML={{ __html: highlightMatch(note.subject, debouncedQuery.trim()) }} />
                      <span className="search__result-sep">·</span>
                      <span dangerouslySetInnerHTML={{ __html: highlightMatch(note.branch, debouncedQuery.trim()) }} />
                      <span className="search__result-sep">·</span>
                      <span>{note.semester}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(Search)
