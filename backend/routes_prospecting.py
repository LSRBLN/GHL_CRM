from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models import (
    ProspectingSearchRequest, SearchResponse, BusinessResult,
    LeadCreate, Lead, AuditReportCreate, AuditReport
)
from report_generator import generate_mock_businesses, generate_audit_report
from google_places import search_google_places
import logging
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/prospecting", tags=["prospecting"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db_name = os.environ.get('DB_NAME', 'highlevel')
db = client[db_name]


@router.post("/search", response_model=SearchResponse)
async def search_businesses(request: ProspectingSearchRequest):
    """Search for businesses by keyword and location."""
    try:
        businesses = generate_mock_businesses(request.keyword, request.location)
        return SearchResponse(
            businesses=businesses,
            total=len(businesses),
            keyword=request.keyword,
            location=request.location,
        )
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/leads")
async def save_lead(lead_data: LeadCreate):
    """Save a business as a lead/prospect."""
    try:
        lead = Lead(
            id=str(uuid.uuid4()),
            name=lead_data.name,
            address=lead_data.address,
            phone=lead_data.phone,
            website=lead_data.website,
            rating=lead_data.rating,
            review_count=lead_data.review_count,
            category=lead_data.category,
            conversion_rate=lead_data.conversion_rate,
            online_presence=lead_data.online_presence,
            status="Hinzugef\u00fcgt",
            created_at=datetime.utcnow(),
        )
        await db.leads.insert_one(lead.dict())
        return {"success": True, "lead_id": lead.id, "message": "Lead erfolgreich gespeichert"}
    except Exception as e:
        logger.error(f"Save lead error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/leads")
async def get_leads():
    """Get all saved leads."""
    try:
        leads = await db.leads.find().sort("created_at", -1).to_list(1000)
        for lead in leads:
            lead.pop("_id", None)
        return {"leads": leads, "total": len(leads)}
    except Exception as e:
        logger.error(f"Get leads error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/report")
async def create_report(report_data: AuditReportCreate):
    """Generate and save a marketing audit report."""
    try:
        report = generate_audit_report(
            business_name=report_data.business_name,
            address=report_data.address,
            phone=report_data.phone,
            website=report_data.website,
            rating=report_data.rating,
            review_count=report_data.review_count,
            lead_id=report_data.lead_id,
        )

        report_dict = report.dict()
        report_dict["created_at"] = datetime.utcnow()
        await db.audit_reports.insert_one(report_dict)
        report_dict.pop("_id", None)

        return report_dict
    except Exception as e:
        logger.error(f"Create report error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/report/{report_id}")
async def get_report(report_id: str):
    """Get a saved audit report."""
    try:
        report = await db.audit_reports.find_one({"id": report_id})
        if not report:
            raise HTTPException(status_code=404, detail="Bericht nicht gefunden")
        report.pop("_id", None)
        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get report error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reports")
async def get_all_reports():
    """Get all audit reports."""
    try:
        reports = await db.audit_reports.find().sort("created_at", -1).to_list(100)
        for report in reports:
            report.pop("_id", None)
        return {"reports": reports, "total": len(reports)}
    except Exception as e:
        logger.error(f"Get reports error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    """Delete a lead."""
    try:
        result = await db.leads.delete_one({"id": lead_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Lead nicht gefunden")
        return {"success": True, "message": "Lead gel\u00f6scht"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete lead error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
