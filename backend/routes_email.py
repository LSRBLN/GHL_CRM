import asyncio
import base64
import json
import logging
import os
import uuid
from datetime import datetime
from typing import Optional

import resend
from fastapi import APIRouter, HTTPException, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

from audit_report_builder import build_report_html
from pdf_generator import generate_pdf_from_html

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/email", tags=["email"])

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

resend.api_key = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")


@router.get("/templates")
async def list_templates():
    templates = await db.email_templates.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"templates": templates}


@router.post("/templates/upload")
async def upload_template(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Datei fehlt")

    content = await file.read()
    name = file.filename.rsplit(".", 1)[0]
    subject = ""
    html = ""

    if file.filename.lower().endswith(".json"):
        try:
            payload = json.loads(content.decode("utf-8"))
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Ungültige JSON-Datei: {exc}")
        name = payload.get("name") or name
        subject = payload.get("subject") or ""
        html = payload.get("html") or ""
    else:
        html = content.decode("utf-8")

    if not html:
        raise HTTPException(status_code=400, detail="HTML-Inhalt fehlt")

    template = {
        "id": str(uuid.uuid4()),
        "name": name,
        "subject": subject,
        "html": html,
        "created_at": datetime.utcnow(),
    }

    await db.email_templates.insert_one(template)
    template.pop("_id", None)
    return template


@router.post("/send-offer")
async def send_offer_email(payload: dict):
    if not resend.api_key or not SENDER_EMAIL:
        raise HTTPException(status_code=500, detail="E-Mail Versand ist nicht konfiguriert")

    recipient = payload.get("to_email")
    subject = payload.get("subject")
    html_content = payload.get("html")
    contact_id = payload.get("contact_id")
    attach_report = bool(payload.get("attach_report_pdf"))
    report_id = payload.get("report_id")

    if not recipient or not subject or not html_content:
        raise HTTPException(status_code=400, detail="Empfänger, Betreff und Inhalt sind erforderlich")

    attachments = []
    if attach_report:
        if not report_id:
            raise HTTPException(status_code=400, detail="Report-ID fehlt")
        report = await db.reports.find_one({"id": report_id}, {"_id": 0})
        if not report:
            raise HTTPException(status_code=404, detail="Bericht nicht gefunden")
        report_html = build_report_html(report)
        pdf_bytes = await generate_pdf_from_html(report_html)
        attachments.append({
            "filename": "audit-report.pdf",
            "content": base64.b64encode(pdf_bytes).decode("utf-8"),
        })

    params = {
        "from": SENDER_EMAIL,
        "to": [recipient],
        "subject": subject,
        "html": html_content,
    }
    if attachments:
        params["attachments"] = attachments

    try:
        email_response = await asyncio.to_thread(resend.Emails.send, params)
    except Exception as exc:
        logger.error("Resend Fehler: %s", exc)
        raise HTTPException(status_code=500, detail="E-Mail konnte nicht gesendet werden")

    conversation = {
        "id": str(uuid.uuid4()),
        "contact_id": contact_id,
        "channel": "email",
        "subject": subject,
        "html": html_content,
        "sent_at": datetime.utcnow(),
        "attachments": [a.get("filename") for a in attachments],
        "provider_id": email_response.get("id") if isinstance(email_response, dict) else None,
    }
    await db.conversations.insert_one(conversation)

    if contact_id:
        contact = await db.contacts.find_one({"id": contact_id})
        if contact:
            tags = list({*(contact.get("tags") or []), "offer-sent", "hot-lead"})
            status = contact.get("status")
            if status in (None, "New", "Prospect", "Contacted"):
                status = "Offer Sent"

            timeline_entry = {
                "id": str(uuid.uuid4()),
                "type": "email",
                "title": "Angebot per E-Mail gesendet",
                "details": f"Betreff: {subject}",
                "created_at": datetime.utcnow(),
                "conversation_id": conversation["id"],
            }

            await db.contacts.update_one(
                {"id": contact_id},
                {
                    "$set": {
                        "tags": tags,
                        "status": status,
                        "last_activity": datetime.utcnow(),
                        "updated_at": datetime.utcnow(),
                    },
                    "$push": {"timeline": timeline_entry},
                },
            )

    return {"success": True, "email_id": email_response.get("id") if isinstance(email_response, dict) else None}
