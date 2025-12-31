#!/usr/bin/env bash
# Launcher for EasyEditor inside Electron BaseApp using zypak
set -euo pipefail

# Resolve script directory to locate app files if needed
HERE="$(dirname "$(readlink -f "$0")")"
APPDIR="/app/share/io.github.gcclinux.EasyEditor"

# Ensure Electron treats this as a production build (not dev)
export ELECTRON_IS_DEV=0
export NODE_ENV=production

# Prefer bundled Electron ELF binary from node_modules if present (from-source build)
if [ -x "/app/share/io.github.gcclinux.EasyEditor/node_modules/electron/dist/electron" ]; then
  ELECTRON="/app/share/io.github.gcclinux.EasyEditor/node_modules/electron/dist/electron"
elif [ -x "/app/electron/electron" ]; then
  ELECTRON="/app/electron/electron"
elif [ -x "/app/bin/electron" ]; then
  ELECTRON="/app/bin/electron"
else
  echo "Electron binary not found in BaseApp (checked /app/bin/electron and /app/electron/electron)" >&2
  exit 1
fi

# Prefer zypak wrapper if available
if command -v zypak-wrapper >/dev/null 2>&1; then
  exec zypak-wrapper "$ELECTRON" "$APPDIR" "$@"
else
  exec "$ELECTRON" "$APPDIR" "$@"
fi
