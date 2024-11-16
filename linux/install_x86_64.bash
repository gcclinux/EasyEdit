#!/usr/bin/env bash

# Prompt for installation directory
read -p "Enter installation folder (relative to ${HOME}/): " INSTALL_DIR
FULL_PATH="${HOME}/${INSTALL_DIR}"

# Check and create installation directory if needed
if [ -d "${FULL_PATH}" ]; then
    echo "Installation directory already exists: ${FULL_PATH}"
else
    echo "Creating installation directory: ${FULL_PATH}"
    mkdir -p "${FULL_PATH}"
fi

# Check if AppImage exists and set appropriate message
if [ -f "${FULL_PATH}/EasyEdit-x86_64.AppImage" ]; then
    echo "Upgrading EasyEdit..."
    
    # Remove old .pre if exists
    if [ -f "${FULL_PATH}/EasyEdit-x86_64.AppImage.pre" ]; then
        rm -f "${FULL_PATH}/EasyEdit-x86_64.AppImage.pre"
    fi
    
    # Backup current version
    mv "${FULL_PATH}/EasyEdit-x86_64.AppImage" "${FULL_PATH}/EasyEdit-x86_64.AppImage.pre"
else
    echo "Downloading EasyEdit..."
fi

# Download AppImage
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

# Download icon if not exists
if [ -f "${FULL_PATH}/icon.png" ]; then
    echo "Icon already exists, skipping download"
else
    echo "Downloading icon..."
    if ! wget -P "${FULL_PATH}" https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/icon.png; then
        echo "Error: Failed to download icon"
        exit 1
    fi
    # Verify downloaded file
    if [ ! -s "${FULL_PATH}/icon.png" ]; then
        echo "Error: Downloaded icon is empty or missing"
        rm -f "${FULL_PATH}/icon.png"
        exit 1
    fi
fi
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
sleep 1
echo "Default application settings updated"

# Copy install script to installation directory
SCRIPT_NAME=$(basename "$0")
if [ -f "${FULL_PATH}/${SCRIPT_NAME}" ]; then
    echo "Install script already exists in installation directory"
else
    echo "Copying install script to installation directory..."
    cp "$0" "${FULL_PATH}/${SCRIPT_NAME}"
    chmod +x "${FULL_PATH}/${SCRIPT_NAME}"
fi

echo "Installation complete! EasyEdit installed to ${FULL_PATH}"