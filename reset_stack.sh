#!/usr/bin/env bash
set -euo pipefail
docker compose down -v || true
docker image prune -f || true
docker compose build --no-cache
docker compose up -d
