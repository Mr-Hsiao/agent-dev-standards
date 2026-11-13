from fastapi import FastAPI

from app.api.v1.endpoints.users import router as users_router

app = FastAPI(title="FastAPI Service", version="1.0.0")
app.include_router(users_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
