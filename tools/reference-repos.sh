#!/usr/bin/env bash
# Lock / unlock / inspect the reference repos used to build the automation.
# Reference repos are read-only: no commit, merge, rebase or push, and tracked files are marked read-only.
# .git stays writable so `git fetch` and `git archive` snapshots keep working.
#
# Usage (Git Bash on Windows):
#   tools/reference-repos.sh status  [root ...]
#   tools/reference-repos.sh lock    [root ...]
#   tools/reference-repos.sh unlock  [root ...]
# Default roots: ../repos and ../webdriverIo-flutter-automation-framework-build (relative to this repo).

set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
BASE="$(cd "$HERE/.." && pwd)"
CMD="${1:-status}"
shift || true
ROOTS=("$@")
[ ${#ROOTS[@]} -eq 0 ] && ROOTS=("$BASE/repos" "$BASE/webdriverIo-flutter-automation-framework-build")

HOOKS=(pre-commit prepare-commit-msg pre-merge-commit pre-rebase pre-applypatch pre-push)
DISABLED_PUSH="READ-ONLY-push-disabled"

find_repos() {
  for root in "${ROOTS[@]}"; do
    [ -d "$root" ] || continue
    find "$root" -maxdepth 4 -type d -name .git -not -path '*/node_modules/*' | sed 's#/\.git$##'
  done | sort -u
}

set_readonly() {
  local repo="$1" flag="$2"
  (cd "$repo" && git ls-files -z) | REPO="$repo" FLAG="$flag" powershell.exe -NoProfile -Command '
    $repo = $env:REPO; $flag = [bool]::Parse($env:FLAG)
    $names = [Console]::In.ReadToEnd().Split([char]0, [StringSplitOptions]::RemoveEmptyEntries)
    $n = 0
    foreach ($p in $names) {
      $f = Join-Path $repo $p
      if (Test-Path -LiteralPath $f -PathType Leaf) { (Get-Item -LiteralPath $f -Force).IsReadOnly = $flag; $n++ }
    }
    Write-Output $n'
}

lock_repo() {
  local repo="$1"
  if [ -n "$(git -C "$repo" status --porcelain)" ]; then
    echo "  SKIP $repo: has uncommitted changes"; return
  fi
  local hookdir="$repo/.git/hooks"
  for h in "${HOOKS[@]}"; do
    if [ -f "$hookdir/$h" ] && ! grep -q "READ-ONLY reference repo" "$hookdir/$h"; then
      mv "$hookdir/$h" "$hookdir/$h.before-readonly"
    fi
    cat > "$hookdir/$h" <<'EOF'
#!/bin/sh
echo "✖ READ-ONLY reference repo: commits, merges, rebases and pushes are disabled." >&2
echo "  Unlock with Madark-Mobile-Automation/tools/reference-repos.sh unlock <path>" >&2
exit 1
EOF
    chmod +x "$hookdir/$h"
  done
  local push
  push="$(git -C "$repo" remote get-url --push origin 2>/dev/null || true)"
  if [ -n "$push" ] && [ "$push" != "$DISABLED_PUSH" ]; then
    git -C "$repo" config readonly.pushurl "$push"
    git -C "$repo" remote set-url --push origin "$DISABLED_PUSH"
  fi
  git -C "$repo" config readonly.reason "Reference repo for Madark-Mobile-Automation; do not change, commit or push"
  local n
  n="$(set_readonly "$repo" true | tr -d '\r')"
  echo "  locked $repo ($n files read-only)"
}

unlock_repo() {
  local repo="$1" hookdir="$1/.git/hooks"
  for h in "${HOOKS[@]}"; do
    if [ -f "$hookdir/$h" ] && grep -q "READ-ONLY" "$hookdir/$h"; then
      rm -f "$hookdir/$h"
      [ -f "$hookdir/$h.before-readonly" ] && mv "$hookdir/$h.before-readonly" "$hookdir/$h"
    fi
  done
  local saved
  saved="$(git -C "$repo" config readonly.pushurl || true)"
  if [ -z "$saved" ] && [ "$(git -C "$repo" remote get-url --push origin 2>/dev/null)" = "$DISABLED_PUSH" ]; then
    saved="$(git -C "$repo" remote get-url origin)"
  fi
  [ -n "$saved" ] && git -C "$repo" remote set-url --push origin "$saved"
  git -C "$repo" config --unset readonly.pushurl 2>/dev/null || true
  git -C "$repo" config --unset readonly.reason 2>/dev/null || true
  local n
  n="$(set_readonly "$repo" false | tr -d '\r')"
  echo "  unlocked $repo ($n files writable)"
}

status_repo() {
  local repo="$1" hooks=0
  for h in "${HOOKS[@]}"; do grep -qs "READ-ONLY" "$repo/.git/hooks/$h" && hooks=$((hooks + 1)); done
  local push changes
  push="$(git -C "$repo" remote get-url --push origin 2>/dev/null || echo '-')"
  changes="$(git -C "$repo" status --porcelain | wc -l | tr -d ' ')"
  printf '  %-72s hooks=%s/%s push=%s changes=%s\n' "${repo#$BASE/}" "$hooks" "${#HOOKS[@]}" \
    "$([ "$push" = "$DISABLED_PUSH" ] && echo disabled || echo ENABLED)" "$changes"
}

mapfile -t REPOS < <(find_repos)
echo "$CMD: ${#REPOS[@]} repo(s)"
for r in "${REPOS[@]}"; do
  case "$CMD" in
    lock) lock_repo "$r" ;;
    unlock) unlock_repo "$r" ;;
    status) status_repo "$r" ;;
    *) echo "unknown command $CMD (use status | lock | unlock)"; exit 2 ;;
  esac
done
