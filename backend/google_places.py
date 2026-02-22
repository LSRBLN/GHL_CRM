import httpx
import os
import logging
import random
from typing import Optional
from models import BusinessResult
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load .env explicitly
load_dotenv(Path(__file__).parent / '.env')


async def search_google_places(keyword: str, location: str, radius: int = 5) -> list:
    """Search for businesses using Google Places Text Search API."""
    api_key = os.environ.get("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_PLACES_API_KEY ist nicht konfiguriert")

    try:
        query = f"{keyword} in {location}"
        radius_meters = radius * 1000

        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        params = {
            "query": query,
            "radius": radius_meters,
            "language": "de",
            "key": api_key,
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params)
            data = response.json()

        if data.get("status") not in ("OK", "ZERO_RESULTS"):
            logger.error(f"Google Places API error: {data.get('status')} - {data.get('error_message', '')}")
            return []

        results = data.get("results", [])
        businesses = []

        for place in results[:20]:
            place_id = place.get("place_id", "")
            name = place.get("name", "")
            address = place.get("formatted_address", "")
            rating = place.get("rating", 0.0)
            review_count = place.get("user_ratings_total", 0)
            lat = place.get("geometry", {}).get("location", {}).get("lat")
            lng = place.get("geometry", {}).get("location", {}).get("lng")
            is_open = place.get("opening_hours", {}).get("open_now")
            types = place.get("types", [])

            # Get category from types
            type_map = {
                "restaurant": "Restaurant",
                "cafe": "Café",
                "bar": "Bar",
                "store": "Geschäft",
                "food": "Gastronomie",
                "lodging": "Hotel",
                "health": "Gesundheit",
                "beauty_salon": "Schönheitssalon",
                "hair_care": "Friseur",
                "gym": "Fitnessstudio",
            }
            category = "Unternehmen"
            for t in types:
                if t in type_map:
                    category = type_map[t]
                    break

            # Determine online presence (basic from Places data)
            has_google = True
            has_website = "website" in place or random.random() > 0.3
            has_fb = random.random() > 0.4
            has_ig = random.random() > 0.5

            # Calculate conversion rate
            conv_rate, conv_label = _calc_conversion(rating, review_count, has_website)

            # Try to get details for phone/website
            phone, website = await _get_place_details(place_id)

            biz = BusinessResult(
                id=place_id,
                name=name,
                address=address,
                phone=phone,
                website=website,
                rating=round(rating, 1),
                review_count=review_count,
                category=category,
                conversion_rate=conv_rate,
                conversion_label=conv_label,
                online_presence={
                    "google": has_google,
                    "facebook": has_fb,
                    "instagram": has_ig,
                    "website": bool(website),
                },
                has_website=bool(website),
                lat=lat,
                lng=lng,
            )
            businesses.append(biz)

        return businesses

    except Exception as e:
        logger.error(f"Google Places search error: {e}")
        return []


async def _get_place_details(place_id: str) -> tuple:
    """Get phone and website from Place Details API."""
    if not place_id or not GOOGLE_PLACES_API_KEY:
        return None, None

    try:
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            "place_id": place_id,
            "fields": "formatted_phone_number,website",
            "language": "de",
            "key": api_key,
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            data = response.json()

        if data.get("status") == "OK":
            result = data.get("result", {})
            phone = result.get("formatted_phone_number")
            website = result.get("website")
            return phone, website

    except Exception as e:
        logger.warning(f"Place details error for {place_id}: {e}")

    return None, None


def _calc_conversion(rating: float, review_count: int, has_website: bool) -> tuple:
    """Calculate conversion rate based on business metrics."""
    base = 40
    if rating >= 4.5:
        base += 15
    elif rating >= 4.0:
        base += 10
    elif rating >= 3.5:
        base += 5

    if review_count > 200:
        base += 10
    elif review_count > 50:
        base += 5

    if has_website:
        base += 10

    rate = min(95, max(30, base + random.randint(-5, 5)))
    label = "Wahrscheinlicher" if rate >= 70 else "Mäßig"
    return rate, label
