from fastapi import APIRouter
from datetime import date
from app.db import SessionLocal
from app import models
from app.schemas import BookingOut

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.get("/", response_model=list[BookingOut])
def list_bookings(start: date, end: date, property_id: int | None = None):
    with SessionLocal() as db:
        q = db.query(models.Booking).filter(models.Booking.start_date <= end, models.Booking.end_date >= start)
        return q.all()
