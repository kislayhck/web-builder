#!/bin/bash
set -euo pipefail

# This script runs during building the sandbox template
# and makes sure the Next.js app is (1) running and (2) `/` is compiled.

ping_server() {
  local response
  local counter=0

  while true; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000" || true)
    if [[ "${response}" == "200" ]]; then
      echo "Server responded with 200. Build-ready."
      break
    fi

    ((counter++))
    if (( counter % 10 == 0 )); then
      echo "Waiting for server to start... (last code: ${response})"
    fi
    sleep 0.2
  done
}

# Start the dev server in the background (bind to all interfaces)
( cd /home/user && npx next dev --turbopack --hostname 0.0.0.0 ) &

# Wait until it is ready
ping_server

# keep the process alive if your platform expects the start command to stay running
wait
