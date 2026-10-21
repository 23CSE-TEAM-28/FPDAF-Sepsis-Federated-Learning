#!/usr/bin/env bash
# FPDAF Project Documentation Portal Launcher
echo "=========================================================================="
echo " Starting FPDAF Project Website & Documentation Portal (Group G028)"
echo "=========================================================================="
PORT=8080
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "[+] Serving documentation portal at: http://localhost:$PORT"
echo "[+] Press Ctrl+C to terminate."

# Open browser automatically on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 1 && open "http://localhost:$PORT") &
fi

python3 -m http.server $PORT
