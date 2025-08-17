# Seeder kept for reference but NOT called by setup script.
# You can run it manually if you want demo data:
#   docker compose exec backend python -m app.seed
from app.db import engine, Base, SessionLocal, safe_bootstrap
from app import models
from app.auth import make_password_hash
from app.config import settings
from datetime import date, timedelta
Base.metadata.create_all(bind=engine); safe_bootstrap()
with SessionLocal() as db:
  if not db.query(models.User).filter(models.User.email == settings.admin_email).first():
    db.add(models.User(name="Admin", email=settings.admin_email, password_hash=make_password_hash(settings.admin_password), role="Admin")); db.commit()
  # Commented out demo content by default.
  # (Uncomment to add sample properties/units/guests/bookings if needed.)
