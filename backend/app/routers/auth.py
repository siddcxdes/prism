from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.database.database import get_db
from app.models.user import User
from app.models.organisation import Organisation
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.schemas.auth import AdminRegisterRequest
import secrets

def generate_invite_code():
    return secrets.token_hex(8)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    org = db.query(Organisation).filter(
        Organisation.invite_code == request.invite_code
    ).first()
    if not org:
        raise HTTPException(status_code=404, detail="Invalid invite code")

    hashed = hash_password(request.password)

    new_user = User(
        name=request.name,
        email=request.email,
        hashed_password=hashed,
        role="analyst",
        org_id=org.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully"}


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Step 1 - check if email exists
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Step 2 - verify password
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    # Step 3 - create JWT token
    token = create_access_token(data={
        "user_id": str(user.id),
        "org_id": str(user.org_id),
        "role": user.role
    })
    
    return {"access_token": token, "token_type": "bearer"}

@router.post("/admin/register")
def admin_register(request: AdminRegisterRequest, db: Session = Depends(get_db)):
    existing_org = db.query(Organisation).filter(
        Organisation.name == request.org_name
    ).first()
    if existing_org:
        raise HTTPException(status_code=400, detail="Organisation name already taken")
    
    org = Organisation(
        name=request.org_name,
        invite_code=generate_invite_code(),
    )
    db.add(org)
    db.commit()
    db.refresh(org)

    hashed = hash_password(request.password)

    new_user = User(
        name=request.name,
        email=request.email,
        hashed_password=hashed,
        role="admin",
        org_id=org.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={
    "user_id": str(new_user.id),
    "org_id": str(org.id),
    "role": "admin"
})

    return {
        "access_token": token,
        "token_type": "bearer",
        "invite_code": org.invite_code
    }

