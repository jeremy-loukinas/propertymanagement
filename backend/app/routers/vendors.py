from fastapi import APIRouter, HTTPException
from app.db import SessionLocal
from app import models
from app.schemas import VendorIn, VendorOut

router = APIRouter(prefix="/api/vendors", tags=["vendors"])

@router.post("/", response_model=VendorOut)
def create_vendor(payload: VendorIn):
    with SessionLocal() as db:
        v = models.Vendor(**payload.model_dump())
        db.add(v); db.commit(); db.refresh(v)
        return v

@router.get("/", response_model=list[VendorOut])
def list_vendors():
    with SessionLocal() as db:
        return db.query(models.Vendor).order_by(models.Vendor.name.asc()).all()

@router.delete("/{vendor_id}")
def delete_vendor(vendor_id: int):
    with SessionLocal() as db:
        v = db.get(models.Vendor, vendor_id)
        if not v:
            raise HTTPException(status_code=404, detail="Not found")
        db.delete(v); db.commit()
        return {"ok": True}
