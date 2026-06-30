#!/usr/bin/env bash
# Audit GitHub Actions secrets against scripts/github-secrets.manifest.json
#
# Usage:
#   bash scripts/check-github-secrets.sh              # report missing (exit 0)
#   bash scripts/check-github-secrets.sh --strict       # exit 1 if deploy group incomplete
#   bash scripts/check-github-secrets.sh --strict-all   # exit 1 if any manifest secret missing
#
# Requires: gh CLI authenticated with repo admin (read secrets metadata only).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${GITHUB_REPOSITORY:-jjheffernan/animalgaragenet}"
MODE="${1:-}"

if ! command -v gh >/dev/null 2>&1; then
	echo "ERROR: gh CLI required" >&2
	exit 1
fi

if ! command -v node >/dev/null 2>&1; then
	echo "ERROR: node required to parse manifest" >&2
	exit 1
fi

MANIFEST="$ROOT/scripts/github-secrets.manifest.json"
if [ ! -f "$MANIFEST" ]; then
	echo "ERROR: missing $MANIFEST" >&2
	exit 1
fi

configured_file="$(mktemp)"
gh secret list -R "$REPO" --json name -q '.[].name' 2>/dev/null | sort -u >"$configured_file" || true

is_set() {
	local name="$1"
	grep -Fxq "$name" "$configured_file"
}

missing_deploy=()
missing_all=()
configured_count=$(wc -l <"$configured_file" | tr -d ' ')

while IFS='|' read -r group name required; do
	[ -z "$name" ] && continue
	if is_set "$name"; then
		echo "  OK   $name ($group)"
	else
		echo "  MISS $name ($group)"
		missing_all+=("$name")
		if [ "$required" = "true" ]; then
			missing_deploy+=("$name")
		fi
	fi
done < <(
	node -e "
	const m = require(process.argv[1]);
	for (const [group, cfg] of Object.entries(m.groups)) {
	  for (const s of cfg.secrets) {
	    console.log(group + '|' + s.name + '|' + Boolean(cfg.required));
	  }
	}
	" "$MANIFEST"
)

rm -f "$configured_file"

echo ""
echo "Configured: ${configured_count} secret(s) in $REPO"

if [ "${#missing_all[@]}" -eq 0 ]; then
	echo "OK: all manifest secrets are configured"
	exit 0
fi

echo "Missing ${#missing_all[@]} optional/readiness secret(s): ${missing_all[*]}"

case "$MODE" in
	--strict)
		if [ "${#missing_deploy[@]}" -gt 0 ]; then
			echo "ERROR: required deploy secrets missing: ${missing_deploy[*]}" >&2
			exit 1
		fi
		;;
	--strict-all)
		echo "ERROR: strict-all — configure all manifest secrets before release" >&2
		exit 1
		;;
esac

exit 0
