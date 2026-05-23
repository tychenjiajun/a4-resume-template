# A4 Resume Template

A printable A4 resume template with SCSS theming, automatic color palette generation, and a11y-compliant contrast ratios.

## Features

- **A4 Print-ready**: Exact 210mm × 297mm page size with proper `@page` and `@media print` styles
- **SCSS Color Palette**: Automatically generates a full color system from a single base color
- **A11y Compliant**: Compile-time SCSS checks + runtime axe-core scans ensure WCAG AA compliance
- **Smart Shade Selection**: Auto-selects optimal shades for each use case based on contrast requirements
- **Print Preview Mode**: Visit `?print` query parameter to preview print styles on screen
- **Integration Tests**: Playwright tests verify layout, ellipsis detection, and accessibility

## Quick Start

```bash
# Install dependencies
pnpm install

# Compile SCSS to CSS (if needed)
pnpm build:css

# Start local dev server
pnpm dev

# View resume at http://localhost:3000
# View print preview at http://localhost:3000/?print
```

## Testing

```bash
# Run all tests
pnpm test

# Run only a11y tests
pnpm test -- tests/a11y.spec.ts

# Run only layout tests
pnpm test -- tests/resume.spec.ts

# Run only screenshot tests
pnpm test -- tests/screenshots.spec.ts

# Run tests with UI
pnpm test:ui

# Debug tests
pnpm test:debug
```

### Test Coverage

**Layout Tests** (`tests/resume.spec.ts`):
- ✅ No text truncated by ellipsis (normal view)
- ✅ No text truncated by ellipsis (print preview mode)
- ✅ All resume sections are visible
- ✅ Header with name exists
- ✅ Contact information present
- ✅ Print preview class applied with `?print` query param
- ✅ No print preview class without `?print`

**Accessibility Tests** (`tests/a11y.spec.ts`):
- ✅ No WCAG A/AA violations (full page, normal view)
- ✅ No WCAG A/AA violations (full page, print preview)
- ✅ No WCAG A/AA violations in header section
- ✅ No WCAG A/AA violations in sidebar

**Screenshot Tests** (`tests/screenshots.spec.ts`):
- ✅ Page 1 screenshot (normal view)
- ✅ Page 2 screenshot (normal view)
- ✅ Page 1 screenshot (print preview)
- ✅ Page 2 screenshot (print preview)
- ✅ Full document screenshot (normal view)
- ✅ Full document screenshot (print preview)

Screenshots are saved to `screenshots/` and attached to test results.
Axe-core scan results are attached as JSON to each a11y test for debugging.

## Theming

### Change Base Color

Edit `styles/_palette.scss` and modify the `$primary-base` variable:

```scss
$primary-base: #1B4F72 !default;   // Change this to re-theme
```

The palette generator will:
1. Create 10 shades (50–900) from lightest to darkest
2. Generate neutral gray ramp
3. Auto-calculate text colors for each background
4. **Smart-select optimal shades** for each use case
5. Verify all combinations meet WCAG AA contrast at compile time

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
var(--color-primary-{shades}-on) /* Auto-calculated text color */

/* Semantic colors (auto-selected) */
var(--color-heading)      /* Best shade for headings */
var(--color-accent)       /* Best shade for accents */
var(--color-tag-bg)       /* Optimal light background */
var(--color-tag-text)     /* Contrasting text for tags */
var(--color-decoration)   /* For bullets, accents */
var(--color-decoration-muted) /* Subtle decorative elements */

/* Neutral palette */
var(--color-neutral-50) through var(--color-neutral-900)
var(--color-surface), var(--color-surface-raised)
var(--color-text-primary), var(--color-text-secondary), var(--color-text-muted)
var(--color-border), var(--color-divider)
```

## File Structure

```
a4-resume-template/
├── index.html              # Resume template (2 A4 pages)
├── package.json
├── playwright.config.js    # Playwright test configuration
├── styles/
│   ├── _palette.scss       # Color palette generator with a11y checks
│   ├── theme.scss          # Main theme styles
│   └── theme.css           # Compiled CSS
├── scripts/
│   └── main.js             # ?print query param handler
└── tests/
    ├── axe-test.ts         # Shared axe fixture for a11y tests
    ├── a11y.spec.ts        # Accessibility tests (axe-core)
    ├── resume.spec.ts      # Layout & integration tests
    └── screenshots.spec.ts  # Per-page screenshot capture
└── screenshots/            # Generated PNG screenshots (gitignored)
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

The template includes:
- **Header**: Name, contact info, metadata
- **Professional Summary**: Brief overview
- **Work Experience**: Job entries with responsibilities
- **Projects**: Notable projects with descriptions
- **Sidebar**: Education, Skills, Certifications, Languages

Add or remove sections as needed following the existing structure.

## Print Instructions

1. Open `http://localhost:3000` in browser
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows)
3. Select "Save as PDF" or your printer
4. Ensure "Background graphics" is enabled
5. Margins should be set to "None" (controlled by CSS)

## Browser Support

- Chrome/Edge (tested)
- Safari (via print dialog)
- Firefox (via print dialog)

## License

ISC