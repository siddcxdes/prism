from sqlalchemy import Column, String, DateTime, Text, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.database.database import Base

class Research(Base):
    __tablename__ = "research"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=False)
    query = Column(String, nullable=False)
    summary = Column(Text)
    sources = Column(JSON)
    key_insights = Column(JSON)
    trends = Column(Text)
    sentiment = Column(String)
    stock_data = Column(JSON)
    news_articles = Column(JSON)
    company_overview = Column(JSON)
    financial_comparison = Column(JSON)
    confidence_score = Column(Integer)
    query_type = Column(String)
    top_companies = Column(JSON)
    tags = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
