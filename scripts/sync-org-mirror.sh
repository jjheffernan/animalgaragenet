#!/usr/bin/env bash
# Build an orphan snapshot for heff-industries/animalgaragenet (no .github/workflows).
# Deploy keys cannot push workflow files; Netlify does not need Actions on the org repo.
#
# Usage (in CI): sync-org-mirror.sh <source-sha> <org-remote-url>
# org-remote-url: git@github.com:heff-industries/animalgaragenet.git

set -euo pipefail

SOURCE_SHA="${1:?source sha required}"
ORG_REMOTE="${2:?org remote url required}"

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

git checkout "$SOURCE_SHA"
git checkout --orphan org-mirror

if [ -d .github/workflows ]; then
  git rm -rf --cached .github/workflows
  rm -rf .github/workflows
fi

git add -A
git commit -m "Mirror from jjheffernan/animalgaragenet@$(git rev-parse --short "$SOURCE_SHA")"

git remote add org "$ORG_REMOTE"
git push --force org org-mirror:main

echo "Mirrored $SOURCE_SHA to heff-industries/animalgaragenet main (workflows excluded)"
