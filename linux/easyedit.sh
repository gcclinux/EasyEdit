#!/usr/bin/env bash
# Launcher for EasyEdit inside Electron BaseApp using zypak
set -euo pipefail

# Resolve script directory to locate app files if needed
HERE="$(dirname "$(readlink -f "$0")")"
APPDIR="/app/share/io.github.gcclinux.EasyEdit"

# Electron provided by BaseApp
ELECTRON="/app/electron/electron"
if [ ! -x "$ELECTRON" ]; then
  echo "Electron binary not found at $ELECTRON" >&2
  exit 1
fi

# Prefer zypak wrapper if available
if command -v zypak-wrapper >/dev/null 2>&1; then
  exec zypak-wrapper "$ELECTRON" "$APPDIR" "$@"
else
  exec "$ELECTRON" "$APPDIR" "$@"
fi
