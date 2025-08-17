from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from app.db import SessionLocal
from app import models
from app.schemas import ICalLinkIn, IntegrationOut

router = APIRouter(prefix="/api/integrations", tags=["integrations"])

@router.post("/airbnb/ical", response_model=IntegrationOut)
def add_ical_link(payload: ICalLinkIn):
  with SessionLocal() as db:
    integ = models.Integration(type="airbnb:ical", label=f"Unit {payload.unit_id}", config_json=payload.ical_url)
    db.add(integ); db.commit(); db.refresh(integ); return integ

@router.get("/airbnb/ical", response_model=list[IntegrationOut])
def list_icals():
  with SessionLocal() as db:
    return db.query(models.Integration).filter(models.Integration.type=="airbnb:ical").order_by(models.Integration.id.desc()).all()

@router.delete("/airbnb/ical/{integration_id}")
def delete_ical(integration_id: int):
  with SessionLocal() as db:
    integ = db.get(models.Integration, integration_id)
    if not integ: raise HTTPException(status_code=404, detail="not found")
    db.delete(integ); db.commit(); return {"ok": True}

@router.post("/airbnb/sync-now")
def sync_now(integration_id: int | None = Query(default=None)):
  from app.workers.tasks import sync_ical
  with SessionLocal() as db:
    if integration_id is not None:
      integ = db.get(models.Integration, integration_id)
      if not integ: raise HTTPException(status_code=404, detail="integration not found")
      ids = [integration_id]
    else:
      ids = [i.id for i in db.query(models.Integration).filter(models.Integration.type=="airbnb:ical").all()]
  done = 0
  for i in ids:
    sync_ical(i); done += 1
  return {"synced": done, "ids": ids}

@router.get("/stats")
def stats():
  from sqlalchemy import func
  with SessionLocal() as db:
    total_icals = db.query(models.Integration).filter(models.Integration.type=="airbnb:ical").count()
    last = db.query(func.max(models.Integration.last_sync_at)).scalar()
    total_bookings = db.query(models.Booking).count()
    return {"ical_integrations": total_icals, "last_sync_at": last.isoformat() if last else None, "total_bookings": total_bookings}
