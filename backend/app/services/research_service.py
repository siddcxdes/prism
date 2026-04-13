from sqlalchemy.orm import Session
from app.models.research import Research
from app.ai.groq_client import run_research
import json
import uuid

def create_research_report(query: str, org_id: str, user_id: str, db: Session):
    raw_result = run_research(query)
    
    try:
        start = raw_result.find("{")
        end = raw_result.rfind("}") + 1
        json_str = raw_result[start:end]
        parsed = json.loads(json_str)
    except Exception:
        parsed = {
            "summary": raw_result,
            "key_insights": [],
            "sentiment": "neutral",
            "sources": [],
            "trends": ""
        }
    
    # Ensure confidence_score is an integer
    confidence = parsed.get("confidence_score")
    if confidence is not None:
        try:
            confidence = int(confidence)
        except (ValueError, TypeError):
            confidence = None

    report = Research(
        org_id=org_id,
        created_by=user_id,
        query=query,
        summary=parsed.get("summary", ""),
        sources=parsed.get("sources", []),
        key_insights=parsed.get("key_insights", []),
        trends=parsed.get("trends", ""),
        sentiment=parsed.get("sentiment", "neutral"),
        confidence_score=confidence,
        query_type=parsed.get("query_type"),
        news_articles=parsed.get("news_articles"),
        company_overview=parsed.get("company_overview"),
        financial_comparison=parsed.get("financial_comparison"),
        top_companies=parsed.get("top_companies"),
        stock_data=parsed.get("stock_data"),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return report

def get_research_reports(org_id: str, db: Session):
    reports = db.query(Research).filter(
        Research.org_id == org_id
    ).order_by(Research.created_at.desc()).all()
    return reports

def get_research_report_by_id(report_id: str, org_id: str, db: Session):
    report = db.query(Research).filter(
        Research.id == report_id,
        Research.org_id == org_id
    ).first()
    return report