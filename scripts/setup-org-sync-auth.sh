#!/usr/bin/env bash
# One-time setup: deploy key on heff-industries/animalgaragenet → ORG_REPO_DEPLOY_KEY secret.
#
# Why deploy key (not PAT)?
# - Fine-grained PATs must be created in the browser; OAuth tokens fail in Actions.
# - Deploy keys cannot push .github/workflows — our mirror script excludes that folder.
# - Netlify only needs app source on the org repo, not GitHub Actions workflows.

set -euo pipefail

PERSONAL_REPO="jjheffernan/animalgaragenet"
ORG_REPO="heff-industries/animalgaragenet"
DEPLOY_KEY_TITLE="personal-main-sync"

usage() {
  cat <<EOF
Usage: $(basename "$0") [install|verify]

  install  Create deploy key on $ORG_REPO and store ORG_REPO_DEPLOY_KEY on $PERSONAL_REPO
  verify   List deploy keys + secrets (values are never visible)

Secrets appear under: $PERSONAL_REPO → Settings → Secrets and variables → Actions
You will only see names (ORG_REPO_DEPLOY_KEY), never the key value — that is normal.

EOF
}

install_deploy_key() {
  command -v gh >/dev/null || { echo "gh CLI required"; exit 1; }
  command -v ssh-keygen >/dev/null || { echo "ssh-keygen required"; exit 1; }

  KEY_DIR=$(mktemp -d)
  trap 'rm -rf "$KEY_DIR"' EXIT
  KEY_FILE="$KEY_DIR/org_sync"

  echo "Generating ed25519 deploy key..."
  ssh-keygen -t ed25519 -f "$KEY_FILE" -N "" -C "github-actions:sync-main-to-heff-industries" >/dev/null

  echo "Registering deploy key on $ORG_REPO (write access)..."
  gh api "repos/${ORG_REPO}/keys" \
    -f title="$DEPLOY_KEY_TITLE" \
    -f key="$(cat "${KEY_FILE}.pub")" \
    -f read_only=false >/dev/null

  echo "Storing ORG_REPO_DEPLOY_KEY on $PERSONAL_REPO..."
  gh secret set ORG_REPO_DEPLOY_KEY --repo "$PERSONAL_REPO" < "$KEY_FILE"

  echo "Done. Test: gh workflow run sync-org-main.yml --repo $PERSONAL_REPO"
}

verify() {
  echo "Deploy keys on $ORG_REPO:"
  gh api "repos/${ORG_REPO}/keys" --jq '.[] | "- \(.title) (id \(.id), read_only=\(.read_only))"'
  echo
  echo "Action secrets on $PERSONAL_REPO:"
  gh secret list --repo "$PERSONAL_REPO"
}

case "${1:-install}" in
  install) install_deploy_key ;;
  verify) verify ;;
  -h|--help|help) usage ;;
  *) usage; exit 1 ;;
esac
