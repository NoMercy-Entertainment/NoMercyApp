#!/bin/bash
# Post-start script for NoMercy.App devcontainer
# Runs every time the container starts

echo "=============================================="
echo "NoMercy.App DevContainer - Starting"
echo "=============================================="

# Ensure PATH includes Claude CLI
export PATH="${HOME}/.local/bin:${PATH}"

# Check if port 5502 is already in use and kill it
DEV_PORT=${DEV_PORT:-5502}

check_and_free_port() {
    local port=$1
    local pid=$(lsof -t -i:$port 2>/dev/null)

    if [ -n "$pid" ]; then
        echo "⚠ Port $port is in use by PID $pid"
        echo "  Killing process to free the port..."
        kill -9 $pid 2>/dev/null
        sleep 1
        echo "✓ Port $port is now free"
    else
        echo "✓ Port $port is available"
    fi
}

echo ""
echo "Checking dev server port..."
check_and_free_port $DEV_PORT

# Verify token is accessible
echo ""
echo "Checking token access..."
if [ -f "${HOME}/.nomercy/token.json" ]; then
    echo "✓ NoMercy token is accessible"
else
    echo "⚠ Token not found at ${HOME}/.nomercy/token.json"
    echo "  Check that the mount is configured correctly in devcontainer.json"
fi

# Verify Claude CLI
echo ""
echo "Checking Claude CLI..."
if command -v claude &> /dev/null; then
    echo "✓ Claude CLI is installed"
else
    echo "⚠ Claude CLI not found - run: curl -fsSL https://claude.ai/install.sh | bash"
fi

echo ""
echo "=============================================="
echo "Ready for development!"
echo "=============================================="
echo ""
echo "Quick start:"
echo "  dev-start   - Start the dev server"
echo "  claude .claude/PRD.md  - Open PRD with Claude"
echo ""
