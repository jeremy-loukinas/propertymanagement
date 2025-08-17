#!/usr/bin/env bash
set -euo pipefail

log(){ printf "\n\033[1;32m▶ %s\033[0m\n" "$*"; }
warn(){ printf "\n\033[1;33m⚠ %s\033[0m\n" "$*"; }

cd "$(dirname "$0")"

cp -n .env.example .env

log "Installing Docker Engine and Docker Compose v2 (Ubuntu 24.04)"
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo install -m 0755 -d /etc/apt/keyrings
if [ ! -f /etc/apt/keyrings/docker.asc ]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
  sudo chmod a+r /etc/apt/keyrings/docker.asc
fi

UBUNTU_CODENAME="$(. /etc/os-release && echo $VERSION_CODENAME)"
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker

# Add user to docker group
if ! groups "$USER" | grep -q '\bdocker\b'; then
  sudo usermod -aG docker "$USER" || true
  warn "You'll need to log out/in for 'docker' group to take effect."
fi

# Open service ports if UFW is active
if command -v ufw >/dev/null 2>&1 && sudo ufw status | grep -q "Status: active"; then
  ./open_ports.sh || true
fi

log "Building images"
sudo docker compose build

log "Starting services"
sudo docker compose up -d

log "Waiting for API (http://localhost:8080/health)"
for i in $(seq 1 60); do
  if curl -fsS http://localhost:8080/health >/dev/null 2>&1; then
    echo "API is up"
    break
  fi
  sleep 2
done

log "Seeding default admin"
sudo docker compose exec backend python -m app.seed || true

log "Done!"
echo "UI:  http://$(hostname -I | awk '{print $1}'):3030"
echo "API: http://$(hostname -I | awk '{print $1}'):8080/health"
