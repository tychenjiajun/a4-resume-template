# Resume Builder — Reference

## CSS Class Toolkit

These classes are defined in `styles/theme.scss`. Read `index.html` for the current template structure, then freely compose these classes to build the resume. You are not limited to the existing layout — add, remove, or nest blocks as needed.

### Page & Layout

| Class | Purpose |
|-------|---------|
| `.resume-page` | A4 page container (210×297mm, page-break-after) — use 1–3 |
| `.resume-grid` | Two-column grid for page 1 (1fr + 220px sidebar) |
| `.resume-header` | Full-width header row (grid-column: 1 / -1) |
| `.resume-main` | Main content column |
| `.resume-sidebar` | Sidebar column |

### Header

| Class | Purpose |
|-------|---------|
| `.header` | Header block with bottom accent border |
| `.header-name` | Name (1.5rem, bold, heading color) |
| `.header-meta` | Metadata row: location, experience, education level |
| `.header-contact` | Contact links row (tel, mailto, URLs) |

### Sections

| Class | Purpose |
|-------|---------|
| `.section` | Content section with bottom margin |
| `.section-title` | Section heading (1.125rem, accent bar ::before, divider border) |
| `.summary-text` | Professional summary paragraph |

### Entries (Work / Projects)

| Class | Purpose |
|-------|---------|
| `.entry` | Work experience or project block |
| `.entry--compact` | Smaller variant for page 2+ (reduced font sizes) |
| `.entry-header` | Flex row: org name + dates |
| `.entry-org` | Company/project name (1rem, semibold) |
| `.entry-dates` | Date range (0.6875rem, muted, nowrap) |
| `.entry-role` | Job title (0.75rem, accent color, medium) |
| `.entry-desc` | Description paragraph or key-value block (0.75rem) |
| `.entry-duties` | Bullet list with • markers and nested ◦ sub-bullets |

### Sidebar

| Class | Purpose |
|-------|---------|
| `.sidebar` | Flex column container for sidebar cards |
| `.sidebar-card` | Card with neutral-50 background, border-radius, padding |
| `.sidebar-title` | Card heading (0.75rem, heading color, divider border) |
| `.sidebar-text` | Card body text (0.6875rem, secondary color) |

### Tags

| Class | Purpose |
|-------|---------|
| `.tags` | Flex-wrap container for tag elements |
| `.tag` | Inline tag with auto-selected bg/text colors, border-radius |

### Optional Blocks

| Class | Purpose |
|-------|---------|
| `.highlights` | Diamond-bulleted (✦) list for strengths/achievements |
| `.expectation-status` | Badge-style status pill (e.g., "🟢 Open to opportunities") |
| `.expectation-info` | Secondary text below expectation status |
| `.no-clip` | Utility: force visible overflow on any element |

### Print & Preview

| Class | Purpose |
|-------|---------|
| `.print-preview` | Body class added by `scripts/main.js` when URL has `?print` |

## Interview Templates

Conduct interviews section by section in this priority order. For each section, ask the template questions in sequence. If the user gives extra detail, skip redundant questions. If they lack a field, note it as a gap and move on.

### 1. Work Experience (highest priority)

For each role (most recent first):

| Field | Question | Options |
|-------|----------|---------|
| Company | "Which company were you at?" | — |
| Dates | "When did you work there?" | Use `YYYY/MM` format |
| Title | "What was your job title?" | — |
| Duties | "What were your main responsibilities?" | — |
| Achievements | "Any quantifiable achievements?" | Prompt: revenue impact, team size, performance improvements |
| Tech used | "What technologies or tools did you use?" | Offer to auto-extract from description |
| Gaps | If gap >6 months: "What were you doing during this period?" | Freelance, sabbatical, study, personal projects |

Target 2–4 roles. For early-career users, include internships and significant academic projects.

### 2. Skills

| Field | Question | Options |
|-------|----------|---------|
| Languages | "Which programming/spoken languages?" | Offer groupings: Frontend, Backend, Data, DevOps, etc. |
| Frameworks | "Any frameworks or libraries?" | — |
| Tools | "What tools do you use regularly?" | Git, Docker, CI/CD, editors, design tools |
| Proficiency | "How would you rate your proficiency?" | Expert / Proficient / Familiar |

### 3. Professional Summary

Synthesize from collected experience. Offer the user 2–3 tone options:

| Tone | Example |
|------|---------|
| **Results-driven** | "Results-driven {role} with {N} years of experience delivering {key outcome}..." |
| **Technical** | "{Role} specializing in {stack} with a track record of {key achievement}..." |
| **Narrative** | "I build {what you build} at {where}. Over {N} years I've {key trajectory}..." |

### 4. Header

| Field | Question | Format |
|-------|----------|--------|
| Name | "Full name for the resume?" | — |
| Location | "Where are you based?" | City, Country |
| Experience | "How many years of experience?" | "N+ years" |
| Education level | "Highest degree earned?" | e.g., "M.S. Computer Science" |
| Phone | "Contact phone number?" | +1 234 567 890 |
| Email | "Email address?" | — |
| LinkedIn | "LinkedIn profile URL?" | Full URL |
| GitHub | "GitHub profile URL?" | Optional |

### 5. Education

