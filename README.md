# PropertyOps — Full Bundle (v0.8.0)

**What's new in v0.8.0**
- ✅ **No demo data by default** — setup script no longer runs the seeder.
- 🗑️ **Delete from UI** — delete buttons for Properties, Units, Bookings, Vendors, Tickets.
- 🧭 **Clear labels/help** — all forms now have field labels & hints.
- 🔗 **Airbnb iCal Admin** — labeled stats, list of saved iCal links with delete, and "Sync now" feedback.
- 🧹 `nuke_demo_data.sh` — optional one-shot script to clear any leftover sample rows.
- 🐍 Backend: DELETE endpoints added (`/api/assets/...`, `/api/bookings/...`, `/api/guests/...`, `/api/tickets/...`), iCal sync stamps `last_sync_at`.

## Install / Upgrade
```bash
unzip propertyops_full_0.8.0.zip -d ~/propertyops
cd ~/propertyops/propertyops_full_0_8_0
bash setup_ubuntu24.sh
bash set_api_to_server_ip.sh 192.168.1.192   # or your hostname/IP
bash validate_compose.sh
docker compose up -d --build
# (Seeder is DISABLED by default)
```

## Optional: Clear any old demo data
```bash
bash nuke_demo_data.sh
```

## Notes
- Compose is YAML-safe (no inline lists). `bcrypt` is pinned to avoid passlib issues.
