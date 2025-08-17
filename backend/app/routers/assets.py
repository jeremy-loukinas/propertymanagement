from fastapi import APIRouter
from app.db import SessionLocal
from app import models
from app.schemas import PropertyIn, PropertyOut, UnitIn, UnitOut

router = APIRouter(prefix="/api/assets", tags=["properties_units"])

@router.post("/properties", response_model=PropertyOut)
def create_property(payload: PropertyIn):
    with SessionLocal() as db:
        p = models.Property(**payload.model_dump(), active=True)
        db.add(p); db.commit(); db.refresh(p)
        return p

@router.get("/properties", response_model=list[PropertyOut])
def list_properties():
    with SessionLocal() as db:
        return db.query(models.Property).order_by(models.Property.name.asc()).all()

@router.post("/units", response_model=UnitOut)
def create_unit(payload: UnitIn):
    with SessionLocal() as db:
        u = models.Unit(**payload.model_dump())
        db.add(u); db.commit(); db.refresh(u)
        return u

@router.get("/units", response_model=list[UnitOut])
def list_units(property_id: int | None = None):
    with SessionLocal() as db:
        q = db.query(models.Unit)
        if property_id:
            q = q.filter(models.Unit.property_id == property_id)
        return q.all()
