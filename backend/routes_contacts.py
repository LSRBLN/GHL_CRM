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
from audit_report_builder import calculate_contact_score

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/contacts", tags=["contacts"])

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]


async def create_or_update_contact(place_payload: dict, category: Optional[str], tag: str, status: str) -> dict:
    result = place_payload.get("result", {})
    place_id = result.get("place_id")
    if not place_id:
        raise ValueError("place_id fehlt")

    existing = await db.contacts.find_one({"google_place_id": place_id})
    tags = list({tag, *(existing.get("tags") or [])}) if existing else [tag]

    contact = {
        "id": existing.get("id") if existing else str(uuid.uuid4()),
        "google_place_id": place_id,
        "name": result.get("name"),
        "address": result.get("formatted_address"),
        "phone": result.get("formatted_phone_number") or result.get("international_phone_number"),
        "email": existing.get("email") if existing else None,
        "website": result.get("website"),
        "rating": float(result.get("rating") or 0.0),
        "review_count": int(result.get("user_ratings_total") or 0),
        "category": category or existing.get("category") if existing else category,
        "tags": tags,
        "status": existing.get("status") if existing else status,
        "score": calculate_contact_score(
            float(result.get("rating") or 0.0),
            int(result.get("user_ratings_total") or 0),
            bool(result.get("website")),
        ),
        "raw_google_places": place_payload,
        "updated_at": datetime.utcnow(),
        "last_activity": datetime.utcnow(),
    }

    if existing:
        await db.contacts.update_one({"id": contact["id"]}, {"$set": contact})
        contact.pop("_id", None)
        return contact

    contact["created_at"] = datetime.utcnow()
    contact["timeline"] = [
        {
            "id": str(uuid.uuid4()),
            "type": "contact",
            "title": "Kontakt hinzugefügt",
            "details": "Kontakt wurde ins Adressbuch aufgenommen.",
            "created_at": datetime.utcnow(),
        }
    ]
    await db.contacts.insert_one(contact)
    contact.pop("_id", None)
    return contact


@router.post("/add")
async def add_contact(place_id: str = Query(...), category: Optional[str] = Query(None)):
    try:
        place_payload = await fetch_place_details(place_id)
    except Exception as exc:
        logger.error("Fehler bei Google Places Details: %s", exc)
        raise HTTPException(status_code=400, detail="Google Places Details konnten nicht geladen werden")

    contact = await create_or_update_contact(place_payload, category, tag="lead", status="New")
    return {"contact_id": contact.get("id")}


@router.get("")
async def list_contacts(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=5, le=50),
):
    filters = {}
    if search:
        regex = {"$regex": search, "$options": "i"}
        filters["$or"] = [
            {"name": regex},
            {"address": regex},
            {"phone": regex},
            {"email": regex},
        ]
    if status:
        filters["status"] = status

    total = await db.contacts.count_documents(filters)
    skip = (page - 1) * limit
    contacts = await (
        db.contacts.find(filters, {"_id": 0})
        .sort("updated_at", -1)
        .skip(skip)
        .limit(limit)
        .to_list(limit)
    )

    return {
        "contacts": contacts,
        "total": total,
        "page": page,
        "total_pages": max(1, (total + limit - 1) // limit),
    }


@router.get("/{contact_id}")
async def get_contact(contact_id: str):
    contact = await db.contacts.find_one({"id": contact_id}, {"_id": 0})
    if not contact:
        raise HTTPException(status_code=404, detail="Kontakt nicht gefunden")
    return contact


@router.put("/{contact_id}")
async def update_contact(contact_id: str, payload: dict):
    allowed = {"name", "address", "phone", "email", "status", "tags"}
    update_data = {k: v for k, v in payload.items() if k in allowed}
    if not update_data:
        raise HTTPException(status_code=400, detail="Keine gültigen Felder")

    update_data["updated_at"] = datetime.utcnow()
    update_data["last_activity"] = datetime.utcnow()

    result = await db.contacts.update_one({"id": contact_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kontakt nicht gefunden")

    contact = await db.contacts.find_one({"id": contact_id}, {"_id": 0})
    return contact


@router.delete("/{contact_id}")
async def delete_contact(contact_id: str):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kontakt nicht gefunden")
    return {"success": True}
