import { useState, useEffect, useCallback, useRef, memo } from 'react'

const ExternalLinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

const AlertIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

function Viewer({ note, refreshKey = 0 }) {
  const [loading, setLoading] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [internalKey, setInternalKey] = useState(0)
  const timeoutRef = useRef(null)

  // Reset loading/error state whenever the active document changes
  useEffect(() => {
    if (!note) return

    setLoading(true)
    setLoadFailed(false)

    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setLoadFailed(true)
      setLoading(false)
    }, 12000)

    return () => clearTimeout(timeoutRef.current)
  }, [note?.id, refreshKey, internalKey])

  const handleIframeLoad = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setLoading(false)
    setLoadFailed(false)
  }, [])

  const handleIframeError = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setLoading(false)
    setLoadFailed(true)
  }, [])

  const handleOpenNewTab = useCallback(() => {
    if (note?.fileUrl) {
      window.open(note.fileUrl.replace('/preview', '/view'), '_blank', 'noopener,noreferrer')
    }
  }, [note?.fileUrl])

  const handleReload = useCallback(() => {
    setLoading(true)
    setLoadFailed(false)
    setInternalKey((k) => k + 1)
  }, [])

  // Empty state — no note selected
  if (!note) {
    return (
      <main className="content" id="content-area">
        <div className="content__empty">
          <svg className="content__empty-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className="content__empty-title">Welcome to MIT Jnana</p>
          <p className="content__empty-hint">Select a branch → semester → subject to start studying</p>
        </div>
      </main>
    )
  }

  const iframeKey = `${note.id}-${refreshKey}-${internalKey}`

  return (
    <main className="content" id="content-area">
      <div className="viewer-bar">
        <span className="viewer-bar__title">{note.title}</span>
        {note.label && <span className={`viewer-bar__label viewer-bar__label--${note.label.toLowerCase()}`}>{note.label}</span>}
        <span className="viewer-bar__meta">{note.subject} · {note.semester}</span>
        <div className="viewer-controls" id="viewer-controls">
          <button className="viewer-control-btn" onClick={handleOpenNewTab} title="Open in new tab" aria-label="Open in new tab" id="open-new-tab-btn">
            <ExternalLinkIcon />
          </button>
          <button className="viewer-control-btn" onClick={handleReload} title="Reload document" aria-label="Reload document" id="reload-doc-btn">
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="viewer-wrapper">
        {loading && (
          <div className="viewer-loading" id="viewer-loading">
            <div className="viewer-loading__spinner" />
            <p>Loading document… please wait</p>
          </div>
        )}

        {loadFailed && (
          <div className="viewer-error" id="viewer-error">
            <AlertIcon />
            <p className="viewer-error__title">Unable to load document</p>
            <p className="viewer-error__hint">The file may be unavailable or the link may be broken.</p>
            <div className="viewer-error__actions">
              <button className="viewer-error__btn viewer-error__btn--primary" onClick={handleOpenNewTab}>
                <ExternalLinkIcon /> Open in new tab
              </button>
              <button className="viewer-error__btn" onClick={handleReload}>
                <RefreshIcon /> Try again
              </button>
            </div>
          </div>
        )}

        <iframe
          className={`viewer-frame ${(loading || loadFailed) ? 'viewer-frame--hidden' : ''}`}
          src={note.fileUrl}
          title={note.title}
          allow="autoplay"
          key={iframeKey}
          id="pdf-viewer"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </main>
  )
}

export default memo(Viewer)
