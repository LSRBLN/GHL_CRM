import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse

import httpx

from models import (
    AuditReport,
    CriticalInfo,
    TechStackItem,
    GoogleProfile,
    ListingsAnalysis,
    ReputationAnalysis,
    WebsitePerformance,
    SEOAnalysis,
)

logger = logging.getLogger(__name__)


def ensure_url(url: Optional[str]) -> Optional[str]:
    if not url:
        return None
    url = url.strip()
    if not url.startswith("http"):
        url = f"https://{url}"
    return url


def extract_domain(url: Optional[str]) -> str:
    if not url:
        return ""
    try:
        parsed = urlparse(ensure_url(url))
        return (parsed.netloc or "").replace("www.", "")
    except Exception:
        return ""


def calculate_contact_score(rating: float, review_count: int, has_website: bool) -> int:
    rating_score = max(0.0, min(1.0, rating / 5)) * 40
    review_score = min(review_count / 200, 1) * 30
    website_score = 15 if has_website else 0
    base = 15
    return int(round(min(100, base + rating_score + review_score + website_score)))


def build_critical_info(phone: Optional[str], has_website: bool, chat_widget: bool, review_response_rate: int) -> CriticalInfo:
    sms_enabled = bool(phone)
    sms_text = (
        "Ihre Rufnummer ist SMS-fähig – das reduziert Reibung bei kurzfristigen Anfragen. "
        "Schon eine schnelle Rückmeldung kann aus einem Interessenten einen Termin machen."
        if sms_enabled
        else "Keine SMS-fähige Rufnummer gefunden. Wenn Interessenten nicht sofort antworten können, "
        "bricht der Kontakt häufig ab. Eine SMS-Option kann diese Lücke schließen."
    )

    hosting_text = (
        "Website erkannt. Ohne direkten Zugriff lässt sich das Hosting nicht sicher bestimmen. "
        "Mit einer kurzen Technikprüfung lassen sich Ladezeit und Stabilität absichern."
        if has_website
        else "Keine Website gefunden. Damit fehlt ein zentraler Vertrauensanker – viele Kunden prüfen online, "
        "bevor sie anrufen. Eine einfache Website schafft hier schnell Abhilfe."
    )

    chat_widget_text = (
        "Ein Chat-Widget wurde erkannt – gut für schnelle Kundenanfragen. "
        "Mit klaren Antworten kann daraus direkt ein Termin entstehen."
        if chat_widget
        else "Kein Chat-Widget erkannt. Besucher mit Fragen springen oft ab, wenn sie niemanden erreichen. "
        "Ein Chat kann diese Verluste messbar reduzieren."
    )

    review_response_text = (
        f"Aktuelle Antwortquote: {review_response_rate}%. Jede unbeantwortete Rezension bleibt sichtbar "
        "und beeinflusst die Entscheidung neuer Kunden. Eine klare Antwortstrategie erhöht Vertrauen."
        if review_response_rate > 0
        else "Keine Antwortdaten verfügbar. Aktives Antworten erhöht Vertrauen – besonders bei kritischen Bewertungen."
    )

    return CriticalInfo(
        sms_enabled=sms_enabled,
        sms_text=sms_text,
        hosting_type="Unbekannt" if has_website else "Keine Website",
        hosting_text=hosting_text,
        chat_widget=chat_widget,
        chat_widget_text=chat_widget_text,
        review_response_rate=review_response_rate,
        review_response_text=review_response_text,
    )


