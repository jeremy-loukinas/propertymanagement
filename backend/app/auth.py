from datetime import datetime, timedelta
from jose import jwt
from passlib.hash import bcrypt
from app.config import settings
ALG = "HS256"
def make_password_hash(password: str) -> str: return bcrypt.hash(password)
def verify_password(password: str, pw_hash: str) -> bool: return bcrypt.verify(password, pw_hash)
def create_access_token(sub: str, minutes: int = 60*12) -> str:
  payload = {"sub": sub, "exp": datetime.utcnow() + timedelta(minutes=minutes)}
  return jwt.encode(payload, settings.jwt_secret, algorithm=ALG)
