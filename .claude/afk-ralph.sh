#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

LOG_FILE="ralph-log-$(date +%Y%m%d-%H%M%S).txt"

MAX_TURNS=${2:-50}

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations> [max-turns]"
  echo "Example: $0 10 50"
  exit 1
fi

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting AFK Ralph - $1 iterations, max $MAX_TURNS turns per iteration"
log "Log file: $LOG_FILE"

for ((i=1; i<=$1; i++)); do
  log "=== Iteration $i/$1 ==="

  result=$(claude --dangerously-skip-permissions --max-turns $MAX_TURNS -p "@PRD.md @progress.txt \
  1. Find the highest-priority incomplete task and implement it. \
  2. Run type checks with 'npm run type-check'. \
  3. Update progress.txt with what you did (append, don't overwrite). \
  4. Commit your changes (include progress.txt in the commit). \
  Do not waste tokens on useless comments or random unrelated files. \
  ONLY WORK ON A SINGLE TASK. \
  If ALL tasks in the PRD are complete, output <promise>COMPLETE</promise>." 2>&1)

  echo "$result" | tee -a "$LOG_FILE"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    log "PRD complete after $i iterations!"
    exit 0
  fi

  log "Iteration $i complete, continuing..."
  sleep 2
done

log "Finished $1 iterations (PRD may not be complete)"