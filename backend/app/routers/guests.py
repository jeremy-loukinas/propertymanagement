from fastapi import APIRouter, HTTPException
from app.db import SessionLocal
from app import models
from app.schemas import GuestIn, GuestOut

router = APIRouter(prefix="/api/guests", tags=["guests"])

@router.post("/", response_model=GuestOut)
def create_guest(payload: GuestIn):
  with SessionLocal() as db:
    g = models.Guest(**payload.model_dump()); db.add(g); db.commit(); db.refresh(g); return g

@router.get("/", response_model=list[GuestOut])
def list_guests(q: str | None = None):
  with SessionLocal() as db:
    query = db.query(models.Guest)
    if q:
      like = f"%{q}%"
      query = query.filter((models.Guest.first_name.ilike(like)) | (models.Guest.last_name.ilike(like)))
    return query.order_by(models.Guest.last_name.asc()).all()

@router.delete("/{guest_id}")
def delete_guest(guest_id: int):
  with SessionLocal() as db:
    # unlink bookings before delete
    bookings = db.query(models.Booking).filter(models.Booking.guest_id == guest_id).all()
    for b in bookings: b.guest_id = None
    g = db.get(models.Guest, guest_id)
    if not g: raise HTTPException(status_code=404, detail="Not found")
    db.delete(g); db.commit(); return {"ok": True}
