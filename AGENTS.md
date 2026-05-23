# Agent Instructions

## Package Manager
- Use **pnpm**: `pnpm install`

## Commands
| Task | Command |
|------|---------|
| Compile SCSS | `pnpm build:css` |
| Dev server | `pnpm dev` |
| Run all tests | `pnpm test` |
| Layout tests only | `pnpm test -- tests/resume.spec.ts` |
| A11y tests only | `pnpm test -- tests/a11y.spec.ts` |
| Screenshot tests only | `pnpm test -- tests/screenshots.spec.ts` |
| Update screenshots | `pnpm test -- --update-snapshots` |

## External References
| Need | File |
|------|------|
| Project overview | `README.md` |
| Resume builder skill | `skills/resume-builder/SKILL.md` |
| CSS class toolkit | `skills/resume-builder/REFERENCE.md` |

## Key Conventions
- Edit `$primary-base` in `styles/_palette.scss` to re-theme, then run `pnpm build:css`
- Do not edit `styles/theme.css` directly — it is compiled from `theme.scss`
- Test server starts automatically via Playwright webServer config
- Screenshots in `screenshots/` are gitignored — update baselines with `--update-snapshots`

## Commit Attribution
AI commits MUST include:
```
Co-Authored-By: Pi Coding Agent <pi@earendil.works>
```
