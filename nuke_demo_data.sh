#!/usr/bin/env bash
set -euo pipefail
docker compose exec backend python - <<'PY'
from app.db import SessionLocal
from app import models
with SessionLocal() as db:
    for M in [models.Booking, models.Ticket, models.ServiceCall, models.Unit, models.Property, models.Guest, models.Vendor, models.Integration]:
        db.query(M).delete()
    db.commit()
print("✅ Sample/demo rows cleared.")
PY
