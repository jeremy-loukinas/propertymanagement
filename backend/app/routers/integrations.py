from fastapi import APIRouter
from app.db import SessionLocal
from app import models
from app.schemas import ICalLinkIn

router = APIRouter(prefix="/api/integrations", tags=["integrations"])

@router.post("/airbnb/ical")
def add_ical_link(payload: ICalLinkIn):
    with SessionLocal() as db:
        integ = models.Integration(type="airbnb:ical", label=f"Unit {payload.unit_id}", config_json=payload.ical_url)
        db.add(integ); db.commit(); db.refresh(integ)
        return {"id": integ.id, "status": "ok"}
