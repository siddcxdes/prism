import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, research, organisations, watchlist
from app.database.database import engine, Base
from app.models import research as research_model
from app.models import watchlist as watchlist_model

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Market Research API")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]
if os.getenv("FRONTEND_URL"):
    origins.append(os.getenv("FRONTEND_URL").rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(research.router)
app.include_router(organisations.router)
app.include_router(watchlist.router)

@app.get("/")
def root():
    return {"message": "Market Research API is running!"}