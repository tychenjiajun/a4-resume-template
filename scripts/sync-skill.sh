#!/usr/bin/env bash
# Sync project files to the skill's scripts/ directory and installed skill.
# Usage: ./scripts/sync-skill.sh [--install]

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL_SCRIPTS="$PROJECT_ROOT/skills/resume-builder/scripts"
INSTALLED_SKILL="$HOME/.pi/agent/skills/resume-builder/scripts"

# Sync from project root → skill scripts dir
sync_to() {
  local dest="$1"
  local label="$2"

  cp "$PROJECT_ROOT/package.json" "$dest/"
  cp "$PROJECT_ROOT/playwright.config.js" "$dest/"
  cp "$PROJECT_ROOT/pnpm-workspace.yaml" "$dest/"
  cp "$PROJECT_ROOT/.gitignore" "$dest/"

  mkdir -p "$dest/styles" "$dest/scripts" "$dest/tests"
  cp "$PROJECT_ROOT/styles/_palette.scss" "$dest/styles/"
  cp "$PROJECT_ROOT/styles/theme.scss" "$dest/styles/"
  cp "$PROJECT_ROOT/scripts/main.js" "$dest/scripts/"
  cp "$PROJECT_ROOT/tests/"*.spec.ts "$dest/tests/"
  cp "$PROJECT_ROOT/tests/axe-test.ts" "$dest/tests/"

  echo "✓ Synced to $label"
}

sync_to "$SKILL_SCRIPTS" "skills/resume-builder/scripts/"

if [[ "${1:-}" == "--install" ]]; then
  mkdir -p "$INSTALLED_SKILL"
  sync_to "$INSTALLED_SKILL" "~/.pi/agent/skills/resume-builder/scripts/"
fi
