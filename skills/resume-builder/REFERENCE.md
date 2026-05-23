# Resume Builder — Reference

## CSS Classes

Read `index.html` for the current structure. Mix and match these classes — you're not limited to the template.

### Page & Layout

| Class | Purpose |
|-------|---------|
| `.resume-page` | A4 page (210×297mm), use 1–3 |
| `.resume-grid` | Two-column grid (1fr + 220px sidebar) |
| `.resume-header` | Full-width header row |
| `.resume-main` | Main content column |
| `.resume-sidebar` | Sidebar column |

### Header

| Class | Purpose |
|-------|---------|
| `.header` | Header block with accent border |
| `.header-name` | Name (1.5rem, bold) |
| `.header-meta` | Metadata row |
| `.header-contact` | Contact links |

### Sections

| Class | Purpose |
|-------|---------|
| `.section` | Content section |
| `.section-title` | Section heading with accent bar |
| `.summary-text` | Summary paragraph |

### Entries (Work / Projects)

| Class | Purpose |
|-------|---------|
| `.entry` | Work/project block |
| `.entry--compact` | Smaller variant for page 2+ |
| `.entry-header` | Flex row: org + dates |
| `.entry-org` | Company/project name |
| `.entry-dates` | Date range |
| `.entry-role` | Job title (accent color) |
| `.entry-desc` | Description paragraph |
| `.entry-duties` | Bullet list with nested sub-bullets |

### Sidebar

| Class | Purpose |
|-------|---------|
| `.sidebar` | Flex column for cards |
| `.sidebar-card` | Card with neutral bg |
| `.sidebar-title` | Card heading |
| `.sidebar-text` | Card body text |

### Tags & Extras

| Class | Purpose |
|-------|---------|
| `.tags` / `.tag` | Skill tags |
| `.highlights` | Diamond-bulleted list |
| `.no-clip` | Force visible overflow |

## Commands

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Compile SCSS | `pnpm build:css` |
| Dev server | `pnpm dev` |
| Run tests | `pnpm test` |
| Update screenshots | `pnpm test -- --update-snapshots` |

## Theming

Edit `$primary-base` in `styles/_palette.scss`. Start with a hex — the compiler generates 10 shades, auto-selects the best for each use case, and errors if contrast fails.

Rough heuristics: tech → blues, finance → navy, creative → warm tones, healthcare → teal. Or match the user's brand color.
