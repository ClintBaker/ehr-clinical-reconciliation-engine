from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.routes import reconcile, data_quality


def create_app() -> FastAPI:
    app = FastAPI(title="Clinical Data Reconciliation Engine")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(reconcile.router, prefix="/api")
    app.include_router(data_quality.router, prefix="/api")

    @app.get("/health")
    async def health_check() -> dict:
        return {"status": "ok"}

    return app


app = create_app()

