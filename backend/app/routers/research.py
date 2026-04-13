from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.research import ResearchRequest, ResearchResponse, TagUpdateRequest
from app.services import research_service
from app.models.user import User
from app.models.research import Research
from app.dependencies import get_current_user

router = APIRouter(prefix="/research", tags=["research"])

@router.post('/', response_model=ResearchResponse)
def create_research(
    request: ResearchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = research_service.create_research_report(
        query=request.query,
        org_id=str(current_user.org_id),
        user_id=str(current_user.id),
        db=db
    )
    return report

@router.get('/', response_model=list[ResearchResponse])
def get_research(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    search: str = Query(default=None),
    tag: str = Query(default=None),
):
    query = db.query(Research).filter(Research.org_id == current_user.org_id)

    if search:
        query = query.filter(Research.query.ilike(f"%{search}%"))

    if tag:
        query = query.filter(Research.tags.contains([tag]))

    reports = query.order_by(Research.created_at.desc()).all()
    return reports

@router.get('/{report_id}', response_model=ResearchResponse)
def get_research_by_id(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = research_service.get_research_report_by_id(
        report_id=report_id,
        org_id=str(current_user.org_id),
        db=db
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.delete('/{report_id}')
def delete_research(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = research_service.get_research_report_by_id(
        report_id=report_id,
        org_id=str(current_user.org_id),
        db=db
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted"}

@router.patch('/{report_id}/tags', response_model=ResearchResponse)
def update_tags(
    report_id: str,
    request: TagUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = research_service.get_research_report_by_id(
        report_id=report_id,
        org_id=str(current_user.org_id),
        db=db
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.tags = request.tags
    db.commit()
    db.refresh(report)
    return report