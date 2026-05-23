# Agent Instructions

## Package Manager
- Use **npm**: `npm install`

## Commands
| Task | Command |
|------|---------|
| Compile SCSS | `npm run build:css` |
| Dev server | `npm run dev` |
| Run all tests | `npm test` |
| Layout tests only | `npm test -- tests/resume.spec.ts` |
| A11y tests only | `npm test -- tests/a11y.spec.ts` |
| Screenshot tests only | `npm test -- tests/screenshots.spec.ts` |
| Update screenshots | `npm test -- --update-snapshots` |

## External References
| Need | File |
|------|------|
| Project overview | `README.md` |
| Resume builder skill | `skills/resume-builder/SKILL.md` |
| CSS class toolkit | `skills/resume-builder/REFERENCE.md` |

## Key Conventions
- Edit `$primary-base` in `styles/_palette.scss` to re-theme, then run `npm run build:css`
- Do not edit `styles/theme.css` directly — it is compiled from `theme.scss`
- Test server starts automatically via Playwright webServer config
- Screenshots in `screenshots/` are gitignored — update baselines with `--update-snapshots`

## Commit Attribution
AI commits MUST include:
```
Co-Authored-By: Pi Coding Agent <pi@earendil.works>
```