def analyze_tech_stack(html: Optional[str], has_website: bool) -> List[TechStackItem]:
    if not has_website or not html:
        return [
            TechStackItem(
                name="Google Tag Manager",
                detected=False,
                description="Nicht prüfbar ohne Website-Zugriff.",
                icon="gtm",
            ),
            TechStackItem(
                name="Google Analytics",
                detected=False,
                description="Nicht prüfbar ohne Website-Zugriff.",
                icon="analytics",
            ),
            TechStackItem(
                name="Facebook-Pixel",
                detected=False,
                description="Nicht prüfbar ohne Website-Zugriff.",
                icon="fb_pixel",
            ),
            TechStackItem(
                name="Google Ads-Pixel",
                detected=False,
                description="Nicht prüfbar ohne Website-Zugriff.",
                icon="gads_pixel",
            ),
            TechStackItem(
                name="Google Ads",
                detected=False,
                description="Nicht prüfbar ohne Website-Zugriff.",
                icon="gads",
            ),
        ]

    html_lower = html.lower()
    gtm_detected = "googletagmanager" in html_lower
    ga_detected = "gtag('config'" in html_lower or "google-analytics" in html_lower
    fb_detected = "connect.facebook.net" in html_lower and "fbevents.js" in html_lower
    gads_detected = "googleadservices" in html_lower or "adsbygoogle" in html_lower

    return [
        TechStackItem(
            name="Google Tag Manager",
            detected=gtm_detected,
            description=(
                "Google Tag Manager erkannt – Tracking sauber steuerbar."
                if gtm_detected
                else "Google Tag Manager nicht erkannt. Tracking ist dadurch meist unvollständig."
            ),
            icon="gtm",
        ),
        TechStackItem(
            name="Google Analytics",
            detected=ga_detected,
            description=(
                "Google Analytics aktiv – gute Basis für datengetriebene Entscheidungen."
                if ga_detected
                else "Google Analytics nicht erkannt. Ohne Daten bleiben Marketing-Entscheidungen blind."
            ),
            icon="analytics",
        ),
        TechStackItem(
            name="Facebook-Pixel",
            detected=fb_detected,
            description=(
                "Facebook-Pixel aktiv – Retargeting möglich."
                if fb_detected
                else "Facebook-Pixel nicht erkannt. Retargeting-Potenzial bleibt ungenutzt."
            ),
            icon="fb_pixel",
        ),
        TechStackItem(
            name="Google Ads-Pixel",
            detected=gads_detected,
            description=(
                "Google Ads-Tracking aktiv – Conversions messbar."
                if gads_detected
                else "Google Ads-Tracking nicht erkannt. Conversion-Messung fehlt."
            ),
            icon="gads_pixel",
        ),
        TechStackItem(
            name="Google Ads",
            detected=gads_detected,
            description=(
                "Hinweise auf Google Ads gefunden."
                if gads_detected
                else "Keine Hinweise auf Google Ads gefunden."
            ),
            icon="gads",
        ),
    ]


def build_google_profile(details: Dict[str, Any]) -> GoogleProfile:
    rating = float(details.get("rating") or 0.0)
    review_count = int(details.get("user_ratings_total") or 0)
    photos_count = len(details.get("photos") or [])
    has_hours = bool(details.get("opening_hours"))
    has_website = bool(details.get("website"))
    has_phone = bool(details.get("formatted_phone_number") or details.get("international_phone_number"))

    score = 0
    score += (rating / 5) * 40 if rating else 0
    score += min(review_count / 200, 1) * 30
    score += min(photos_count / 20, 1) * 15
    score += 10 if has_hours else 0
    score += 5 if has_website else 0
    score += 5 if has_phone else 0

    verified = bool(details.get("business_status") == "OPERATIONAL" or review_count or rating)

    return GoogleProfile(
        verified=verified,
        score=int(round(min(score, 100))),
        details={
            "name": details.get("name"),
            "address": details.get("formatted_address"),
            "phone": details.get("formatted_phone_number") or details.get("international_phone_number"),
            "website": details.get("website"),
            "hours": has_hours,
            "photos": photos_count,
            "description": bool(details.get("editorial_summary")),
        },
    )


def build_listings() -> ListingsAnalysis:
    return ListingsAnalysis(
        score=0,
        total=0,
        exact_matches=0,
        partial_matches=0,
        no_matches=0,
        details=[],
        summary_text=(
            "Externe Branchenverzeichnisse wurden nicht geprüft."
            " Eine Prüfung ist wichtig, um Inkonsistenzen zu vermeiden."
        ),
    )


