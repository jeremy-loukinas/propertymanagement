#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
docker compose -f docker-compose.yml config >/dev/null && echo "compose OK"
[ -f docker-compose.override.yml ] && docker compose config >/dev/null && echo "compose+override OK" || true
