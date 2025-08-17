from fastapi import APIRouter
from datetime import date
from app.db import SessionLocal
from app import models

router = APIRouter(prefix="/api/metrics", tags=["metrics"])

@router.get("/overview")
def overview(day: date | None = None):
  target = day or date.today()
  with SessionLocal() as db:
    arrivals = db.query(models.Booking).filter(models.Booking.start_date == target).count()
    departures = db.query(models.Booking).filter(models.Booking.end_date == target).count()
    inhouse = db.query(models.Booking).filter(models.Booking.start_date <= target, models.Booking.end_date >= target).count()
    open_tickets = db.query(models.Ticket).filter(models.Ticket.status != "Done").count()
    overdue = db.query(models.Ticket).filter(models.Ticket.sla_due_at != None, models.Ticket.sla_due_at < models.Ticket.updated_at).count()
    by_pri = {p: db.query(models.Ticket).filter(models.Ticket.priority == p, models.Ticket.status != "Done").count() for p in ["P0","P1","P2","P3"]}
    return {"arrivals":arrivals,"departures":departures,"inhouse":inhouse,"open_tickets":open_tickets,"open_by_priority":by_pri,"overdue_tickets":overdue,"day":str(target)}

@router.get("/properties-overview")
def properties_overview(day: date | None = None):
  target = day or date.today()
  with SessionLocal() as db:
    props = db.query(models.Property).all()
    out = []
    for p in props:
      units = db.query(models.Unit).filter(models.Unit.property_id == p.id).all()
      unit_ids = [u.id for u in units]
      bookings = []
      if unit_ids:
        rows = db.query(models.Booking).filter(
          models.Booking.unit_id.in_(unit_ids),
          models.Booking.start_date <= target,
          models.Booking.end_date >= target
        ).all()
        for b in rows:
          g = db.get(models.Guest, b.guest_id) if b.guest_id else None
          bookings.append({
            "booking_id": b.id,
            "unit_id": b.unit_id,
            "guest_name": f"{g.first_name} {g.last_name}" if g else None,
            "guest_photo_url": g.photo_url if g else None
          })
      out.append({"property_id": p.id, "property_name": p.name, "inhouse": bookings})
    return out
