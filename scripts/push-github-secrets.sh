#!/usr/bin/env bash
# Push integration secrets from local .env to GitHub Actions (names from manifest only).
#
# Usage:
#   bash scripts/push-github-secrets.sh           # interactive confirm per secret
#   bash scripts/push-github-secrets.sh --yes     # set all present in .env without prompts
#
# Never prints secret values. Skips keys missing or empty in .env.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${GITHUB_REPOSITORY:-jjheffernan/animalgaragenet}"
AUTO_YES="${1:-}"

ENV_FILE="$ROOT/.env"
if [ ! -f "$ENV_FILE" ]; then
	echo "ERROR: $ENV_FILE not found. Copy .env.example and fill integration values." >&2
	exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
	echo "ERROR: gh CLI required" >&2
	exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

set_count=0
skip_count=0

while IFS= read -r name; do
	[ -z "$name" ] && continue
	value="${!name:-}"
	if [ -z "$value" ]; then
		echo "SKIP $name (empty in .env)"
		skip_count=$((skip_count + 1))
		continue
	fi

	if [ "$AUTO_YES" != "--yes" ]; then
		read -r -p "Set GitHub secret $name for $REPO? [y/N] " confirm
		if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
			echo "SKIP $name"
			skip_count=$((skip_count + 1))
			continue
		fi
	fi

	gh secret set "$name" -R "$REPO" --body "$value"
	echo "SET  $name"
	set_count=$((set_count + 1))
done < <(
	node -e "
	const m = require('./scripts/github-secrets.manifest.json');
	const names = new Set();
	for (const cfg of Object.values(m.groups)) {
	  for (const s of cfg.secrets) names.add(s.name);
	}
	console.log([...names].sort().join('\n'));
	"
)

echo ""
echo "Done: $set_count set, $skip_count skipped"
echo "Verify: bash scripts/check-github-secrets.sh"
