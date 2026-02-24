import json
import logging
import os
import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
except Exception:  # pragma: no cover
    LlmChat = None
    UserMessage = None

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/llm", tags=["llm"])

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]


def get_llm_key() -> str:
    return os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("EMERGENT_LLM_KEY") or ""


@router.post("/optimize")
async def optimize_email(payload: dict):
    subject = payload.get("subject", "")
    html = payload.get("html", "")
    provider = payload.get("provider", "anthropic")
    model = payload.get("model", "claude-sonnet-4-5-20250929")

    if not subject or not html:
        raise HTTPException(status_code=400, detail="Betreff und HTML sind erforderlich")

    api_key = get_llm_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="LLM ist nicht konfiguriert")

    if LlmChat is None or UserMessage is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "LLM-Integration ist nicht installiert. "
                "(Optional dependency 'emergentintegrations' fehlt)."
            ),
        )

    system_message = (
        "Du bist ein deutscher E-Mail-Copywriter für Marketing-Angebote. "
        "Optimiere Tonalität, Klarheit und Conversion, ohne Zahlen zu übertreiben. "
        "Antwort ausschließlich als JSON mit Feldern 'subject' und 'html'."
    )

    user_prompt = (
        "Optimiere folgende E-Mail. Bewahre Fakten und Zahlen. "
        "Gib als JSON zurück: {'subject': '...', 'html': '...'}\n\n"
        f"Betreff: {subject}\n\nHTML:\n{html}"
    )

    chat = (
        LlmChat(api_key=api_key, session_id=str(uuid.uuid4()), system_message=system_message)
        .with_model(provider, model)
    )

    response = await chat.send_message(UserMessage(text=user_prompt))

    optimized_subject = subject
    optimized_html = html

    try:
        parsed = json.loads(response)
        optimized_subject = parsed.get("subject", subject)
        optimized_html = parsed.get("html", html)
    except Exception:
        logger.warning("LLM Antwort konnte nicht geparst werden")

    await db.llm_logs.insert_one(
        {
            "id": str(uuid.uuid4()),
            "input": {"subject": subject, "html": html},
            "output": {"subject": optimized_subject, "html": optimized_html},
            "created_at": datetime.utcnow(),
            "model": model,
            "provider": provider,
        }
    )

    return {"subject": optimized_subject, "html": optimized_html}
