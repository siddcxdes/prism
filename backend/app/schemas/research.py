from pydantic import BaseModel, field_serializer
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class ResearchRequest(BaseModel):
    query: str

class ResearchResponse(BaseModel):
    id: UUID
    query: str
    summary: Optional[str] = ""
    sources: Optional[List[str]] = []
    sentiment: Optional[str] = "neutral"
    key_insights: Optional[List[str]] = []
    trends: Optional[str] = ""
    stock_data: dict | None = None
    news_articles: list | None = None
    company_overview: dict | None = None
    financial_comparison: list | None = None
    confidence_score: int | None = None
    query_type: str | None = None
    top_companies: list | None = None
    tags: list | None = []
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_serializer('id')
    def serialize_id(self, v):
        return str(v)

class TagUpdateRequest(BaseModel):
    tags: List[str]