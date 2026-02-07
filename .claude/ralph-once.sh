#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

claude --dangerously-skip-permissions "@PRD.md @progress.txt \
1. Read the PRD and progress file. \
2. Find the next incomplete task and implement it. \
3. Run type checks with 'npm run type-check'. \
4. Update progress.txt with what you did. \
5. Commit your changes (include progress.txt in the commit). \
Do not waste tokens on useless comments or random unrelated files. \
ONLY DO ONE TASK AT A TIME."