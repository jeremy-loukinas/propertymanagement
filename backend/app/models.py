from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, Text, Date, DateTime
from datetime import datetime, date
from app.db import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(32))
    role: Mapped[str] = mapped_column(String(32), default="Manager")
    password_hash: Mapped[str] = mapped_column(String(255))

class Property(Base):
    __tablename__ = "properties"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160))
    address: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(120))
    state: Mapped[str] = mapped_column(String(64))
    zip: Mapped[str] = mapped_column(String(32))
    timezone: Mapped[str] = mapped_column(String(64), default="America/New_York")
    active: Mapped[bool] = mapped_column(Boolean, default=True)

class Unit(Base):
    __tablename__ = "units"
    id: Mapped[int] = mapped_column(primary_key=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"))
    unit_code: Mapped[str] = mapped_column(String(64))
    beds: Mapped[int] = mapped_column(Integer, default=1)
    baths: Mapped[float] = mapped_column(Float, default=1.0)
    notes: Mapped[str | None] = mapped_column(Text)

class Guest(Base):
    __tablename__ = "guests"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(80))
    last_name: Mapped[str] = mapped_column(String(80))
    phone: Mapped[str | None] = mapped_column(String(32))
    email: Mapped[str | None] = mapped_column(String(120))

class Booking(Base):
    __tablename__ = "bookings"
    id: Mapped[int] = mapped_column(primary_key=True)
    external_id: Mapped[str | None] = mapped_column(String(255), index=True)
    source: Mapped[str] = mapped_column(String(64))
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id"))
    guest_id: Mapped[int | None] = mapped_column(ForeignKey("guests.id"))
    status: Mapped[str] = mapped_column(String(32), default="reserved")
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    party_size: Mapped[int | None] = mapped_column(Integer)

class Ticket(Base):
    __tablename__ = "tickets"
    id: Mapped[int] = mapped_column(primary_key=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"))
    unit_id: Mapped[int | None] = mapped_column(ForeignKey("units.id"))
    booking_id: Mapped[int | None] = mapped_column(ForeignKey("bookings.id"))
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    priority: Mapped[str] = mapped_column(String(8), default="P2")
    category: Mapped[str] = mapped_column(String(64))
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="New")
    sla_due_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Vendor(Base):
    __tablename__ = "vendors"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160))
    phone: Mapped[str | None] = mapped_column(String(32))
    email: Mapped[str | None] = mapped_column(String(120))
    insurance_expires_on: Mapped[date | None] = mapped_column(Date)
    notes: Mapped[str | None] = mapped_column(Text)

class Integration(Base):
    __tablename__ = "integrations"
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(64))
    label: Mapped[str] = mapped_column(String(160))
    config_json: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="active")
    last_sync_at: Mapped[datetime | None] = mapped_column(DateTime)

class ServiceCall(Base):
    __tablename__ = "service_calls"
    id: Mapped[int] = mapped_column(primary_key=True)
    booking_id: Mapped[int | None] = mapped_column(ForeignKey("bookings.id"))
    guest_name: Mapped[str] = mapped_column(String(160))
    phone: Mapped[str | None] = mapped_column(String(32))
    issue: Mapped[str] = mapped_column(String(200))
    notes: Mapped[str | None] = mapped_column(Text)
    priority: Mapped[str] = mapped_column(String(8), default="P2")
    status: Mapped[str] = mapped_column(String(32), default="Open")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime)
