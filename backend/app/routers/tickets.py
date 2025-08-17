from fastapi import APIRouter, HTTPException
from app.db import SessionLocal
from app import models
from app.schemas import TicketIn, TicketOut
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/tickets", tags=["tickets"])

DEFAULT_SLA = {"P0": 4, "P1": 24, "P2": 72, "P3": 7*24}

@router.post("/", response_model=TicketOut)
def create_ticket(payload: TicketIn):
  with SessionLocal() as db:
    hrs = DEFAULT_SLA.get(payload.priority, 72)
    ticket = models.Ticket(
      property_id=payload.property_id, unit_id=payload.unit_id, booking_id=payload.booking_id,
      priority=payload.priority, category=payload.category, title=payload.title,
      description=payload.description, status="New", sla_due_at=datetime.utcnow() + timedelta(hours=hrs),
    )
    db.add(ticket); db.commit(); db.refresh(ticket); return ticket

@router.get("/", response_model=list[TicketOut])
def list_tickets(status: str | None = None):
  with SessionLocal() as db:
    q = db.query(models.Ticket)
    if status: q = q.filter(models.Ticket.status == status)
    return q.order_by(models.Ticket.created_at.desc()).all()

@router.patch("/{ticket_id}", response_model=TicketOut)
def update_ticket(ticket_id: int, status: str | None = None):
  with SessionLocal() as db:
    t = db.get(models.Ticket, ticket_id)
    if not t: raise HTTPException(status_code=404, detail="Not found")
    if status:
      t.status = status; t.updated_at = datetime.utcnow(); db.commit(); db.refresh(t)
    return t

@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int):
  with SessionLocal() as db:
    t = db.get(models.Ticket, ticket_id)
    if not t: raise HTTPException(status_code=404, detail="Not found")
    db.delete(t); db.commit(); return {"ok": True}