def build_reputation(details: Dict[str, Any]) -> ReputationAnalysis:
    rating = float(details.get("rating") or 0.0)
    review_count = int(details.get("user_ratings_total") or 0)
    reviews = details.get("reviews") or []

    analyzed = len(reviews)
    positive = sum(1 for r in reviews if float(r.get("rating") or 0) >= 4)
    negative = sum(1 for r in reviews if float(r.get("rating") or 0) <= 2)

    sample_reviews = []
    for review in reviews[:3]:
        sample_reviews.append({
            "text": review.get("text", ""),
            "rating": str(review.get("rating", "")),
            "author": review.get("author_name", "Google Nutzer"),
            "type": "positive" if float(review.get("rating") or 0) >= 4 else "negative",
        })

    rep_score = 0
    if rating:
        rep_score += (rating / 5) * 70
    rep_score += min(review_count / 200, 1) * 30

    return ReputationAnalysis(
        score=int(round(min(rep_score, 100))),
        total_reviews_analyzed=analyzed,
        positive_reviews=positive,
        negative_reviews=negative,
        total_gmb_reviews=review_count,
        gmb_rating=rating,
        total_fb_reviews=0,
        has_facebook=False,
        sample_reviews=sample_reviews,
    )


def build_website_performance(response_time: Optional[float], has_website: bool) -> WebsitePerformance:
    if not has_website or response_time is None:
        return WebsitePerformance(score=0)

    speed = max(response_time, 0.1)
    score = max(10, min(100, round(100 - speed * 20)))

    if speed <= 1:
        issues, warnings, passed = 0, 1, 12
    elif speed <= 2:
        issues, warnings, passed = 1, 2, 10
    elif speed <= 3:
        issues, warnings, passed = 2, 3, 9
    else:
        issues, warnings, passed = 3, 4, 7

    return WebsitePerformance(
        score=score,
        mobile_speed=round(speed, 1),
        desktop_speed=round(speed, 1),
        mobile_score=score,
        desktop_score=score,
        mobile_issues=issues,
        mobile_warnings=warnings,
        mobile_passed=passed,
        desktop_issues=issues,
        desktop_warnings=warnings,
        desktop_passed=passed,
    )


def compute_overall_score(sections: Dict[str, Tuple[int, bool]]) -> int:
    base_weights = {
        "google_profile": 0.2,
        "reputation": 0.2,
        "website": 0.2,
        "seo": 0.2,
        "tech": 0.1,
        "listings": 0.1,
    }

    total_weight = sum(base_weights[key] for key, (_, available) in sections.items() if available)
    if total_weight <= 0:
        return 0

    weighted = 0.0
    for key, (score, available) in sections.items():
        if not available:
            continue
        weighted += score * (base_weights[key] / total_weight)
    return int(round(min(weighted, 100)))


async def fetch_website_html(website: Optional[str]) -> Tuple[Optional[str], Optional[float]]:
    url = ensure_url(website)
    if not url:
        return None, None

    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            start = datetime.utcnow()
            response = await client.get(url)
            response.raise_for_status()
            duration = (datetime.utcnow() - start).total_seconds()
            return response.text, duration
    except Exception as exc:
        logger.warning("Website-Analyse fehlgeschlagen: %s", exc)
        return None, None


def detect_chat_widget(html: Optional[str]) -> bool:
    if not html:
        return False
    patterns = ["intercom", "tawk.to", "livechat", "crisp.chat", "zendesk", "chat-widget"]
    html_lower = html.lower()
    return any(p in html_lower for p in patterns)


def parse_review_response_rate(details: Dict[str, Any]) -> int:
    reviews = details.get("reviews") or []
    if not reviews:
        return 0
    responded = sum(1 for r in reviews if r.get("response"))
    return int(round((responded / len(reviews)) * 100)) if reviews else 0


