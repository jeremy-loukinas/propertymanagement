from fastapi import APIRouter, HTTPException, Query
from datetime import date
from app.db import SessionLocal
from app import models
from app.schemas import BookingOut, BookingDetails, BookingIn

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.post("/", response_model=BookingOut)
def create_booking(payload: BookingIn):
  with SessionLocal() as db:
    b = models.Booking(source="manual", **payload.model_dump())
    db.add(b); db.commit(); db.refresh(b); return b

@router.get("/", response_model=list[BookingOut])
def list_bookings(start: date, end: date, property_id: int | None = None):
  with SessionLocal() as db:
    q = db.query(models.Booking).filter(models.Booking.start_date <= end, models.Booking.end_date >= start)
    if property_id:
      unit_ids = [u.id for u in db.query(models.Unit).filter(models.Unit.property_id == property_id).all()]
      if unit_ids: q = q.filter(models.Booking.unit_id.in_(unit_ids))
      else: return []
    return q.all()

@router.get("/details", response_model=list[BookingDetails])
def list_booking_details(start: date, end: date, property_id: int | None = None):
  with SessionLocal() as db:
    q = db.query(models.Booking).filter(models.Booking.start_date <= end, models.Booking.end_date >= start)
    if property_id:
      unit_ids = [u.id for u in db.query(models.Unit).filter(models.Unit.property_id == property_id).all()]
      if unit_ids: q = q.filter(models.Booking.unit_id.in_(unit_ids))
      else: return []
    bookings = q.all()
    items = []
    for b in bookings:
      unit = db.get(models.Unit, b.unit_id)
      prop = db.get(models.Property, unit.property_id) if unit else None
      guest = db.get(models.Guest, b.guest_id) if b.guest_id else None
      guest_dict = None
      if guest:
        guest_dict = {"id": guest.id,"first_name": guest.first_name,"last_name": guest.last_name,"phone": guest.phone,"email": guest.email,"photo_url": guest.photo_url}
      items.append({"id": b.id,"start_date": b.start_date,"end_date": b.end_date,"unit_id": b.unit_id,"unit_code": unit.unit_code if unit else "","property_id": prop.id if prop else 0,"property_name": prop.name if prop else "","source": b.source,"guest": guest_dict})
    return items

@router.patch("/{booking_id}/assign-guest", response_model=BookingOut)
def assign_guest(booking_id: int, guest_id: int = Query(...)):
  with SessionLocal() as db:
    b = db.get(models.Booking, booking_id)
    if not b: raise HTTPException(status_code=404, detail="booking not found")
    g = db.get(models.Guest, guest_id)
    if not g: raise HTTPException(status_code=404, detail="guest not found")
    b.guest_id = guest_id; db.commit(); db.refresh(b); return b

@router.delete("/{booking_id}")
def delete_booking(booking_id: int):
  with SessionLocal() as db:
    # delete dependent tickets first
    db.query(models.Ticket).filter(models.Ticket.booking_id == booking_id).delete()
    b = db.get(models.Booking, booking_id)
    if not b: raise HTTPException(status_code=404, detail="Not found")
    db.delete(b); db.commit(); return {"ok": True}
