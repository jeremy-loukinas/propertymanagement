from fastapi import APIRouter, HTTPException
from app.db import SessionLocal
from app import models
from app.schemas import ServiceCallIn, ServiceCallOut
from datetime import datetime

router = APIRouter(prefix="/api/calls", tags=["service_calls"])

@router.post("/", response_model=ServiceCallOut)
def create_call(payload: ServiceCallIn):
    with SessionLocal() as db:
        c = models.ServiceCall(**payload.model_dump())
        db.add(c); db.commit(); db.refresh(c)
        return c

@router.get("/", response_model=list[ServiceCallOut])
def list_calls(status: str | None = None):
    with SessionLocal() as db:
        q = db.query(models.ServiceCall)
        if status:
            q = q.filter(models.ServiceCall.status == status)
        return q.order_by(models.ServiceCall.created_at.desc()).all()

@router.patch("/{call_id}", response_model=ServiceCallOut)
def update_call(call_id: int, status: str | None = None, notes: str | None = None):
    with SessionLocal() as db:
        c = db.get(models.ServiceCall, call_id)
        if not c:
            raise HTTPException(status_code=404, detail="Not found")
        if status:
            c.status = status
            if status.lower() in ("done","resolved","closed"):
                c.resolved_at = datetime.utcnow()
        if notes is not None:
            c.notes = (c.notes or "") + f"\n{notes}"
        db.commit(); db.refresh(c)
        return c
