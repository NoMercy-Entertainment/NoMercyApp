#!/bin/bash
# Environment setup script for NoMercy.App dev container
# Configures shell aliases, paths, and imports Claude CLI preferences

set -e

echo "Setting up development environment..."
echo "======================================"

DEV_PORT=${DEV_PORT:-5502}

# Check if there's an exported config to import
if [ -d ".devcontainer/config" ]; then
    echo "Found exported configuration, importing..."
    bash .devcontainer/config-setup.sh import
else
    # Default setup without exported config
    # Add Claude CLI alias to bashrc if not already present
    if ! grep -q "alias clauded=" ~/.bashrc; then
        echo 'alias clauded="claude --dangerously-skip-permissions"' >> ~/.bashrc
        echo "✓ Added 'clauded' alias to ~/.bashrc"
    else
        echo "✓ Alias 'clauded' already configured"
    fi

    # Ensure .local/bin is in PATH
    if ! grep -q ".local/bin" ~/.bashrc; then
        echo 'export PATH="${HOME}/.local/bin:${PATH}"' >> ~/.bashrc
        echo "✓ Added ~/.local/bin to PATH"
    else
        echo "✓ PATH already configured"
    fi

    # Add dev server helpers if not present
    if ! grep -q "dev-start" ~/.bashrc; then
        cat >> ~/.bashrc << 'EOF'

# NoMercy.App Dev Server Helpers
export DEV_PORT=5502

dev-start() { bash .devcontainer/dev-server.sh start; }
dev-stop() { bash .devcontainer/dev-server.sh stop; }
dev-restart() { bash .devcontainer/dev-server.sh restart; }
dev-kill() { bash .devcontainer/dev-server.sh kill; }
dev-status() { bash .devcontainer/dev-server.sh status; }
EOF
        echo "✓ Added dev server helper functions"
    fi
fi

echo ""
echo "Development environment ready!"
echo ""
echo "Available commands:"
echo "  dev-start     - Start the dev server on port $DEV_PORT"
echo "  dev-stop      - Stop the dev server"
echo "  dev-restart   - Restart the dev server"
echo "  dev-kill      - Force kill process on port $DEV_PORT"
echo "  dev-status    - Check dev server status"
echo ""
echo "  claude        - Run Claude CLI"
echo "  clauded       - Run Claude with permissions skipped"
echo ""
echo "To export your current Claude preferences:"
echo "  bash .devcontainer/config-setup.sh export"
echo ""
