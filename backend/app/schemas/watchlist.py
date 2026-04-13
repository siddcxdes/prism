from pydantic import BaseModel, field_serializer
from datetime import datetime
from uuid import UUID

class WatchlistAdd(BaseModel):
    company_name: str
    ticker: str

class WatchlistResponse(BaseModel):
    id: UUID
    company_name: str
    ticker: str
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_serializer('id')
    def serialize_id(self, v):
        return str(v)
