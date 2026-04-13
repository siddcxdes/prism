from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.watchlist import WatchlistAdd, WatchlistResponse
from app.models.watchlist import Watchlist
from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

@router.get('/', response_model=list[WatchlistResponse])
def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(Watchlist).filter(
        Watchlist.org_id == current_user.org_id
    ).order_by(Watchlist.created_at.desc()).all()
    return items

@router.post('/', response_model=WatchlistResponse)
def add_to_watchlist(
    request: WatchlistAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Watchlist).filter(
        Watchlist.org_id == current_user.org_id,
        Watchlist.ticker == request.ticker.upper()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in watchlist")

    item = Watchlist(
        org_id=current_user.org_id,
        created_by=current_user.id,
        company_name=request.company_name,
        ticker=request.ticker.upper(),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete('/{item_id}')
def remove_from_watchlist(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Watchlist).filter(
        Watchlist.id == item_id,
        Watchlist.org_id == current_user.org_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(item)
    db.commit()
    return {"message": "Removed from watchlist"}
