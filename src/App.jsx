import { useState, useMemo, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Viewer from './components/Viewer'
import notes from './data/notes.json'
import { BRANCHES, SEMESTERS, SEMESTER_SUBJECTS } from './data/branches'

function App() {
  const [activeNote, setActiveNote] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  /**
   * Build the navigation tree from static data.
   *
   * Structure varies by semester type:
   *   First Year → Branch → Cycle (Physics/Chemistry) → Subject → Files
   *   Sem 3–7   → Branch → Subject → Files
   *
   * Notes are indexed by branch/semester/subject, then merged into the
   * predefined subject structure so every subject always appears even
   * when no notes exist yet.
   */
  const navTree = useMemo(() => {
    if (!Array.isArray(notes)) return {}

    // Index all notes by branch → semester → subject
    const index = {}
    notes.forEach((note) => {
      if (!note?.branch || !note?.semester || !note?.subject) return
      if (!index[note.branch]) index[note.branch] = {}
      if (!index[note.branch][note.semester]) index[note.branch][note.semester] = {}
      if (!index[note.branch][note.semester][note.subject])
        index[note.branch][note.semester][note.subject] = []
      index[note.branch][note.semester][note.subject].push(note)
    })

    const tree = {}
    Object.keys(BRANCHES).forEach((branchCode) => {
      tree[branchCode] = {}
      SEMESTERS.forEach((sem) => {
        const predefined = SEMESTER_SUBJECTS[sem]?.[branchCode]

        if (predefined && !Array.isArray(predefined)) {
          // First Year: cycle-based object { "Physics Cycle": [...], "Chemistry Cycle": [...] }
          // Notes may be filed under "Semester 1", "Semester 2", or "First Year"
          const semNode = {}
          Object.entries(predefined).forEach(([cycleName, subjects]) => {
            const cycleNode = {}
            if (!Array.isArray(subjects)) return
            subjects.forEach((subj) => {
              const name = typeof subj === 'object' ? subj.name : subj
              const s1 = index[branchCode]?.['Semester 1']?.[name] || []
              const s2 = index[branchCode]?.['Semester 2']?.[name] || []
              const fy = index[branchCode]?.['First Year']?.[name] || []
              cycleNode[name] = [...s1, ...s2, ...fy]
            })
            semNode[cycleName] = cycleNode
          })
          tree[branchCode][sem] = semNode
        } else if (Array.isArray(predefined)) {
          // Sem 3+: flat subject list
          const semNode = {}
          predefined.forEach((subj) => {
            semNode[subj] = index[branchCode]?.[sem]?.[subj] || []
          })
          tree[branchCode][sem] = semNode
        } else {
          // No predefined subjects — passthrough any existing notes (e.g., Semester 7)
          tree[branchCode][sem] = index[branchCode]?.[sem] || {}
        }
      })
    })

    return tree
  }, [])

  // Keyboard shortcuts: "/" to focus search, Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
      }

      if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setSidebarOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handles note selection; re-clicking the same note forces an iframe reload
  const handleSelectNote = useCallback(
    (note) => {
      if (activeNote?.id === note.id) {
        setRefreshKey((k) => k + 1)
      } else {
        setActiveNote(note)
      }
      setSidebarOpen(false)
    },
    [activeNote?.id]
  )

  return (
    <>
      <Header
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        notes={notes}
        onSelectNote={handleSelectNote}
      />
      <div className="layout">
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar
          navTree={navTree}
          activeNoteId={activeNote?.id ?? null}
          onSelectNote={handleSelectNote}
          isOpen={sidebarOpen}
        />
        <Viewer
          note={activeNote}
          refreshKey={refreshKey}
        />
      </div>
      <footer className="footer" id="app-footer">
        <span className="footer__tagline">MIT Jnana — Student Resource Hub</span>
        <a
          className="footer__credit"
          href="https://www.linkedin.com/in/rishan-menezes/"
          target="_blank"
          rel="noopener noreferrer"
          id="developer-credit"
        >
          <img
            className="footer__avatar"
            src="/developer.jpg"
            alt="Rishan Menezes"
            width="32"
            height="32"
          />
          <span className="footer__credit-text">Built by <strong>Rishan Menezes</strong></span>
        </a>
      </footer>
    </>
  )
}

export default App
