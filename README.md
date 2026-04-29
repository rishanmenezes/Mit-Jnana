# MIT Jnana

**Student Resource Hub** — A fast, minimal notes platform for MIT Mysore students. Browse notes by branch, semester, and subject. Read PDFs directly in the browser.

Live at: [mit-jnana.netlify.app](https://mit-jnana.netlify.app)

---

## Features

- **Branch-wise navigation** — 11 engineering branches with full semester coverage
- **Hierarchical sidebar** — Branch → Semester → Subject → Notes
- **Embedded PDF viewer** — Read Google Drive documents without leaving the site
- **Global search** — Find notes by title, subject, branch, semester, or label
- **Keyboard shortcuts** — `/` to search, `Ctrl+B` to toggle sidebar
- **Mobile responsive** — Collapsible sidebar with swipe-friendly UI
- **Visitor counter** — Live visit tracking via Abacus API
- **Note labels** — Categorize notes as `Notes`, `PYQ`, or `Important`

---

## Architecture

```
Branch (CSE, ECE, ME, ...)
├── First Year
│   ├── Physics Cycle → Subject → Files
│   └── Chemistry Cycle → Subject → Files
├── Semester 3 → Subject → Files
├── Semester 4 → Subject → Files
├── Semester 5 → Subject → Files
├── Semester 6 → Subject → Files
└── Semester 7 → Subject → Files
```

### Project Structure

```
src/
├── App.jsx                  # Root component, navTree builder, layout
├── main.jsx                 # React entry point
├── index.css                # All styles (design system + components)
├── components/
│   ├── Header.jsx           # Brand, search bar, visitor counter
│   ├── Search.jsx           # Global search with keyboard navigation
│   ├── Sidebar.jsx          # Collapsible navigation tree
│   └── Viewer.jsx           # PDF iframe viewer with loading/error states
└── data/
    ├── branches.js          # Branch definitions, semesters, subject mapping
    ├── constants.js         # Shared constants (label colors)
    └── notes.json           # Note entries (title, URL, subject, semester, branch)
```

---

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Adding Notes

Edit `src/data/notes.json`. Each entry:

```json
{
  "id": 6,
  "title": "Your Note Title",
  "fileUrl": "https://drive.google.com/file/d/YOUR_FILE_ID/preview",
  "subject": "Subject Name",
  "semester": "Semester 3",
  "branch": "CSE",
  "label": "Notes"
}
```

**Getting the preview URL:**

1. Open the file in Google Drive
2. Share → Set to "Anyone with the link"
3. Copy the file ID from the URL
4. Use format: `https://drive.google.com/file/d/{FILE_ID}/preview`

---

## Data Rules

> These rules are critical for notes to appear correctly in the UI.

| Rule | Detail |
|---|---|
| **Subject names** | Must exactly match entries in `SEMESTER_SUBJECTS` (`branches.js`) |
| **First Year notes** | Use `"semester": "Semester 1"` or `"Semester 2"` — the navTree merges them into cycles |
| **No labs** | Lab subjects are intentionally excluded from the curriculum |
| **Cycles** | First Year uses Physics Cycle / Chemistry Cycle structure |
| **Semesters 3–6** | Use flat subject arrays per branch |
| **Semester 7** | Passthrough — any notes filed under it appear automatically |
| **Labels** | Optional. Valid values: `Notes`, `PYQ`, `Important` |
| **Branch codes** | Must match keys in `BRANCHES` (e.g., `CSE`, `ECE`, `ME`) |

---

## Branches

| Code | Full Name |
|---|---|
| CV | Civil Engineering |
| CSE | Computer Science & Engineering |
| CSAI | CS (Artificial Intelligence) |
| CSDS | CS (Data Science) |
| CSBS | CS (Business System) |
| ECE | Electronics & Communication Engineering |
| ISE | Information Science & Engineering |
| ME | Mechanical Engineering |
| CE | Computer Engineering |
| CSE-AIML | CS (AI & Machine Learning) |
| CSE-IOT | CS (IOT & Cyber Security) |

---

## Deployment

Deployed on **Netlify** with automatic builds from GitHub.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Redirects:** All routes → `index.html` (SPA)

---

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool and dev server
- **Vanilla CSS** — Custom design system with CSS variables
- **Inter** — Typography (Google Fonts)
- **Google Drive** — PDF hosting via iframe embeds
- **Abacus API** — Visitor counter
- **Netlify** — Hosting and CI/CD

---

## Author

Built by [Rishan Menezes](https://www.linkedin.com/in/rishan-menezes/)
