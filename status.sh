#!/usr/bin/env bash
set -euo pipefail
docker compose ps
echo
docker compose logs --no-color --tail=200 backend || true
