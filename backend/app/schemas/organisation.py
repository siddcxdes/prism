from pydantic import BaseModel, field_serializer
from datetime import datetime
from uuid import UUID

class OrganisationCreate(BaseModel):
    name: str

class OrganisationResponse(BaseModel):
    id: UUID
    name: str
    invite_code: str
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_serializer('id')
    def serialize_id(self, v):
        return str(v)