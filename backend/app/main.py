from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base, safe_bootstrap
from app.routers import auth, bookings, tickets, integrations, calls, vendors, assets, metrics, guests
from app.config import settings

app = FastAPI(title="PropertyOps API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
Base.metadata.create_all(bind=engine); safe_bootstrap()
app.include_router(auth.router); app.include_router(bookings.router); app.include_router(tickets.router)
app.include_router(integrations.router); app.include_router(calls.router); app.include_router(vendors.router)
app.include_router(assets.router); app.include_router(metrics.router); app.include_router(guests.router)
@app.get("/health")
async def health(): return {"ok": True, "version": settings.app_version}
