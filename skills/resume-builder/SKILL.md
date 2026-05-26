---
name: resume-builder
description: >-
  Interview users (grill-me style) to build JD-aligned, printable A4 resumes with SCSS theming and automatic color palettes. Asks one question at a time: first aligning experience to the job description, then pulling their narrative, then agreeing on sections and layout before editing. Use when user asks to "make resume", "create CV", "tailor my resume to a job", or wants a printable resume.
---

# Resume Builder

## Setup

```bash
cd <skill-dir>/scripts    # directory containing package.json
npm install
npx playwright install chromium
```

## Workflow

### 1. Interview & build

Interview the user one question at a time. Walk down each branch of the decision tree, resolving dependencies before moving on. For each question, provide your recommended answer based on what you've learned so far. Explore the codebase to verify constraints before making recommendations.

#### Phase A — Job alignment

Ask for the JD (paste or describe). Extract every explicit requirement — skills, experience, qualifications, traits. For each requirement, ask the user: *"Do you have experience with this? Tell me specifically what you did."* Map their answers to resume bullets. Flag gaps honestly — suggest ways to bridge them if possible.

Ask about: role, company/industry, seniority level, team size, tech stack, and any unwritten expectations (culture, pace, domain expertise).

#### Phase B — Their story

Pull the threads: what makes them different? Career pivots or connecting themes? Achievements they're proud of? Red flags they're worried about (gaps, short stints, career changes)? Don't let them settle for safe answers — drill until you find a narrative that stands out.

Ask: *"What would your past manager say you're unreasonably good at?"* and *"What part of this job would make you the most nervous?"*

#### Phase C — Sections & layout

Before editing any file, agree on structure. Ask one decision at a time:

1. **Layout**: single-column or two-column (main + sidebar)? Recommend based on experience level — two-column for mid/senior (sidebar for skills/certs), single-column for early-career or research CVs.
2. **Sections to include** (pick from: header, summary, work experience, skills, education, certs, languages, projects, publications, volunteering, interests). Recommend based on the JD — drop what the job doesn't care about.
3. **Section order**: what goes first after the header? Recommend putting the most JD-aligned content highest.

Only after the user confirms all three decisions, begin editing `index.html`.

#### Editing rules

Start from `index.html` — it's a template, not a contract. You can freely edit anything: add/remove sections, tweak the SCSS in `styles/`, adjust font sizes and spacing in `theme.scss`, restructure the grid layout, or modify the color palette.

**Layout flexibility**: the default two-column layout (main + sidebar) is not mandatory. If a single-column or alternative layout better suits the content, restructure the HTML and SCSS accordingly. Adjust `--sidebar-width` in `styles/_palette.scss` to resize the sidebar column, or remove `.resume-grid` entirely for a single-column page. See [REFERENCE.md](REFERENCE.md) for CSS classes.

The only constraint is to follow the workflow (build → theme → verify → preview).

### 2. Theme

Edit `$primary-base` in `styles/_palette.scss`, then:

```bash
npm run build:css
```

Pick any hex color — the compiler auto-generates a full palette and rejects combinations that fail contrast requirements. If it errors, try a darker or more saturated variant.

For iterative theming, use watch mode to auto-compile on changes:

```bash
npm run watch:css
```

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

**When tests fail after editing content** — update test expectations to match the new layout:

- `resume.spec.ts` — update the section count (`toHaveLength(0)` for ellipsis, `toBeGreaterThanOrEqual(N)` for section count) to match your actual number of sections.
- `blank-space.spec.ts` — adjust thresholds at the top (`MIN_PAGE1_USAGE_RATIO`, `MAX_BOTTOM_WHITESPACE_PX`, etc.) if your page is sparse or extra-dense. Run `npm test -- tests/blank-space.spec.ts` and read the logged metrics to calibrate.
- `screenshots.spec.ts` — run `npm test -- tests/screenshots.spec.ts --update-snapshots` to refresh visual baselines.
- `overflow.spec.ts` & `a11y.spec.ts` — should pass regardless; investigate any failures as real layout/accessibility bugs.

Do not blindly lower thresholds — first check if the layout can be tightened. When the page is intentionally sparse (e.g., a short second page), relax thresholds to match reality.

### 4. Preview

```bash
npm run dev
```

- Normal: `http://localhost:3000`
- Print preview: `http://localhost:3000/?print`
- Save as PDF: `Cmd+P` → "Save as PDF" → enable "Background graphics" → margins "None"
