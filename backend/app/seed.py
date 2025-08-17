from app.db import engine, Base, SessionLocal
from app import models
from app.auth import make_password_hash
from app.config import settings
from datetime import date, timedelta

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    # Admin
    if not db.query(models.User).filter(models.User.email == settings.admin_email).first():
        db.add(models.User(name="Admin", email=settings.admin_email, password_hash=make_password_hash(settings.admin_password), role="Admin"))
        db.commit()

    # Seed one property, units, and a couple bookings
    if not db.query(models.Property).first():
        p = models.Property(name="Main St Apartments", address="123 Main St", city="Columbus", state="OH", zip="43004", timezone="America/New_York", active=True)
        db.add(p); db.commit(); db.refresh(p)
        u1 = models.Unit(property_id=p.id, unit_code="A1", beds=2, baths=1.0)
        u2 = models.Unit(property_id=p.id, unit_code="B2", beds=3, baths=2.0)
        db.add_all([u1,u2]); db.commit(); db.refresh(u1); db.refresh(u2)
        # Sample bookings
        today = date.today()
        b1 = models.Booking(source="sample", unit_id=u1.id, start_date=today, end_date=today+timedelta(days=2), party_size=2)
        b2 = models.Booking(source="sample", unit_id=u2.id, start_date=today+timedelta(days=1), end_date=today+timedelta(days=3), party_size=4)
        db.add_all([b1,b2]); db.commit()

    # One sample open ticket
    if not db.query(models.Ticket).first():
        t = models.Ticket(property_id=1, unit_id=1, priority="P2", category="Maintenance", title="Leaky faucet", description="Guest reported drip", status="New")
        db.add(t); db.commit()
