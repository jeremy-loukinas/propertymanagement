#!/usr/bin/env bash
set -euo pipefail
if command -v ufw >/dev/null 2>&1 && sudo ufw status | grep -q "Status: active"; then
  echo "Allowing 3030/tcp and 8080/tcp via UFW"
  sudo ufw allow 3030/tcp || true
  sudo ufw allow 8080/tcp || true
else
  echo "UFW not active or not installed; skipping."
fi
