# A4 Resume Template

A printable 1–3 page A4 resume template with SCSS theming, automatic color palette generation, a11y-compliant contrast ratios, and an AI agent skill for automatic resume generation.

## Features

- **A4 Print-ready**: Exact 210mm × 297mm page size with proper `@page` and `@media print` styles
- **Flexible Layout**: 1–3 pages with composable CSS classes — adapt sections to fit your content
- **SCSS Color Palette**: Automatically generates a full 10-shade color system from a single base color
- **A11y Compliant**: Compile-time SCSS checks + runtime axe-core scans ensure WCAG AA compliance
- **Smart Shade Selection**: Auto-selects optimal shades for each use case based on contrast requirements
- **Print Preview Mode**: Add `?print` query parameter to preview print styles on screen
- **Integration Tests**: Playwright tests verify layout, ellipsis detection, and accessibility
- **Agent Skill**: Built-in skill for AI coding agents to interview users and generate verified resumes

## Agent Skill

This project includes a skill for AI coding agents to generate resumes conversationally:

```
skills/resume-builder/
├── SKILL.md       # Agent workflow: interview → theme → verify → handoff
└── REFERENCE.md   # CSS class toolkit, question templates, color heuristics
```

**Usage:** `make a resume based on my experience`

The skill guides agents through an interactive process:
1. Detect or clone the project, install dependencies
2. Read `index.html` as the starting template — agents can freely add, remove, or reorder sections
3. Interview the user section-by-section (priority-first: Experience → Skills → Summary → Header → Education → Projects)
4. Select a theme color based on user's industry and tone
5. Run tests to verify layout, accessibility, and visual output
6. Start dev server for live preview and PDF export

See [skills/resume-builder/SKILL.md](skills/resume-builder/SKILL.md) for the full agent workflow and [skills/resume-builder/REFERENCE.md](skills/resume-builder/REFERENCE.md) for the CSS class toolkit.

## Quick Start

```bash
# Install dependencies
pnpm install

# Compile SCSS to CSS (only needed if you changed the theme color)
pnpm build:css

# Start local dev server
pnpm dev

# View resume at http://localhost:3000
# View print preview at http://localhost:3000/?print
```

## Testing

```bash
# Run all tests (34 tests)
pnpm test

# Run only a11y tests
pnpm test -- tests/a11y.spec.ts

# Run only layout tests
pnpm test -- tests/resume.spec.ts

# Run only screenshot tests
pnpm test -- tests/screenshots.spec.ts

# Update screenshot baselines after visual changes
pnpm test -- --update-snapshots

# Run tests with UI
pnpm test:ui

# Debug tests
pnpm test:debug
```

## Test Coverage

**Layout Tests** (`tests/resume.spec.ts`):
- ✅ No text truncated by ellipsis (normal view)
- ✅ No text truncated by ellipsis (print preview mode)
- ✅ All resume sections are visible
- ✅ Header with name exists
- ✅ Contact information present
- ✅ Print preview class applied with `?print` query param
- ✅ No print preview class without `?print`

**Overflow Tests** (`tests/overflow.spec.ts`):
- ✅ No horizontal overflow on any A4 page (normal view)
- ✅ No vertical overflow on any A4 page (normal view)
- ✅ No horizontal overflow on any A4 page (print preview)
- ✅ No vertical overflow on any A4 page (print preview)
- ✅ Each `.resume-page` is exactly 210mm × 297mm

**Blank Space Tests** (`tests/blank-space.spec.ts`):
- ✅ Page 1 uses ≥60% of available height, pages 2+ use ≥30%
- ✅ Sidebar column ≥40% of main column height
- ✅ Bottom whitespace ≤400px on well-filled pages
- ✅ Pages 2+ start content within 100px of page top
- ✅ No gaps >60px between adjacent sections
- ✅ No sidebar cards <30% filled

**Accessibility Tests** (`tests/a11y.spec.ts`):
- ✅ No WCAG A/AA/AAA violations (full page, normal view)
- ✅ No WCAG A/AA/AAA violations (full page, print preview)
- ✅ No WCAG A/AA/AAA violations in header section
- ✅ No WCAG A/AA/AAA violations in sidebar

**Screenshot Tests** (`tests/screenshots.spec.ts`):
- ✅ Page 1 screenshot (normal view)
- ✅ Page 2 screenshot (normal view)
- ✅ Page 1 screenshot (print preview)
- ✅ Page 2 screenshot (print preview)
- ✅ Full document screenshot (normal view)
- ✅ Full document screenshot (print preview)

Screenshots are saved to `screenshots/` and attached to test results. Axe-core scan results are attached as JSON to each a11y test for debugging.

## Theming

### Change Base Color

Edit `styles/_palette.scss` and modify the `$primary-base` variable, then recompile:

```scss
$primary-base: #1B4F72 !default;   // Change this to re-theme
```

```bash
pnpm build:css
```

