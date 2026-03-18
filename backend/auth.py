from fastapi import Depends, Header, HTTPException, status

from .config import settings


async def verify_api_key(x_api_key: str = Header(..., alias="X-API-Key")) -> str:
    if not settings.api_key or x_api_key != settings.api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
    return x_api_key


def get_auth_dependency() -> Depends:
    return Depends(verify_api_key)

