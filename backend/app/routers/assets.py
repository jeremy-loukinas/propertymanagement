from fastapi import APIRouter, HTTPException
from app.db import SessionLocal
from app import models
from app.schemas import PropertyIn, PropertyOut, UnitIn, UnitOut

router = APIRouter(prefix="/api/assets", tags=["properties_units"])

@router.post("/properties", response_model=PropertyOut)
def create_property(payload: PropertyIn):
  with SessionLocal() as db:
    p = models.Property(**payload.model_dump(), active=True); db.add(p); db.commit(); db.refresh(p); return p

@router.get("/properties", response_model=list[PropertyOut])
def list_properties():
  with SessionLocal() as db: return db.query(models.Property).order_by(models.Property.name.asc()).all()

@router.delete("/properties/{prop_id}")
def delete_property(prop_id: int):
  with SessionLocal() as db:
    # cascade-like deletion
    units = db.query(models.Unit).filter(models.Unit.property_id == prop_id).all()
    unit_ids = [u.id for u in units]
    if unit_ids:
      db.query(models.Ticket).filter(models.Ticket.unit_id.in_(unit_ids)).delete(synchronize_session=False)
      db.query(models.Booking).filter(models.Booking.unit_id.in_(unit_ids)).delete(synchronize_session=False)
      db.query(models.Unit).filter(models.Unit.id.in_(unit_ids)).delete(synchronize_session=False)
    db.query(models.Ticket).filter(models.Ticket.property_id == prop_id).delete(synchronize_session=False)
    p = db.get(models.Property, prop_id)
    if not p: raise HTTPException(status_code=404, detail="Not found")
    db.delete(p); db.commit(); return {"ok": True}

@router.post("/units", response_model=UnitOut)
def create_unit(payload: UnitIn):
  with SessionLocal() as db:
    u = models.Unit(**payload.model_dump()); db.add(u); db.commit(); db.refresh(u); return u

@router.get("/units", response_model=list[UnitOut])
def list_units(property_id: int | None = None):
  with SessionLocal() as db:
    q = db.query(models.Unit)
    if property_id: q = q.filter(models.Unit.property_id == property_id)
    return q.all()

@router.delete("/units/{unit_id}")
def delete_unit(unit_id: int):
  with SessionLocal() as db:
    db.query(models.Ticket).filter(models.Ticket.unit_id == unit_id).delete(synchronize_session=False)
    db.query(models.Booking).filter(models.Booking.unit_id == unit_id).delete(synchronize_session=False)
    u = db.get(models.Unit, unit_id)
    if not u: raise HTTPException(status_code=404, detail="Not found")
    db.delete(u); db.commit(); return {"ok": True}
