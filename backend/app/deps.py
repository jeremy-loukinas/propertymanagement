from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings

security = HTTPBearer()
ALG = "HS256"

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, settings.jwt_secret, algorithms=[ALG])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
