#!/usr/bin/env bash
set -euo pipefail
if [ $# -ne 1 ]; then echo "Usage: $0 <server-ip-or-hostname>"; exit 1; fi
IP="$1"
cat > docker-compose.override.yml <<YAML
services:
  frontend:
    environment:
      NEXT_PUBLIC_API_BASE: http://$IP:8080
YAML
docker compose build frontend
docker compose up -d frontend
echo "Frontend now points to http://$IP:8080  (Open http://$IP:3030)"
