---
name: resume-builder
description: Interview users to build printable A4 resumes with SCSS theming and automatic color palettes. Use when user asks to "make resume", "create CV", or wants a printable resume.
---

# Resume Builder

## Setup

```bash
cd <skill-dir>    # directory containing this SKILL.md
npm install
npx playwright install chromium
```

## Workflow

### 1. Interview & build

Help the user know themselves and the target job. Explore these angles — adapt order and depth to what they already know:

**The target:** role, company/industry, seniority, what the job actually needs (ask for the JD). Identify which of the user's experience maps to each requirement, and where the gaps are.

**Their story:** what makes them different? Career pivots or connecting threads? Any red flags they're worried about? Pull threads until you find the narrative.

**Sections** — after exploring each area, edit `index.html` directly. Common sections: header, summary, work experience, skills, education, certs, languages, projects. Add, remove, or reorder freely.

Start from `index.html` — it's a template, not a contract. See [REFERENCE.md](REFERENCE.md) for CSS classes.

### 2. Theme

Edit `$primary-base` in `styles/_palette.scss`, then:

```bash
npm run build:css
```

Pick any hex color — the compiler auto-generates a full palette and rejects combinations that fail contrast requirements. If it errors, try a darker or more saturated variant.

### 3. Verify

Tests run inside `scripts/`:

```bash
cd scripts
npm test                      # all tests
npm test -- tests/resume.spec.ts       # layout only
npm test -- tests/a11y.spec.ts         # a11y only
npm test -- tests/screenshots.spec.ts  # screenshots only
npm test -- tests/overflow.spec.ts     # overflow only
npm test -- tests/blank-space.spec.ts  # blank space only
```

Tests check for layout issues (overflow, truncation, blank space), accessibility, and visual output.

### 4. Preview

```bash
npm run dev
```

- Normal: `http://localhost:3000`
- Print preview: `http://localhost:3000/?print`
- Save as PDF: `Cmd+P` → "Save as PDF" → enable "Background graphics" → margins "None"
