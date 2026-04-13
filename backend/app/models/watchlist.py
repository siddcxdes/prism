from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.database.database import Base

class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=False)
    company_name = Column(String, nullable=False)
    ticker = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
