#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Services:"
sudo docker compose ps
echo
echo "Recent backend logs:"
sudo docker compose logs --no-color --tail=80 backend || true