The palette generator will:
1. Create 10 shades (50–900) from lightest to darkest
2. Generate neutral gray ramp
3. Auto-calculate text colors for each background
4. **Smart-select optimal shades** for each use case
5. Verify all combinations meet WCAG AA contrast — compile will fail if any check fails

### Smart Shade Selection

The theme automatically selects the best shades for each context:

| Use Case | Function | Result |
|----------|----------|--------|
| Text on light bg | `select-text-shade()` | `primary-500` (or darker if needed) |
| Light backgrounds | `select-bg-shade()` | `primary-50` (with dark text) |
| Dark backgrounds | `select-bg-shade-light()` | Darkest shade that supports white text |
| Decorative elements | Auto-paired | Matching complementary shades |

All selections are verified at compile-time to meet 4.5:1 contrast requirements.

### Available Color Variables

```css
/* Primary palette */
var(--color-primary-50) through var(--color-primary-900)
var(--color-primary-{shade}-on) /* Auto-calculated text color */

/* Semantic colors (auto-selected) */
var(--color-heading)              /* Best shade for headings */
var(--color-accent)               /* Best shade for accents */
var(--color-tag-bg)               /* Optimal light background */
var(--color-tag-text)             /* Contrasting text for tags */
var(--color-decoration)           /* For bullets, accents */
var(--color-decoration-muted)     /* Subtle decorative elements */

/* Neutral palette */
var(--color-neutral-50) through var(--color-neutral-900)
var(--color-surface), var(--color-surface-raised)
var(--color-text-primary), var(--color-text-secondary), var(--color-text-muted)
var(--color-border), var(--color-divider)
```

## CSS Classes

The template provides composable CSS classes. Read `index.html` for the current layout, then freely compose these classes to build 1–3 page resumes:

| Category | Classes |
|----------|---------|
| **Page & Layout** | `.resume-page`, `.resume-grid`, `.resume-header`, `.resume-main`, `.resume-sidebar` |
| **Header** | `.header`, `.header-name`, `.header-meta`, `.header-contact` |
| **Sections** | `.section`, `.section-title`, `.summary-text` |
| **Entries** | `.entry`, `.entry--compact`, `.entry-header`, `.entry-org`, `.entry-dates`, `.entry-role`, `.entry-desc`, `.entry-duties` |
| **Sidebar** | `.sidebar`, `.sidebar-card`, `.sidebar-title`, `.sidebar-text` |
| **Tags** | `.tags`, `.tag` |
| **Optional** | `.highlights`, `.expectation-status`, `.expectation-info` |
| **Utility** | `.no-clip`, `.print-preview` |

Full class reference: [skills/resume-builder/REFERENCE.md](skills/resume-builder/REFERENCE.md)

## File Structure

```
a4-resume-template/
├── index.html                 # Resume content (starting template)
├── AGENTS.md                  # Agent instructions for AI coding assistants
├── package.json
├── playwright.config.js       # Playwright test configuration

├── styles/
│   ├── _palette.scss          # Color palette generator with a11y checks
│   ├── theme.scss             # Layout, typography, components, print styles
│   └── theme.css              # Compiled CSS (gitignored)
├── scripts/
│   └── main.js                # ?print query param handler
├── skills/
│   └── resume-builder/
│       ├── SKILL.md           # Agent skill workflow
│       └── REFERENCE.md       # CSS class toolkit, interview templates, color heuristics
└── tests/
    ├── axe-test.ts            # Shared axe fixture for a11y tests
    ├── a11y.spec.ts           # Accessibility tests (axe-core)
    ├── resume.spec.ts         # Layout & integration tests
    └── screenshots.spec.ts    # Per-page screenshot capture
└── screenshots/               # Generated PNG screenshots (gitignored)
```

## Customization

### Personal Information

Edit `index.html` to add your information:

```html
<h1 class="header-name">Your Name</h1>
<div class="header-meta">
  <span>Location</span>
  <span>Years of Experience</span>
</div>
<div class="header-contact">
  <a href="tel:+1234567890">📞 +1 234 567 890</a>
  <a href="mailto:your.email@example.com">✉️ your.email@example.com</a>
</div>
```

### Sections

Available sections (add or remove as needed):
- **Header**: Name, contact info, metadata
- **Professional Summary**: Brief career overview
- **Work Experience**: Job entries with quantified achievements
- **Highlights**: Key strengths or accomplishments
- **Sidebar**: Education, Skills, Certifications, Languages
- **Projects**: Notable projects (page 2+)
- **Additional Information**: Publications, awards, volunteer work, interests

### Page Count

The template supports 1–3 A4 pages. Each `.resume-page` div represents one page. Add or remove pages to match your content length. The CSS automatically handles page breaks for printing.

## Print Instructions

1. Open `http://localhost:3000` (normal) or `http://localhost:3000/?print` (print preview)
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux)
3. Select "Save as PDF" or printer
4. Enable "Background graphics"
5. Set margins to "None" (CSS handles margins)

## Browser Support

- Chrome/Edge (tested)
- Safari (via print dialog)
- Firefox (via print dialog)

## License

MIT
