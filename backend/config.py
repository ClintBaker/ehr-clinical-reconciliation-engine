from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    api_key: str = Field(..., alias="API_KEY")
    openai_api_key: str = Field(..., alias="OPENAI_API_KEY")
    openai_model: str = Field("gpt-4.1-mini", alias="OPENAI_MODEL")

    cors_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:5173"],
        alias="CORS_ORIGINS",
    )

    cache_ttl_seconds: int = Field(600, alias="CACHE_TTL_SECONDS")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        populate_by_name = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

