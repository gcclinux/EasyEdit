#!/usr/bin/env bash

# Prompt for installation directory
read -p "Enter installation folder (relative to ${HOME}/): " INSTALL_DIR
FULL_PATH="${HOME}/${INSTALL_DIR}"

# Create installation directory
mkdir -p "${FULL_PATH}"

# Download AppImage
echo "Downloading EasyEdit..."
if ! wget -P "${FULL_PATH}" https://github.com/gcclinux/EasyEdit/releases/download/latest/EasyEdit-x86_64.AppImage; then
    echo "Error: Failed to download EasyEdit AppImage"
    exit 1
fi

# Verify downloaded file
if [ ! -s "${FULL_PATH}/EasyEdit-x86_64.AppImage" ]; then
    echo "Error: Downloaded AppImage is empty or missing"
    rm -f "${FULL_PATH}/EasyEdit-x86_64.AppImage"
    exit 1
fi
chmod +x "${FULL_PATH}/EasyEdit-x86_64.AppImage"

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
Exec=${FULL_PATH}/EasyEdit-x86_64.AppImage
Icon=${FULL_PATH}/icon.png
Terminal=false
Categories=TextEditor;Utility;
MimeType=text/plain;text/markdown;text/x-markdown;
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

# After desktop file installation, add MIME associations
echo "Setting default application for Markdown files..."

MIME_FILE="${HOME}/.config/mimeapps.list"
MIME_DIR="${HOME}/.config"

# Create .config directory if it doesn't exist
mkdir -p "${MIME_DIR}"

# Backup existing mimeapps.list if it exists
if [ -f "${MIME_FILE}" ]; then
    cp "${MIME_FILE}" "${MIME_FILE}.backup"
fi

# Add or update markdown associations
{
    if [ ! -f "${MIME_FILE}" ]; then
        echo "[Default Applications]"
    fi
    
    # Remove existing markdown associations if any
    if [ -f "${MIME_FILE}" ]; then
        sed -i '/^text\/markdown=/d' "${MIME_FILE}"
        sed -i '/^text\/x-markdown=/d' "${MIME_FILE}"
    fi

    # Add new associations
    echo "text/markdown=easyedit.desktop" >> "${MIME_FILE}"
    echo "text/x-markdown=easyedit.desktop" >> "${MIME_FILE}"
} >> "${MIME_FILE}"

echo "Default application settings updated"

echo "Installation complete! EasyEdit installed to ${FULL_PATH}"