#!/bin/bash
# Dev server management script for NoMercy.App
# Usage: ./dev-server.sh [start|stop|restart|kill|status]

DEV_PORT=${DEV_PORT:-5502}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

usage() {
    echo "NoMercy.App Dev Server Manager"
    echo ""
    echo "Usage: $0 {start|stop|restart|kill|status}"
    echo ""
    echo "Commands:"
    echo "  start    - Start the dev server on port $DEV_PORT"
    echo "  stop     - Gracefully stop the dev server"
    echo "  restart  - Stop and start the dev server"
    echo "  kill     - Force kill any process on port $DEV_PORT"
    echo "  status   - Check if dev server is running"
    echo ""
    exit 1
}

get_pid() {
    lsof -t -i:$DEV_PORT 2>/dev/null
}

status() {
    local pid=$(get_pid)
    if [ -n "$pid" ]; then
        echo "✓ Dev server is running on port $DEV_PORT (PID: $pid)"
        return 0
    else
        echo "✗ Dev server is not running on port $DEV_PORT"
        return 1
    fi
}

stop_server() {
    local pid=$(get_pid)
    if [ -n "$pid" ]; then
        echo "Stopping dev server (PID: $pid)..."
        kill $pid 2>/dev/null
        sleep 2

        # Check if it's still running
        pid=$(get_pid)
        if [ -n "$pid" ]; then
            echo "Process still running, sending SIGKILL..."
            kill -9 $pid 2>/dev/null
            sleep 1
        fi

        echo "✓ Dev server stopped"
    else
        echo "Dev server is not running"
    fi
}

kill_port() {
    echo "Force killing any process on port $DEV_PORT..."

    # Try fuser first
    fuser -k ${DEV_PORT}/tcp 2>/dev/null || true

    # Then lsof as backup
    local pid=$(get_pid)
    if [ -n "$pid" ]; then
        kill -9 $pid 2>/dev/null
    fi

    sleep 1

    # Verify
    pid=$(get_pid)
    if [ -z "$pid" ]; then
        echo "✓ Port $DEV_PORT is now free"
    else
        echo "⚠ Failed to free port $DEV_PORT (PID: $pid still running)"
        exit 1
    fi
}

start_server() {
    local pid=$(get_pid)
    if [ -n "$pid" ]; then
        echo "⚠ Port $DEV_PORT is already in use (PID: $pid)"
        echo "  Use '$0 kill' to free the port first"
        exit 1
    fi

    echo "Starting dev server on port $DEV_PORT..."
    cd "$PROJECT_DIR"
    npm run dev
}

restart_server() {
    stop_server
    sleep 1
    start_server
}

if [ $# -ne 1 ]; then
    usage
fi

case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    kill)
        kill_port
        ;;
    status)
        status
        ;;
    *)
        echo "Unknown command: $1"
        usage
        ;;
esac
