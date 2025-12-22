#!/bin/bash
echo "Building EasyEdit Snap..."
echo "========================"

# Check and create snap bundle directory
SNAP_DIR="src-tauri/target/release/bundle/snap"
if [ ! -d "$SNAP_DIR" ]; then
    echo "Creating snap bundle directory: $SNAP_DIR"
    mkdir -p "$SNAP_DIR"
fi

echo "snapcraft cleaning previous builds..."
snapcraft clean
echo "========================"
echo "removing previous snap installation and package..."
sudo snap remove easyedit 2>/dev/null || true
echo "========================"
echo "deleting previous snap package..."
rm -f "$SNAP_DIR/easyedit_1.5.2-alpha_amd64.snap"
echo "========================"
echo "building snap --destructive-mode package..."
snapcraft pack --destructive-mode --output "$SNAP_DIR/easyedit_1.5.2-alpha_amd64.snap"
echo "========================"
echo "installing new built snap package..."
sudo snap install --classic --dangerous "$SNAP_DIR/easyedit_1.5.2-alpha_amd64.snap"
echo "========================"
echo "launching easyedit snap application..."
snap run easyedit
