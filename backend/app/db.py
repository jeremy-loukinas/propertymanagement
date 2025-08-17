from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
class Base(DeclarativeBase): pass
def safe_bootstrap():
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE IF EXISTS guests ADD COLUMN IF NOT EXISTS photo_url VARCHAR(512)"))
