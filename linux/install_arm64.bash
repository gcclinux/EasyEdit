#!/usr/bin/env bash

# Prompt for installation directory
read -p "Enter installation folder (relative to ${HOME}/): " INSTALL_DIR
FULL_PATH="${HOME}/${INSTALL_DIR}"

# Create installation directory
mkdir -p "${FULL_PATH}"

# Download AppImage
echo "Downloading EasyEdit..."
wget -P "${FULL_PATH}" https://github.com/gcclinux/EasyEdit/releases/download/latest/EasyEdit-arm64.AppImage
chmod +x "${FULL_PATH}/EasyEdit-arm64.AppImage"

# Download icon
echo "Downloading icon..."
wget -P "${FULL_PATH}" https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/icon.png
chmod 644 "${FULL_PATH}/icon.png"

# Create desktop file
cat > "${FULL_PATH}/easyedit.desktop" << EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=EasyEdit
Comment=Text Editor Application
Exec=${FULL_PATH}/EasyEdit-arm64.AppImage
Icon=${FULL_PATH}/icon.png
Terminal=false
Categories=TextEditor;Utility;
MimeType=text/plain;
StartupNotify=true
StartupWMClass=EasyEdit
EOL

# Install desktop file
mkdir -p ~/.local/share/applications
cp "${FULL_PATH}/easyedit.desktop" ~/.local/share/applications/
chmod +x ~/.local/share/applications/easyedit.desktop

# Update desktop database
update-desktop-database ~/.local/share/applications

# Validate desktop file
desktop-file-validate ~/.local/share/applications/easyedit.desktop

echo "Installation complete! EasyEdit installed to ${FULL_PATH}"