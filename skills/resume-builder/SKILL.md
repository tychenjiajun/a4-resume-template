---
name: resume-builder
description: Build printable A4 resumes with SCSS theming, automatic color palettes, and WCAG AA a11y compliance. Use when user asks to "make resume", "create CV", "build resume based on my experience", or wants a printable resume with accessibility verification.
---

# Resume Builder

Interview the user to build a 1–3 page A4 resume, then verify with automated tests.

## Quick Start

Typical usage: `make a resume based on my experience`

## Workflow

### 1. Detect or Setup

Check if `index.html` exists in the current directory. If yes, skip clone and run `pnpm install`. If not:

```bash
git clone https://github.com/tychenjiajun/a4-resume-template.git
cd a4-resume-template
pnpm install
```

### 2. Read the Template

Read `index.html` — this is the starting point. It contains placeholder content with the project's HTML structure and CSS classes. You are **not** limited to this exact layout. Add, remove, or reorder sections, blocks, and classes to fit the user's needs. See [REFERENCE.md](REFERENCE.md) for the full CSS class toolkit and interview templates.

Key layout primitives:
- `.resume-page` — each A4 page (1–3 of these)
- `.resume-grid` + `.resume-main` + `.resume-sidebar` — two-column page 1 layout
- `.entry` / `.entry--compact` — work experience or project entries
- `.sidebar-card` / `.tags` / `.tag` — sidebar content and skill tags
- `.highlights` / `.expectation-status` / `.section` — additional block types

### 3. Interview the User (Priority-first)

Interview one section at a time. For each section, ask structured questions in order, adapt follow-ups based on responses. See [REFERENCE.md](REFERENCE.md) for full question templates.

**Order:**
1. **Work Experience** — most impactful; org, dates, title, 3–5 quantified bullet points per role
2. **Skills** — language/framework/tool tags
3. **Professional Summary** — synthesize from experience above
4. **Header** — name, location, contact links, years of experience
5. **Education, Certifications, Languages** — quick rounds
6. **Projects** — page 2+ content (skip if ≤1 page)

After each section, edit `index.html` with the user's answers. Offer multiple-choice options where sensible (e.g., resume tone, tag groupings).

### 4. Choose Theme

Analyze the user's industry, role, and tone. Select a base hex color using the heuristics in [REFERENCE.md](REFERENCE.md#color-selection-heuristics), or match their brand/company color. Edit `$primary-base` in `styles/_palette.scss`, then:

```bash
pnpm build:css
```

The SCSS compiler will error if any color combination fails WCAG AA (4.5:1 contrast) — this is the safety net. If compilation fails, pick a darker or more saturated variant and retry.

### 5. Verify

```bash
pnpm test
```

**Test coverage:**
- Ellipsis truncation detection (normal + print mode)
- All sections visible, header + contact present
- WCAG A/AA a11y violations (axe-core, 4 scan targets)
- Screenshot capture (6 screenshots)

**On failure:**
- **Auto-fix** without asking: missing sections, print-preview class, SCSS recompile, screenshot baselines
- **Ask user** before changing: truncation fixes (reword or shorten), contrast adjustments (darker shade vs. lighter text), content rebalancing across pages

Re-verify after fixes until green.

### 6. Visual Review & Handoff

Screenshots are saved to `screenshots/`. If you have vision, inspect them for:
- Balanced columns and spacing
- No orphaned content
- Readable font sizes at print scale

Start the dev server:

```bash
pnpm dev
```

Tell the user:
- **Live preview**: `http://localhost:3000` (normal) or `http://localhost:3000/?print` (print preview)
- **Save as PDF**: `Cmd+P` / `Ctrl+P` → "Save as PDF" → enable "Background graphics" → margins "None"
- **Source file**: `index.html` (ready to edit or print)

## Reference

See [REFERENCE.md](REFERENCE.md) for CSS class toolkit, interview question templates, color selection details, and troubleshooting.
