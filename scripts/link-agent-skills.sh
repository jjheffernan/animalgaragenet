#!/usr/bin/env bash
# Repair agent skill symlinks after clone (AUD-P2-020).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AGENTS="$ROOT/agents"
CURSOR_SKILLS="$ROOT/.cursor/skills"
HOME_CURSOR="${HOME}/.cursor/skills-cursor"

link_cursor_skill() {
	local name="$1"
	local target="$2"
	ln -sfn "$target" "$AGENTS/$name"
	mkdir -p "$CURSOR_SKILLS"
	ln -sfn "../../agents/$name" "$CURSOR_SKILLS/$name"
}

for name in ponytail caveman; do
	link_cursor_skill "$name" "$AGENTS/$name"
done

if [[ -d "$HOME_CURSOR" ]]; then
	for name in automate babysit canvas create-hook create-rule create-skill create-subagent \
		loop migrate-to-skills onboard review review-bugbot review-security sdk shell \
		split-to-prs statusline update-cli-config update-cursor-settings; do
		if [[ -e "$HOME_CURSOR/$name" ]]; then
			link_cursor_skill "$name" "$HOME_CURSOR/$name"
		fi
	done
else
	echo "skip: $HOME_CURSOR not found — install Cursor IDE for default agent skills"
fi

for entry in "$AGENTS"/supabase "$AGENTS"/supabase-postgres-best-practices \
	"$AGENTS"/svelte-code-writer "$AGENTS"/svelte-core-bestpractices "$AGENTS"/svelte-file-editor.md; do
	name="$(basename "$entry")"
	if [[ -L "$entry" ]] && [[ ! -e "$entry" ]]; then
		echo "broken: agents/$name — enable Svelte + Supabase plugins in .cursor/settings.json"
	fi
done

echo "Agent skill symlinks refreshed. Verify: ls -la agents/ponytail .cursor/skills/ponytail"
