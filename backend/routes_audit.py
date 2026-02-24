import uuid
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os

from google_places import fetch_place_details
from seo_analyzer import fetch_seo_analysis
from audit_report_builder import (
    build_audit_report,
    build_critical_info,
    analyze_tech_stack,
    fetch_website_html,
    detect_chat_widget,
    parse_review_response_rate,
    calculate_contact_score,
    build_website_performance,
)
from models import SEOAnalysis

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/audit", tags=["audit"])

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]


async def upsert_contact_from_place(place_payload: dict, category: Optional[str], tag: str, status: str) -> dict:
    result = place_payload.get("result", {})
    place_id = result.get("place_id")
    if not place_id:
        raise ValueError("place_id fehlt")

    contact = {
        "id": str(uuid.uuid4()),
        "google_place_id": place_id,
        "name": result.get("name"),
        "address": result.get("formatted_address"),
        "phone": result.get("formatted_phone_number") or result.get("international_phone_number"),
        "email": None,
        "website": result.get("website"),
        "rating": float(result.get("rating") or 0.0),
        "review_count": int(result.get("user_ratings_total") or 0),
        "category": category or None,
        "tags": [tag],
        "status": status,
        "score": calculate_contact_score(
            float(result.get("rating") or 0.0),
            int(result.get("user_ratings_total") or 0),
            bool(result.get("website")),
        ),
        "raw_google_places": place_payload,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_activity": datetime.utcnow(),
        "timeline": [],
    }

    existing = await db.contacts.find_one({"google_place_id": place_id})
    if existing:
        tags = list({*(existing.get("tags") or []), tag})
        updated = {
            **existing,
            **{
                "name": contact["name"],
                "address": contact["address"],
                "phone": contact["phone"],
                "website": contact["website"],
                "rating": contact["rating"],
                "review_count": contact["review_count"],
                "category": contact["category"],
                "tags": tags,
                "status": existing.get("status") or status,
                "score": contact["score"],
                "raw_google_places": place_payload,
                "updated_at": datetime.utcnow(),
            },
        }
        await db.contacts.update_one({"id": existing["id"]}, {"$set": updated})
        updated.pop("_id", None)
        return updated

    await db.contacts.insert_one(contact)
    contact.pop("_id", None)
    return contact


@router.post("/generate")
async def generate_audit_report(place_id: str = Query(...), category: Optional[str] = Query(None)):
    try:
        place_payload = await fetch_place_details(place_id)
    except Exception as exc:
        logger.error("Fehler bei Google Places Details: %s", exc)
        raise HTTPException(status_code=400, detail="Google Places Details konnten nicht geladen werden")

    contact = await upsert_contact_from_place(place_payload, category, tag="prospect", status="Prospect")

    details = place_payload.get("result", {})
    business_name = details.get("name", "")
    address = details.get("formatted_address", "")
    phone = details.get("formatted_phone_number") or details.get("international_phone_number")
    website = details.get("website")
    rating = float(details.get("rating") or 0.0)
    review_count = int(details.get("user_ratings_total") or 0)

    html, response_time = await fetch_website_html(website)
    chat_widget = detect_chat_widget(html)
    review_response_rate = parse_review_response_rate(details)
    critical_info = build_critical_info(phone, bool(website), chat_widget, review_response_rate)
    tech_stack = analyze_tech_stack(html, bool(website))

    seo_data = None
    try:
        seo_data = await fetch_seo_analysis(
            business_name=business_name,
            address=address,
            website=website,
            keyword=business_name.split()[0] if business_name else "Business",
        )
    except Exception as exc:
        logger.warning("SEO-Analyse fehlgeschlagen: %s", exc)
        seo_data = SEOAnalysis(score=0, avg_ranking="Nicht verfügbar", competitors=[], keyword_used=business_name)

    report = build_audit_report(
        business_name=business_name,
        address=address,
        phone=phone,
        website=website,
        rating=rating,
        review_count=review_count,
        lead_id=contact.get("id"),
        details=details,
        seo=seo_data,
        tech_stack=tech_stack,
        website_perf=build_website_performance(response_time, bool(website)),
        critical_info=critical_info,
    )

    report_dict = report.model_dump()
    report_dict["created_at"] = datetime.utcnow()
    report_dict["contact_id"] = contact.get("id")

    await db.reports.insert_one(report_dict)

    timeline_entry = {
        "id": str(uuid.uuid4()),
        "type": "report",
        "title": "Audit-Bericht erstellt",
        "details": "Marketing-Audit-Bericht wurde erstellt und gespeichert.",
        "created_at": datetime.utcnow(),
        "report_id": report_dict.get("id"),
    }

    await db.contacts.update_one(
        {"id": contact["id"]},
        {
            "$push": {"timeline": timeline_entry},
            "$set": {"last_activity": datetime.utcnow(), "updated_at": datetime.utcnow(), "score": report_dict.get("overall_score")},
        },
    )

    return {
        "report_id": report_dict.get("id"),
        "contact_id": contact.get("id"),
        "offer_params": {
            "name": business_name,
            "address": address,
            "phone": phone or "",
            "website": website or "",
            "rating": rating,
            "reviews": review_count,
            "score": report_dict.get("overall_score"),
            "report_id": report_dict.get("id"),
            "contact_id": contact.get("id"),
        },
    }
