#!/usr/bin/env bash
# One-time setup for mirroring jjheffernan/animalgaragenet main → heff-industries/animalgaragenet
#
# GitHub does not expose an API to mint fine-grained PATs. For CI, a deploy key is
# recommended (automated below). For a PAT instead, open the pre-filled URL and run
# the gh secret command shown at the end.

set -euo pipefail

PERSONAL_REPO="jjheffernan/animalgaragenet"
ORG_REPO="heff-industries/animalgaragenet"
DEPLOY_KEY_TITLE="personal-main-sync"

PAT_URL="https://github.com/settings/personal-access-tokens/new?name=Org+main+sync&description=Mirror+main+to+heff-industries%2Fanimalgaragenet&target_name=heff-industries&expires_in=366&contents=write&metadata=read"

usage() {
  cat <<EOF
Usage: $(basename "$0") [deploy-key|pat-url]

  deploy-key  Create org deploy key + set ORG_REPO_DEPLOY_KEY secret (recommended)
  pat-url     Print fine-grained PAT creation URL + secret instructions

EOF
}

setup_deploy_key() {
  command -v gh >/dev/null || { echo "gh CLI required"; exit 1; }
  command -v ssh-keygen >/dev/null || { echo "ssh-keygen required"; exit 1; }

  KEY_DIR=$(mktemp -d)
  trap 'rm -rf "$KEY_DIR"' EXIT
  KEY_FILE="$KEY_DIR/org_sync"

  echo "Generating ed25519 deploy key..."
  ssh-keygen -t ed25519 -f "$KEY_FILE" -N "" -C "github-actions:sync-main-to-heff-industries" >/dev/null

  echo "Registering deploy key on $ORG_REPO..."
  gh api "repos/${ORG_REPO}/keys" \
    -f title="$DEPLOY_KEY_TITLE" \
    -f key="$(cat "${KEY_FILE}.pub")" \
    -f read_only=false >/dev/null

  echo "Storing ORG_REPO_DEPLOY_KEY on $PERSONAL_REPO..."
  gh secret set ORG_REPO_DEPLOY_KEY --repo "$PERSONAL_REPO" < "$KEY_FILE"

  echo "Done. Run sync: gh workflow run sync-org-main.yml --repo $PERSONAL_REPO"
}

print_pat_instructions() {
  echo "Open this URL to create a fine-grained PAT (select repository: animalgaragenet):"
  echo "$PAT_URL"
  echo
  echo "After generating the token, store it on the personal repo:"
  echo "  gh secret set ORG_REPO_SYNC_TOKEN --repo $PERSONAL_REPO"
  echo
  echo "Note: the current workflow uses ORG_REPO_DEPLOY_KEY (deploy key). Switch the"
  echo "workflow back to HTTPS + ORG_REPO_SYNC_TOKEN if you prefer a PAT."
}

case "${1:-deploy-key}" in
  deploy-key) setup_deploy_key ;;
  pat-url) print_pat_instructions ;;
  -h|--help|help) usage ;;
  *) usage; exit 1 ;;
esac
