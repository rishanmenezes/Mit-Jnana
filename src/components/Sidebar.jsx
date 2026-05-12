import { useState, memo } from 'react'
import { BRANCHES, BRANCH_ICONS, SEMESTER_SUBJECTS } from '../data/branches'
import { LABEL_COLORS } from '../data/constants'

// ── SVG Icons ──

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const FileIcon = () => (
  <svg className="file-item__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

// ── Collapsible Section ──

function CollapsibleSection({ label, tooltip, children, depth = 0, isEmpty = false, icon }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="sidebar-section">
      <button
        className={`sidebar-toggle ${isEmpty ? 'sidebar-toggle--empty' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        style={{ paddingLeft: `${16 + depth * 12}px` }}
        title={tooltip || label}
      >
        <span className={`sidebar-toggle__icon ${isOpen ? 'sidebar-toggle__icon--open' : ''}`}>
          <ChevronIcon />
        </span>
        {icon && <span className="sidebar-toggle__cycle-icon">{icon}</span>}
        <span className="sidebar-toggle__label">{label}</span>
        {isEmpty && <span className="sidebar-toggle__empty-tag">—</span>}
      </button>
      {isOpen && <div className="sidebar-children">{children}</div>}
    </div>
  )
}

// ── Empty subject placeholder ──

function EmptySubjectHint({ depth }) {
  return (
    <div
      className="sidebar-empty-hint"
      style={{ paddingLeft: `${16 + depth * 12 + 8}px` }}
    >
      No notes available yet
    </div>
  )
}

// ── File list for a subject ──

function FileList({ files, activeNoteId, onSelectNote, depth }) {
  if (!Array.isArray(files) || files.length === 0) {
    return <EmptySubjectHint depth={depth} />
  }

  return files.map((file) => (
    <button
      key={file.id}
      className={`file-item ${activeNoteId === file.id ? 'file-item--active' : ''}`}
      onClick={() => onSelectNote(file)}
      title={file.title}
      style={{ paddingLeft: `${16 + depth * 12 + 8}px` }}
      id={`file-${file.id}`}
    >
      <FileIcon />
      <span className="file-item__label">{file.title}</span>
      {file.label && (
        <span
          className="file-item__badge"
          style={{ background: LABEL_COLORS[file.label]?.sidebar || '#6b7280' }}
        >
          {file.label}
        </span>
      )}
    </button>
  ))
}

// ── Sidebar ──

function Sidebar({ navTree, activeNoteId, onSelectNote, isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} id="sidebar-nav" role="navigation" aria-label="Notes navigation">
      {Object.entries(navTree).map(([branchCode, semesters]) => (
        <CollapsibleSection
          key={branchCode}
          label={`${BRANCH_ICONS[branchCode] || ''} ${branchCode}`}
          tooltip={BRANCHES[branchCode]}
          depth={0}
        >
          {Object.entries(semesters).map(([semester, semData]) => {
            const predefined = SEMESTER_SUBJECTS[semester]?.[branchCode]
            const hasCycles = !!predefined && !Array.isArray(predefined)

            if (hasCycles) {
              // First Year: Cycle → Subject → Files
              return (
                <CollapsibleSection
                  key={semester}
                  label={semester}
                  depth={1}
                >
                  {Object.entries(semData).map(([cycleName, subjects]) => (
                    <CollapsibleSection
                      key={cycleName}
                      label={cycleName}
                      depth={2}
                      icon={cycleName.includes('Physics') ? '⚛️' : '🧪'}
                    >
                      {Object.entries(subjects).map(([subject, files]) => (
                        <CollapsibleSection key={subject} label={subject} depth={3}>
                          <FileList
                            files={files}
                            activeNoteId={activeNoteId}
                            onSelectNote={onSelectNote}
                            depth={4}
                          />
                        </CollapsibleSection>
                      ))}
                    </CollapsibleSection>
                  ))}
                </CollapsibleSection>
              )
            }

            // Sem 3–7: flat Subject → Files
            const hasSubjects = Object.keys(semData).length > 0
            return (
              <CollapsibleSection
                key={semester}
                label={semester}
                depth={1}
                isEmpty={!hasSubjects}
              >
                {hasSubjects &&
                  Object.entries(semData).map(([subject, files]) => (
                    <CollapsibleSection key={subject} label={subject} depth={2}>
                      <FileList
                        files={files}
                        activeNoteId={activeNoteId}
                        onSelectNote={onSelectNote}
                        depth={3}
                      />
                    </CollapsibleSection>
                  ))}
              </CollapsibleSection>
            )
          })}
        </CollapsibleSection>
      ))}
    </aside>
  )
}

export default memo(Sidebar)
