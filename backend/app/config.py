from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    app_version: str = "dev"
    database_url: str
    redis_url: str
    jwt_secret: str
    admin_email: str
    admin_password: str
    minio_endpoint: str | None = None
    minio_access_key: str | None = None
    minio_secret_key: str | None = None
    class Config:
        env_prefix = ""
        env_file = ".env"
settings = Settings(_env_file="/app/.env" if __name__ != "__main__" else ".env")
