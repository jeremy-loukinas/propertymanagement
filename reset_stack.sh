#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Stopping & removing containers + volumes..."
sudo docker compose down -v || true
echo "Pruning dangling images..."
sudo docker image prune -f || true
echo "Ensuring .env exists..."
cp -n .env.example .env
echo "Rebuilding images (no cache)..."
sudo docker compose build --no-cache
echo "Starting stack..."
sudo docker compose up -d
echo "Waiting for API..."
for i in {1..60}; do
  if curl -fsS http://localhost:8080/health >/dev/null; then echo "API is up"; break; fi
  sleep 2
done
echo "Seeding admin..."
sudo docker compose exec backend python -m app.seed || true
echo "Done. UI: http://$(hostname -I | awk '{print $1}'):3030"