def build_report_html(report: AuditReport) -> str:
    tech_rows = "".join(
        [
            "<tr><td>{name}</td><td>{status}</td><td>{desc}</td></tr>".format(
                name=t.name,
                status="Erkannt" if t.detected else "Nicht erkannt",
                desc=t.description,
            )
            for t in report.tech_stack
        ]
    )

    template = """
    <html>
      <head>
        <meta charset='utf-8' />
        <style>
          body {{ font-family: Arial, sans-serif; color: #111827; }}
          h1, h2 {{ color: #111827; }}
          .section {{ margin-bottom: 24px; }}
          .badge {{ display: inline-block; padding: 2px 8px; border-radius: 12px; background: #e5e7eb; font-size: 12px; }}
          table {{ width: 100%; border-collapse: collapse; }}
          th, td {{ border-bottom: 1px solid #e5e7eb; padding: 6px; text-align: left; font-size: 12px; }}
        </style>
      </head>
      <body>
        <h1>Marketing-Audit-Bericht</h1>
        <p><strong>Unternehmen:</strong> {business_name}</p>
        <p><strong>Adresse:</strong> {address}</p>
        <p><strong>Gesamtscore:</strong> {overall_score}%</p>

        <div class="section">
          <h2>Kritische Infos</h2>
          <p>{sms_text}</p>
          <p>{hosting_text}</p>
          <p>{chat_text}</p>
          <p>{review_text}</p>
        </div>

        <div class="section">
          <h2>Tech-Stack</h2>
          <table>
            <thead><tr><th>Tool</th><th>Status</th><th>Hinweis</th></tr></thead>
            <tbody>
              {tech_rows}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Google-Profil</h2>
          <p>Score: {google_score}%</p>
          <p>Bewertung: {rating} ({review_count} Rezensionen)</p>
        </div>

        <div class="section">
          <h2>Einträge</h2>
          <p>{listings_summary}</p>
        </div>

        <div class="section">
          <h2>Reputation</h2>
          <p>GMB Score: {reputation_score}%</p>
          <p>Analysierte Bewertungen: {reviews_analyzed}</p>
        </div>

        <div class="section">
          <h2>Website-Performance</h2>
          <p>Score: {website_score}%</p>
          <p>Ladezeit: {website_speed}s</p>
        </div>

        <div class="section">
          <h2>SEO</h2>
          <p>Score: {seo_score}%</p>
          <p>Durchschnittliches Ranking: {seo_rank}</p>
        </div>
      </body>
    </html>
    """

    return template.format(
        business_name=report.business_name,
        address=report.address,
        overall_score=report.overall_score,
        sms_text=report.critical_info.sms_text,
        hosting_text=report.critical_info.hosting_text,
        chat_text=report.critical_info.chat_widget_text,
        review_text=report.critical_info.review_response_text,
        tech_rows=tech_rows,
        google_score=report.google_profile.score,
        rating=report.rating,
        review_count=report.review_count,
        listings_summary=report.listings.summary_text,
        reputation_score=report.reputation.score,
        reviews_analyzed=report.reputation.total_reviews_analyzed,
        website_score=report.website_performance.score,
        website_speed=report.website_performance.mobile_speed,
        seo_score=report.seo.score,
        seo_rank=report.seo.avg_ranking,
    )


def build_audit_report(
    business_name: str,
    address: str,
    phone: Optional[str],
    website: Optional[str],
    rating: float,
    review_count: int,
    lead_id: Optional[str],
    details: Dict[str, Any],
    seo: SEOAnalysis,
    tech_stack: List[TechStackItem],
    website_perf: WebsitePerformance,
    critical_info: CriticalInfo,
) -> AuditReport:
    google_profile = build_google_profile(details)
    listings = build_listings()
    reputation = build_reputation(details)

    tech_score = int(round((sum(1 for t in tech_stack if t.detected) / max(len(tech_stack), 1)) * 100))

    sections = {
        "google_profile": (google_profile.score, True),
        "reputation": (reputation.score, review_count > 0 or rating > 0),
        "website": (website_perf.score, bool(website)),
        "seo": (seo.score, seo.score > 0),
        "tech": (tech_score, bool(website)),
        "listings": (listings.score, listings.total > 0),
    }

    overall = compute_overall_score(sections)

    return AuditReport(
        lead_id=lead_id,
        business_name=business_name,
        address=address,
        phone=phone,
        website=website,
        rating=rating,
        review_count=review_count,
        overall_score=overall,
        critical_info=critical_info,
        tech_stack=tech_stack,
        google_profile=google_profile,
        listings=listings,
        reputation=reputation,
        website_performance=website_perf,
        seo=seo,
    )
