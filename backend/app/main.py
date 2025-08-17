from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base
from app.routers import auth, bookings, tickets, integrations, calls, vendors, assets, metrics

app = FastAPI(title="PropertyOps API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(tickets.router)
app.include_router(integrations.router)
app.include_router(calls.router)
app.include_router(vendors.router)
app.include_router(assets.router)
app.include_router(metrics.router)

@app.get("/health")
async def health():
    return {"ok": True}
