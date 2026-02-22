import logging
import os
import re
from urllib.parse import urlparse
from typing import List, Dict, Any, Optional

import httpx

from models import SEOAnalysis

logger = logging.getLogger(__name__)


def _normalize(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"[^a-z0-9]+", "", text.lower())


def _extract_domain(website: Optional[str]) -> str:
    if not website:
        return ""
    url = website.strip()
    if not url.startswith("http"):
        url = f"https://{url}"
    try:
        parsed = urlparse(url)
        domain = parsed.netloc or ""
    except Exception:
        domain = ""
    return domain.replace("www.", "")


def _parse_photos_count(photos: Any) -> Optional[int]:
    if isinstance(photos, list):
        return len(photos)
    if isinstance(photos, int):
        return photos
    return None


def _parse_reviews_count(item: Dict[str, Any]) -> Optional[int]:
    for key in ("reviews", "reviews_count", "reviews_total"):
        value = item.get(key)
        if isinstance(value, int):
            return value
        if isinstance(value, str) and value.isdigit():
            return int(value)
    return None


async def fetch_seo_analysis(
    business_name: str,
    address: str,
    website: Optional[str] = None,
    keyword: Optional[str] = None,
) -> SEOAnalysis:
    api_key = os.environ.get("SERPAPI_API_KEY")
    if not api_key:
        raise ValueError("SERPAPI_API_KEY ist nicht konfiguriert")

    keyword_used = keyword or (business_name.split()[0] if business_name else "Business")
    query = f"{keyword_used} {address}".strip()

    params = {
        "engine": "google_maps",
        "q": query,
        "api_key": api_key,
        "hl": "de",
        "type": "search",
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get("https://serpapi.com/search", params=params)
            response.raise_for_status()
            data = response.json()
    except Exception as exc:
        logger.error("SerpApi request fehlgeschlagen: %s", exc)
        raise

    if data.get("error"):
        raise ValueError(data.get("error"))

    local_results: List[Dict[str, Any]] = data.get("local_results", []) or []

    competitors: List[Dict[str, Any]] = []
    for item in local_results[:10]:
        name = item.get("title") or item.get("name") or "Unbekannt"
        rating = item.get("rating") or 0.0
        photos_count = _parse_photos_count(item.get("photos"))
        reviews_count = _parse_reviews_count(item)
        competitors.append({
            "name": name,
            "photos": f"{photos_count}" if photos_count is not None else "—",
            "reviews": f"{reviews_count}" if reviews_count is not None else "—",
            "rating": round(float(rating), 1) if rating else 0.0,
        })

    business_norm = _normalize(business_name)
    domain = _extract_domain(website)
    found_position: Optional[int] = None

    for idx, item in enumerate(local_results):
        title = item.get("title") or item.get("name") or ""
        item_norm = _normalize(title)
        item_website = (item.get("website") or "").lower()
        if business_norm and business_norm in item_norm:
            found_position = item.get("position") or idx + 1
            break
        if domain and domain in item_website:
            found_position = item.get("position") or idx + 1
            break

    if found_position is None:
        avg_ranking = "10+"
        score = 30 if local_results else 20
    else:
        avg_ranking = str(found_position)
        score = max(20, min(100, 100 - (found_position - 1) * 8))

    return SEOAnalysis(
        score=score,
        avg_ranking=avg_ranking,
        competitors=competitors,
        keyword_used=keyword_used,
    )
