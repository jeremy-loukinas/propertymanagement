from pydantic import BaseModel, EmailStr
from datetime import date, datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class BookingIn(BaseModel):
    unit_id: int
    start_date: date
    end_date: date
    party_size: int | None = None

class BookingOut(BookingIn):
    id: int
    class Config:
        from_attributes = True

class TicketIn(BaseModel):
    property_id: int
    unit_id: int | None = None
    booking_id: int | None = None
    priority: str = "P2"
    category: str
    title: str
    description: str

class TicketOut(TicketIn):
    id: int
    status: str
    created_at: datetime
    sla_due_at: datetime | None = None
    class Config:
        from_attributes = True

class ICalLinkIn(BaseModel):
    property_id: int
    unit_id: int
    ical_url: str

class ServiceCallIn(BaseModel):
    booking_id: int | None = None
    guest_name: str
    phone: str | None = None
    issue: str
    notes: str | None = None
    priority: str = "P2"

class ServiceCallOut(ServiceCallIn):
    id: int
    status: str
    created_at: datetime
    resolved_at: datetime | None = None
    class Config:
        from_attributes = True

class VendorIn(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None
    insurance_expires_on: date | None = None
    notes: str | None = None

class VendorOut(VendorIn):
    id: int
    class Config:
        from_attributes = True

class PropertyIn(BaseModel):
    name: str
    address: str
    city: str
    state: str
    zip: str
    timezone: str = "America/New_York"

class PropertyOut(BaseModel):
    id: int
    name: str
    address: str
    city: str
    state: str
    zip: str
    timezone: str
    active: bool
    class Config:
        from_attributes = True

class UnitIn(BaseModel):
    property_id: int
    unit_code: str
    beds: int = 1
    baths: float = 1.0
    notes: str | None = None

class UnitOut(UnitIn):
    id: int
    class Config:
        from_attributes = True
