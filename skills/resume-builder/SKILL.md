---
name: resume-builder
description: Generate printable A4 resume/CV from user-provided experience data. Use when user asks to "make resume", "create CV", "build resume based on my experience", or wants a printable resume document.
---

# Resume Builder

Generate professional A4 resumes from user experience data with WCAG AA accessibility compliance.

## Quick Start

Typical usage: `make resume based on my experience <content>`

**5-step workflow:**

1. **Setup** — Clone and install dependencies
2. **Theme** — Choose color, configure SCSS
3. **Content** — Write HTML with user data
4. **Verify** — Run tests, check screenshots
5. **Preview** — Start server for user review

## Workflow Details

### Step 1: Project Setup

```bash
git clone https://github.com/tychenjiajun/a4-resume-template.git
cd a4-resume-template
pnpm install
```

Verify structure:
- `styles/_palette.scss` — Color palette generator
- `styles/theme.scss` — Layout styles
- `index.html` — Resume template (2 A4 pages)
- `tests/` — Integration + a11y tests

### Step 2: Choose Theme Color

1. **Analyze user content** — Industry, tone, personal brand
2. **Select base color** — Edit `styles/_palette.scss`:

```scss
// Change this line:
$primary-base: #1B4F72 !default;  // Deep navy (financial/professional)

// Options by industry:
// Tech/Startup:     #2563EB (blue), #059669 (green)
// Finance/Legal:    #1B4F72 (navy), #7C3AED (purple)
// Creative/Design:  #DC2626 (red), #D97706 (orange)
// Healthcare:       #0891B2 (teal), #4F46E5 (indigo)
// Academia:         #6B7280 (gray), #374151 (dark gray)
```

3. **Compile SCSS** — `pnpm build:css`

The palette auto-generates 10 shades (50–900) with a11y contrast verification at compile time.

### Step 3: Write HTML Content

Edit `index.html` with user's experience data:

**Structure (2-page A4):**

```html
<!-- Page 1: Header + Main content -->
<div class="resume-page">
  <header class="header">
    <h1 class="header-name">User Name</h1>
    <div class="header-meta">
      <span>Location</span>
      <span>Years of Experience</span>
    </div>
    <div class="header-contact">
      <a href="tel:...">📞 Phone</a>
      <a href="mailto:...">✉️ Email</a>
      <a href="...">🔗 LinkedIn/Portfolio</a>
    </div>
  </header>
  
  <main class="resume-main">
    <section class="section">
      <h2 class="section-title">Professional Summary</h2>
      <p>...</p>
    </section>
    
    <section class="section">
      <h2 class="section-title">Work Experience</h2>
      <div class="entry">
        <div class="entry-header">
          <span class="entry-org">Company</span>
          <span class="entry-dates">YYYY–YYYY</span>
        </div>
        <div class="entry-role">Job Title</div>
        <ul class="entry-duties">
          <li>Responsibility 1</li>
          <li>Responsibility 2</li>
        </ul>
      </div>
    </section>
  </main>
  
  <aside class="resume-sidebar">
    <div class="sidebar-card">
      <h3 class="sidebar-title">Education</h3>
      <p class="sidebar-text">...</p>
    </div>
    <div class="sidebar-card">
      <h3 class="sidebar-title">Skills</h3>
      <div class="tags">
        <span class="tag">Skill 1</span>
        <span class="tag">Skill 2</span>
      </div>
    </div>
  </aside>
</div>

<!-- Page 2: Projects/Additional experience -->
<div class="resume-page">
  <section class="section">
    <h2 class="section-title">Projects</h2>
    ...
  </section>
</div>
```

**Content checklist:**
- [ ] Name, contact, location in header
- [ ] Professional summary (3–5 sentences)
- [ ] Work experience (most recent first)
- [ ] Education, certifications, skills in sidebar
- [ ] Projects (if applicable) on page 2

### Step 4: Verify with Tests

```bash
pnpm test
```

**Test suite (17 tests):**
- Layout: No ellipsis truncation, all sections visible
- A11y: WCAG A/AA violations (axe-core)
- Screenshots: Page 1, Page 2 (normal + print mode)

**If tests fail:**
- Contrast errors → Use darker shade in SCSS
- Ellipsis truncation → Reduce content or adjust spacing
- Missing sections → Check HTML structure

### Step 4b: Visual Review (Multimodal)

If agent has vision capabilities:

```bash
# Screenshots saved to screenshots/
ls screenshots/
# page-1-normal.png, page-2-normal.png
# page-1-print-preview.png, page-2-print-preview.png
```

Check:
- [ ] No text overflow/clipping
- [ ] Balanced layout (columns, spacing)
- [ ] Consistent styling
- [ ] Readable at print scale

### Step 5: Preview for User

```bash
pnpm dev
# Server running at http://localhost:3000
```

Open browser for user:
- Normal view: `http://localhost:3000`
- Print preview: `http://localhost:3000/?print`

**Print instructions for user:**
1. Press `Cmd+P` (Mac) / `Ctrl+P` (Windows)
2. Select "Save as PDF" or printer
3. Enable "Background graphics"
4. Set margins to "None" (CSS handles this)

## Color Selection Guide

| Industry/Tone | Suggested Base Color | Notes |
|--------------|---------------------|-------|
| Tech/Startup | `#2563EB` (blue) | Modern, trustworthy |
| Finance | `#1B4F72` (navy) | Professional, conservative |
| Creative | `#DC2626` (red) | Bold, distinctive |
| Healthcare | `#0891B2` (teal) | Calming, clean |
| Academia | `#6B7280` (gray) | Neutral, scholarly |
| Legal | `#374151` (dark gray) | Formal, serious |

All colors auto-generate a11y-compliant shades — no manual contrast calculation needed.

## Common Issues

| Issue | Solution |
|-------|----------|
| Text truncated | Reduce content length or increase spacing |
| Low contrast | SCSS compile will error — use darker shade |
| Wrong page break | Move content between `.resume-page` divs |
| Missing on print | Check `@media print` styles |

## File Reference

| File | Purpose |
|------|---------|
| `styles/_palette.scss` | Color generation, a11y checks |
| `styles/theme.scss` | Layout, typography, print styles |
| `index.html` | Resume content |
| `tests/resume.spec.ts` | Layout tests |
| `tests/a11y.spec.ts` | Accessibility tests |
| `tests/screenshots.spec.ts` | Visual capture |