#!/usr/bin/env bash

FULL_PATH="$(pwd)"

# New output and user prompt
echo "You are about to create AppImage Desktop file in the current directory ${FULL_PATH}"
echo "Do you want to continue? (YES|yes or NO|no)"

read user_input

if [[ "$user_input" == "NO" || "$user_input" == "no" ]]; then
    echo "Move the script to the currect folder where your AppImage is located and start Again"
    exit
fi

# Enter the name of the AppImage file
read -p "Enter the name of the AppImage NEW file: " IMAGE_NAME_NEW

# Verify downloaded file
if [ ! -s "${FULL_PATH}/${IMAGE_NAME_NEW}" ]; then
    echo "Error: AppImage is empty, missing or incorrect name"
    exit 1
else
    echo "AppImage file found: ${FULL_PATH}/${IMAGE_NAME_NEW}"
    chmod +x "${FULL_PATH}/${IMAGE_NAME_NEW}"
fi


# Download icon if not exists
if [ ! -f "${FULL_PATH}/icon.png" ]; then
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
Exec=${FULL_PATH}/${IMAGE_NAME_NEW}
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