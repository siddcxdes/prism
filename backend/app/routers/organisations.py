from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.organisation import Organisation
from app.models.user import User
from app.schemas.organisation import OrganisationCreate, OrganisationResponse
from app.dependencies import get_current_user
import secrets

router = APIRouter(prefix="/organisations", tags=["organisations"])

@router.post("/", response_model=OrganisationResponse)
def create_organisation(
    request: OrganisationCreate,
    db: Session = Depends(get_db)
):
    # Check if org name already exists
    existing = db.query(Organisation).filter(
        Organisation.name == request.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Organisation already exists")

    # Auto generate invite code
    invite_code = secrets.token_hex(8)

    # Create org
    new_org = Organisation(
        name=request.name,
        invite_code=invite_code
    )
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    return new_org

@router.get("/me", response_model=OrganisationResponse)
def get_my_organisation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    org = db.query(Organisation).filter(
        Organisation.id == current_user.org_id
    ).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")
    return org