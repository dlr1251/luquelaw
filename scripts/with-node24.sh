#!/usr/bin/env bash
# Eve requires Node.js >= 24. Prefer the current node if compatible;
# otherwise fall back to Homebrew node@24 when present.
set -euo pipefail

major="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"

if [[ "$major" -ge 24 ]]; then
  exec "$@"
fi

for bin_dir in /opt/homebrew/opt/node@24/bin /usr/local/opt/node@24/bin; do
  if [[ -x "$bin_dir/node" ]]; then
    export PATH="$bin_dir:$PATH"
    exec "$@"
  fi
done

echo "eve requires Node.js >= 24. You are running v$(node -v 2>/dev/null || echo unknown)." >&2
echo "Install Node 24 (e.g. brew install node@24) and put it on PATH, then retry." >&2
echo "  export PATH=\"/opt/homebrew/opt/node@24/bin:\$PATH\"" >&2
exit 1