| Field | Question | Format |
|-------|----------|--------|
| University | "Which university?" | — |
| Degree | "What degree?" | B.S. / M.S. / Ph.D. |
| Field | "Field of study?" | — |
| Dates | "Graduation date?" | YYYY/MM |

### 6. Certifications

| Field | Question |
|-------|----------|
| Name | "Any certifications you'd like to list?" |
| Issuer | Optional |

### 7. Languages

| Field | Question | Options |
|-------|----------|---------|
| Language | "Which languages do you speak?" | — |
| Proficiency | "Proficiency level?" | Native / Fluent / Professional / Basic |

### 8. Projects (Page 2+)

For each project:

| Field | Question |
|-------|----------|
| Name | "Project name?" |
| Dates | "When did you work on it?" |
| Description | "What does it do and who uses it?" |
| Role | "What was your role?" |
| Technologies | "What stack did you use?" |
| Outcome | "What was the result or impact?" |

Target 2–3 projects. If the user has none, skip extra pages or fill with publications/awards.

## Color Selection Heuristics

The template generates a full 10-shade palette from any base hex. The SCSS compiler auto-selects optimal shades for headings, tags, backgrounds, and decorations — and rejects any combination that fails WCAG AA.

### Choosing a base color

Use these ranges as a starting point, then adjust based on user preference:

| Industry | Hue Range | Saturation | Lightness | Notes |
|----------|-----------|------------|-----------|-------|
| Tech | 210–220 | 60–90% | 40–50% | Blue conveys trust, modernity |
| Finance | 200–220 | 40–80% | 20–35% | Navy/dark blue = conservative, authoritative |
| Legal | 200–210 | 15–30% | 25–35% | Desaturated = formal, serious |
| Creative | 0–30 | 70–90% | 35–45% | Warm red-orange = bold, energetic |
| Healthcare | 170–190 | 50–80% | 25–35% | Teal/cyan = calm, clinical |
| Academia | 200–210 | 10–25% | 30–40% | Cool gray = neutral, scholarly |
| Government | 210–230 | 30–50% | 30–40% | Muted blue = official, stable |
| Non-profit | 140–170 | 40–60% | 30–40% | Green = growth, community |

### What the compiler checks

At `pnpm build:css`, Sass verifies ALL of these:
- Heading/accent text on white background ≥ 4.5:1
- Tag text on tag background ≥ 4.5:1
- Body text on surface background ≥ 4.5:1
- Body text on white background ≥ 4.5:1

If any check fails, Sass throws an `@error`. Use a darker or more saturated variant and rebuild.

### Brands and specific colors

If the user has a brand color, use it directly. If it's too light (e.g., pastel), find the nearest hue with higher saturation and lower lightness. The compiler is the safety net.

## Test Failure Guide

### Auto-fix (resolve without asking)

| Failure | Fix |
|---------|-----|
| Missing `.print-preview` class on `?print` | Verify `scripts/main.js` is loaded, check URL handler |
| Section count < 6 | Ensure all required sections are in HTML |
| Header name empty | Populate `.header-name` with user's name |
| Contact links < 2 | Add email + phone or LinkedIn |
| SCSS compile error (a11y) | Darken or saturate `$primary-base`, recompile |
| Screenshot diffs (structural only) | Update baselines with `pnpm test -- --update-snapshots` |

### Ask user before fixing

| Failure | Suggested options |
|---------|-------------------|
| Ellipsis truncation (content overflow) | "The following {N} lines are truncated. Should I rephrase, split into multiple bullets, or remove?" |
| A11y violation not caught at compile time | Rare — report the element and ask which shade to adjust |
| Page overflow (content exceeds last page) | "Content exceeds {N} pages. Should I reduce content, shorten descriptions, or add another page?" |

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `pnpm: command not found` | pnpm not installed | Install via `npm install -g pnpm` or `corepack enable` |
| `sass: command not found` | Dependencies not installed | Run `pnpm install` |
| SCSS compile error | Color contrast < 4.5:1 | Use darker/more saturated base color |
| Playwright browser missing | First run | `npx playwright install chromium` |
| Text clipped in sidebar | Too many tags or long text | Reduce tags, shorten text, or use abbreviations |
| Wrong page break | Content split between pages | Move content between `.resume-page` containers |
| Fonts not loading | No internet or CORS | Fonts load from Google Fonts CDN; requires network or pre-install locally |

## File Map

| File | Purpose |
|------|---------|
| `index.html` | Resume content — read this as the starting template |
| `styles/_palette.scss` | Base color + palette generator + a11y assertions |
| `styles/theme.scss` | Layout, typography, components, print styles |
| `styles/theme.css` | Compiled output (gitignored, generated by `pnpm build:css`) |
| `scripts/main.js` | `?print` query param handler |
| `tests/resume.spec.ts` | Layout: ellipsis detection, section visibility |
| `tests/a11y.spec.ts` | axe-core WCAG A/AA scans |
| `tests/screenshots.spec.ts` | Per-page screenshot capture |
| `tests/axe-test.ts` | Shared axe fixture |
| `playwright.config.js` | Playwright configuration |
| `screenshots/` | Generated PNGs (gitignored) |

## Print Instructions

1. Open `http://localhost:3000` (normal) or `http://localhost:3000/?print` (print preview)
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux)
3. Select "Save as PDF" or printer
4. Enable "Background graphics"
5. Set margins to "None" (CSS handles margins)
