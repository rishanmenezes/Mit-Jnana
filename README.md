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
- **Deep linking** — Share direct links to specific notes via URL parameters
- **Dynamic SEO** — Automatic meta tag updates based on current note
- **Full-screen mode** — Native fullscreen support for PDF viewing
- **Share functionality** — Native share API with clipboard fallback

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
mit-jnana/
├── public/                      # Static assets
│   ├── apple-touch-icon.png     # iOS device icon
│   ├── developer.jpg            # Developer photo for footer
│   ├── favicon.ico              # Classic favicon
│   ├── favicon.png              # Modern PNG favicon
│   ├── mit-logo.png             # MIT Mysore logo
│   ├── robots.txt               # SEO robots file
│   └── sitemap.xml              # SEO sitemap
├── src/
│   ├── App.jsx                  # Root component, navTree builder, layout
│   ├── main.jsx                 # React entry point
│   ├── index.css                # All styles (design system + components)
│   ├── components/
│   │   ├── Header.jsx           # Brand, search bar, visitor counter
│   │   ├── Search.jsx           # Global search with keyboard navigation
│   │   ├── Sidebar.jsx          # Collapsible navigation tree
│   │   └── Viewer.jsx           # PDF iframe viewer with loading/error states
│   └── data/
│       ├── branches.js          # Branch definitions, semesters, subject mapping
│       ├── constants.js         # Shared constants (label colors)
│       ├── notes.json           # Note entries (title, URL, subject, semester, branch)
│       └── searchAliases.js     # Search alias mappings for common abbreviations
├── index.html                   # HTML entry point with SEO meta tags
├── vite.config.js               # Vite build configuration
├── eslint.config.js             # ESLint configuration
├── netlify.toml                 # Netlify deployment configuration
├── package.json                 # Project dependencies and scripts
└── .gitignore                   # Git ignore patterns
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

# Run linter
npm run lint
```

---

## Component Overview

### App.jsx
Main application component that handles:
- Navigation tree construction from static data
- Deep linking via URL parameters (`?note=ID`)
- Dynamic SEO meta tag updates
- Mobile sidebar state management
- Keyboard shortcuts (search focus, sidebar toggle)
- Body scroll locking for mobile sidebar

### Header.jsx
Header component featuring:
- MIT Mysore branding with logo
- Global search integration
- Visitor counter with API fallback (Abacus → CountAPI)
- Mobile menu toggle button
- Responsive layout

### Search.jsx
Advanced search component with:
- Multi-category search (navigation, subjects, notes)
- Query normalization (branch/semester extraction)
- Search alias support for common abbreviations
- Keyboard navigation with arrow keys
- Debounced input for performance
- Highlighted matching text

### Sidebar.jsx
Collapsible navigation sidebar with:
- Hierarchical tree structure (Branch → Semester → Subject → Files)
- Cycle-based navigation for First Year (Physics/Chemistry)
- Auto-expansion based on search navigation
- Empty state indicators for subjects without notes
- Branch icons for visual identification
- File badges for note labels

### Viewer.jsx
PDF viewer component with:
- Google Drive iframe embedding
- Loading and error state handling
- Full-screen mode support
- Share functionality (native API + clipboard fallback)
- Open in new tab option
- Refresh capability for stuck documents
- Touch gesture support for mobile zoom

---

## Data Structures

### branches.js
Contains branch definitions and curriculum structure:
- `BRANCHES`: Mapping of branch codes to full names
- `BRANCH_ICONS`: Emoji icons for each branch
- `SEMESTERS`: Ordered list of semesters
- `SEMESTER_SUBJECTS`: Predefined subjects per semester/branch

### constants.js
Shared constants:
- `LABEL_COLORS`: Color schemes for note labels (Notes, PYQ, Important)

### notes.json
Array of note objects with structure:
```json
{
  "id": 1,
  "title": "Note Title",
  "fileUrl": "https://drive.google.com/file/d/FILE_ID/preview",
  "subject": "Subject Name",
  "semester": "Semester 3",
  "branch": "CSE",
  "label": "Notes"
}
```

### searchAliases.js
Maps common abbreviations to full subject names for enhanced search:
- Supports partial matches and prefix matching
- Covers First Year through Semester 7 subjects
- Branch-specific and common subject aliases

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

## Design System

### CSS Variables (index.css)
- **Colors**: Primary (blue), Accent (orange), Background, Surface, Sidebar
- **Typography**: Inter font family with responsive sizing
- **Layout**: Fixed header height, sidebar width, responsive breakpoints
- **Effects**: Transitions, shadows, border radius system

### Responsive Breakpoints
- Mobile: ≤768px (collapsible sidebar, touch-optimized)
- Desktop: >768px (persistent sidebar, hover interactions)

---

## Deployment

Deployed on **Netlify** with automatic builds from GitHub.

### Build Configuration
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Redirects:** All routes → `index.html` (SPA)

### Netlify Headers
- Security headers (X-Frame-Options, X-Content-Type-Options)
- Cache control for static assets (1 year for assets/images)
- Short cache for HTML (0 seconds for instant updates)
- SEO files caching (24 hours)

---

## Tech Stack

- **React 19.2.5** — UI framework with latest features
- **Vite 8.0.10** — Build tool and dev server for fast HMR
- **Vanilla CSS** — Custom design system with CSS variables (1250+ lines)
- **Inter** — Typography (Google Fonts)
- **Google Drive** — PDF hosting via iframe embeds
- **Abacus API** — Primary visitor counter
- **CountAPI** — Fallback visitor counter
- **Netlify** — Hosting and CI/CD
- **ESLint** — Code linting with React plugins

---

## SEO Features

- **Meta tags**: Dynamic title, description, keywords
- **Open Graph**: Social sharing optimization
- **Twitter Cards**: Twitter-specific sharing
- **Structured Data**: JSON-LD for WebSite and EducationalOrganization
- **Canonical URLs**: Prevent duplicate content issues
- **Robots.txt**: Search engine crawling instructions
- **Sitemap.xml**: Site structure for search engines

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `/` | Focus search input (when not in input field) |
| `Ctrl+B` / `Cmd+B` | Toggle sidebar |
| `Arrow Keys` | Navigate search results |
| `Enter` | Select search result |
| `Escape` | Close search dropdown |

---

## Performance Optimizations

- **Debounced search**: 150ms delay to reduce unnecessary computations
- **Memoized computations**: Navigation tree and search indexes cached
- **Lazy loading**: Components load only when needed
- **Static asset caching**: Aggressive caching for images/CSS/JS
- **Code splitting**: Automatic via Vite
- **Minification**: Production builds optimized automatically

---

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Fullscreen API support for PDF viewing

---

## Development

### Adding New Branches
1. Add branch code and name to `BRANCHES` in `branches.js`
2. Add icon to `BRANCH_ICONS`
3. Define semester subjects in `SEMESTER_SUBJECTS`
4. Add branch alias to `BRANCH_ALIASES` in `Search.jsx`

### Adding Search Aliases
1. Edit `src/data/searchAliases.js`
2. Add lowercase key with array of full subject names
3. Supports partial matching automatically

### Styling Guidelines
- Use CSS variables for colors and spacing
- Follow BEM-like naming convention
- Mobile-first responsive design
- Touch-friendly tap targets (≥44px)

---

## Author

Built by [Rishan Menezes](https://www.linkedin.com/in/rishan-menezes/)

- [Instagram](https://www.instagram.com/rizzshhan)
- [LinkedIn](https://www.linkedin.com/in/rishan-menezes/)

---

## License

This project is for educational purposes for MIT Mysore students.
