from fastapi import APIRouter, HTTPException
from app.db import SessionLocal
from app import models
from app.schemas import LoginRequest, Token
from app.auth import create_access_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(payload: LoginRequest):
  with SessionLocal() as db:
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
      raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token(str(user.id))}
