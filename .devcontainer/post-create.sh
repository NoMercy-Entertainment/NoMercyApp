#!/bin/bash
# Post-create script for NoMercy.App devcontainer
# Runs once when container is first created

set -e

echo "=============================================="
echo "NoMercy.App DevContainer - Post Create Setup"
echo "=============================================="

# Install Claude CLI
echo ""
echo "[1/5] Installing Claude CLI..."
curl -fsSL https://claude.ai/install.sh | bash

# Add Claude CLI to PATH for current session
export PATH="${HOME}/.local/bin:${PATH}"

# Setup shell configuration
echo ""
echo "[2/5] Configuring shell..."

# Configure for both bash and zsh
for rcfile in ~/.bashrc ~/.zshrc; do
    if [ -f "$rcfile" ]; then
        # Add PATH if not present
        if ! grep -q ".local/bin" "$rcfile"; then
            echo 'export PATH="${HOME}/.local/bin:${PATH}"' >> "$rcfile"
        fi

        # Add clauded alias if not present
        if ! grep -q "alias clauded=" "$rcfile"; then
            echo 'alias clauded="claude --dangerously-skip-permissions"' >> "$rcfile"
        fi

        # Add dev server helper functions
        if ! grep -q "dev-start" "$rcfile"; then
            cat >> "$rcfile" << 'EOF'

# NoMercy.App Dev Server Helpers
export DEV_PORT=5502

dev-start() {
    echo "Starting dev server on port $DEV_PORT..."
    yarn dev
}

dev-stop() {
    echo "Stopping any process on port $DEV_PORT..."
    local pid=$(lsof -t -i:$DEV_PORT 2>/dev/null)
    if [ -n "$pid" ]; then
        kill -9 $pid 2>/dev/null && echo "Killed process $pid" || echo "Failed to kill process"
    else
        echo "No process found on port $DEV_PORT"
    fi
}

dev-restart() {
    dev-stop
    sleep 1
    dev-start
}

dev-kill() {
    echo "Force killing any process holding port $DEV_PORT hostage..."
    fuser -k ${DEV_PORT}/tcp 2>/dev/null || true
    lsof -ti:$DEV_PORT | xargs -r kill -9 2>/dev/null || true
    echo "Port $DEV_PORT should now be free"
}
EOF
        fi
    fi
done

# Import Claude configuration from host
echo ""
echo "[3/5] Importing Claude configuration..."
if [ -d "/tmp/.claude-host" ]; then
    # Copy auth and settings files from Windows host mount
    mkdir -p "${HOME}/.claude"
    for file in credentials.json settings.json settings.local.json .credentials; do
        if [ -f "/tmp/.claude-host/$file" ]; then
            cp "/tmp/.claude-host/$file" "${HOME}/.claude/"
            echo "✓ Copied $file from host"
        fi
    done
    # Copy projects directory if it exists
    if [ -d "/tmp/.claude-host/projects" ]; then
        cp -r "/tmp/.claude-host/projects" "${HOME}/.claude/"
        echo "✓ Copied projects directory from host"
    fi
else
    echo "⚠ No Claude host mount found at /tmp/.claude-host"
fi

# Install yarn dependencies
echo ""
echo "[4/5] Installing yarn dependencies..."
if [ -f "package.json" ]; then
    yarn install
    echo "✓ Dependencies installed"
else
    echo "⚠ No package.json found"
fi

# Create token symlink for easier access
echo ""
echo "[5/5] Setting up token access..."
if [ -f "${HOME}/.nomercy/token.json" ]; then
    echo "✓ NoMercy token available at ${HOME}/.nomercy/token.json"
    echo "  Environment variable: \$NOMERCY_TOKEN_PATH"
else
    echo "⚠ Token file not found - ensure mount is configured correctly"
fi

echo ""
echo "=============================================="
echo "Setup Complete!"
echo "=============================================="
echo ""
echo "Available commands:"
echo "  dev-start    - Start the dev server on port $DEV_PORT"
echo "  dev-stop     - Stop the dev server"
echo "  dev-restart  - Restart the dev server"
echo "  dev-kill     - Force kill any process on port $DEV_PORT"
echo ""
echo "  claude       - Run Claude CLI"
echo "  clauded      - Run Claude with permissions skipped"
echo ""
echo "Token location: \$NOMERCY_TOKEN_PATH"
echo ""
