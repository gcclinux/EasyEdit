#!/bin/bash
set -e

echo "Building EasyEdit binary first..."
cd ${PWD}/
export PATH="$HOME/.cargo/bin:$PATH"
npm run tauri build
cd linux

echo "Building EasyEdit Flatpak from binary..."

# Install Flatpak runtime if not present
flatpak install --user -y flathub org.gnome.Platform//49 org.gnome.Sdk//49 || true

# Build the Flatpak from pre-built binary
flatpak-builder --user --install --force-clean build-dir-binary io.github.gcclinux.easyedit-tauri-binary.yml

# Create distributable package
flatpak build-bundle ~/.local/share/flatpak/repo easyedit-binary-$(date +%Y%m%d).flatpak io.github.gcclinux.EasyEdit

echo "Build complete! You can run the app with:"
echo "flatpak run io.github.gcclinux.EasyEdit"
echo "Distributable package created: easyedit-binary-$(date +%Y%m%d).flatpak"

echo "Test Install: flatpak install --user -y ./easyedit-binary-$(date +%Y%m%d).flatpak"
echo "Then run with: flatpak run io.github.gcclinux.EasyEdit"
echo "To uninstall: flatpak uninstall io.github.gcclinux.EasyEdit"