import random
import math
from datetime import datetime, timedelta
from models import Offer, ServiceItem, BenefitItem
from typing import Optional, Dict, List, Any


def generate_offer(
    business_name: str,
    address: str,
    phone: str = None,
    website: str = None,
    rating: float = 0.0,
    review_count: int = 0,
    overall_score: int = 0,
    lead_id: str = None,
    report_id: str = None,
    audit_report: dict = None,
    custom_services: list = None,
    custom_note: str = None,
) -> Offer:
    """Generate a personalized offer/proposal based on audit data."""

    has_website = website is not None and len(str(website)) > 0

    # --- Analyze problems from audit report ---
    problems = []

    if overall_score < 40:
        problems.append({
            "area": "Online-Präsenz",
            "severity": "kritisch",
            "text": f"Ihr Gesamtscore liegt bei nur {overall_score}%. Ihre Online-Sichtbarkeit ist stark eingeschränkt.",
            "impact": "Sie verlieren täglich potenzielle Kunden an Ihre Wettbewerber."
        })
    elif overall_score < 65:
        problems.append({
            "area": "Online-Präsenz",
            "severity": "hoch",
            "text": f"Ihr Gesamtscore beträgt {overall_score}%. Es gibt erhebliches Verbesserungspotenzial.",
            "impact": "Ihre Konkurrenz nutzt diese Schwächen zu ihrem Vorteil."
        })

    if not has_website:
        problems.append({
            "area": "Website",
            "severity": "kritisch",
            "text": "Sie haben keine Website. 97% der Kunden suchen online nach lokalen Unternehmen.",
            "impact": "Ohne Website verlieren Sie ca. 70% Ihrer potenziellen Neukunden."
        })

    if rating < 4.0:
        problems.append({
            "area": "Bewertungen",
            "severity": "hoch",
            "text": f"Ihre Durchschnittsbewertung von {rating} Sternen liegt unter dem Branchendurchschnitt.",
            "impact": "82% der Kunden wählen Unternehmen mit 4+ Sternen."
        })

    if review_count < 50:
        problems.append({
            "area": "Bewertungsanzahl",
            "severity": "mittel",
            "text": f"Mit nur {review_count} Bewertungen haben Sie weniger als die Top-Unternehmen in Ihrer Branche.",
            "impact": "Mehr Bewertungen = mehr Vertrauen = mehr Kunden."
        })

    if audit_report:
        # Check tech stack
        tech = audit_report.get("tech_stack", [])
        missing_tech = [t["name"] for t in tech if not t.get("detected", False)]
        if missing_tech:
            problems.append({
                "area": "Marketing-Technologie",
                "severity": "mittel",
                "text": f"Fehlende Technologien: {', '.join(missing_tech[:3])}.",
                "impact": "Ohne Tracking verlieren Sie wertvolle Marketing-Insights."
            })

        # Check listings
        listings = audit_report.get("listings", {})
        if listings.get("score", 0) < 50:
            problems.append({
                "area": "Einträge/Verzeichnisse",
                "severity": "hoch",
                "text": f"Nur {listings.get('score', 0)}% Ihrer Einträge sind korrekt.",
                "impact": "Falsche Einträge verwirren Kunden und schaden Ihrem Google-Ranking."
            })

        # Check critical info
        crit = audit_report.get("critical_info", {})
        if not crit.get("sms_enabled", False):
            problems.append({
                "area": "Erreichbarkeit",
                "severity": "mittel",
                "text": "Ihre Nummer ist nicht SMS-fähig.",
                "impact": "9 von 10 Kunden bevorzugen Messaging."
            })

    # If no problems found, add generic ones
    if not problems:
        problems.append({
            "area": "Optimierung",
            "severity": "mittel",
            "text": "Ihr Online-Auftritt hat Optimierungspotenzial.",
            "impact": "Mit den richtigen Maßnahmen können Sie Ihre Reichweite deutlich steigern."
        })

    # --- Calculate potential increases ---
    # Base calculations on current score gaps
    score_gap = max(0, 85 - overall_score)
    customer_pct = min(150, max(20, round(score_gap * 1.5 + random.randint(5, 15))))
    revenue_pct = min(120, max(15, round(score_gap * 1.2 + random.randint(5, 10))))
    visibility_pct = min(200, max(30, round(score_gap * 2.0 + random.randint(10, 20))))
    profit_pct = min(100, max(10, round(score_gap * 0.9 + random.randint(5, 10))))

    potential_customer_increase = f"+{customer_pct}%"
    potential_revenue_increase = f"+{revenue_pct}%"
    potential_visibility_increase = f"+{visibility_pct}%"
    potential_profit_increase = f"+{profit_pct}%"

    # --- Define services based on problems ---
    services = []

    if custom_services:
        for s in custom_services:
            services.append(ServiceItem(
                name=s.get("name", ""),
                description=s.get("description", ""),
                price=float(s.get("price", 0)),
                included=s.get("included", True),
            ))
    else:
        # Auto-generate services based on problems
        if not has_website:
            services.append(ServiceItem(
                name="Professionelle Website-Erstellung",
                description="Responsive, SEO-optimierte Website mit modernem Design, Kontaktformular, Google Maps Integration und CMS für einfache Pflege.",
                price=2490.0,
            ))

        services.append(ServiceItem(
            name="Google Business Profil Optimierung",
            description="Vollständige Optimierung Ihres Google-Unternehmensprofils: Fotos, Beschreibung, Kategorien, Öffnungszeiten, FAQ und regelmäßige Beiträge.",
            price=490.0,
        ))

        services.append(ServiceItem(
            name="Bewertungsmanagement",
            description="Automatisierte Bewertungsanfragen nach jedem Kundenbesuch, professionelle Antworten auf alle Bewertungen, Negativbewertungs-Frühwarnsystem.",
            price=290.0,
        ))

        if any(p["area"] == "Einträge/Verzeichnisse" for p in problems):
            services.append(ServiceItem(
                name="Einträge & Verzeichnis-Bereinigung",
                description="Korrektur aller fehlerhaften Einträge auf 30+ Plattformen. Einheitliche NAP-Daten (Name, Adresse, Telefon) für besseres Ranking.",
                price=690.0,
            ))

        services.append(ServiceItem(
            name="Social Media Setup & Betreuung",
            description="Professionelle Einrichtung und monatliche Betreuung Ihrer Social-Media-Kanäle (Facebook, Instagram). 8 Beiträge pro Monat.",
            price=590.0,
        ))

        if any(p["area"] == "Marketing-Technologie" for p in problems):
            services.append(ServiceItem(
                name="Marketing-Tracking Setup",
                description="Installation von Google Analytics, Google Tag Manager, Facebook Pixel und Conversion-Tracking für datenbasierte Entscheidungen.",
                price=390.0,
            ))

        services.append(ServiceItem(
            name="Lokale SEO-Optimierung",
            description="Keyword-Analyse, On-Page-Optimierung, lokale Backlinks und Google Maps Ranking-Verbesserung für mehr Sichtbarkeit.",
            price=790.0,
        ))

    total_price = sum(s.price for s in services)
    discount_price = round(total_price * 0.85, 2)  # 15% Rabatt

    # --- Benefits ---
    benefits = [
        BenefitItem(
            title="Mehr Kunden",
            description=f"Steigern Sie Ihre Kundengewinnung um bis zu {customer_pct}% durch verbesserte Online-Sichtbarkeit und optimiertes Bewertungsprofil.",
            metric=potential_customer_increase,
            icon="users",
        ),
        BenefitItem(
            title="Umsatzsteigerung",
            description=f"Erhöhen Sie Ihren Umsatz um bis zu {revenue_pct}% durch mehr qualifizierte Anfragen und bessere Konversionsraten.",
            metric=potential_revenue_increase,
            icon="trending-up",
        ),
        BenefitItem(
            title="Mehr Sichtbarkeit",
            description=f"Steigern Sie Ihre Online-Reichweite um bis zu {visibility_pct}% durch besseres Google-Ranking und Social Media Präsenz.",
            metric=potential_visibility_increase,
            icon="eye",
        ),
        BenefitItem(
            title="Gewinnsteigerung",
            description=f"Steigern Sie Ihren Gewinn um bis zu {profit_pct}% durch niedrigere Akquisekosten und höhere Kundenbindung.",
            metric=potential_profit_increase,
            icon="dollar-sign",
        ),
        BenefitItem(
            title="Wettbewerbsvorteil",
            description="Überholen Sie Ihre Konkurrenz durch professionelles Online-Marketing und erstklassige Kundenkommunikation.",
            metric="Top 3",
            icon="award",
        ),
        BenefitItem(
            title="Zeitersparnis",
            description="Wir übernehmen das komplette Online-Marketing für Sie, damit Sie sich auf Ihr Kerngeschäft konzentrieren können.",
            metric="15+ Std/Monat",
            icon="clock",
        ),
    ]

    # Valid until date (30 days from now)
    valid_until = (datetime.utcnow() + timedelta(days=30)).strftime("%d.%m.%Y")

    return Offer(
        lead_id=lead_id,
        report_id=report_id,
        business_name=business_name,
        address=address,
        phone=phone,
        website=website,
        rating=rating,
        review_count=review_count,
        overall_score=overall_score,
        potential_customer_increase=potential_customer_increase,
        potential_revenue_increase=potential_revenue_increase,
        potential_visibility_increase=potential_visibility_increase,
        potential_profit_increase=potential_profit_increase,
        problems=problems,
        services=services,
        total_price=total_price,
        discount_price=discount_price,
        benefits=benefits,
        valid_until=valid_until,
        custom_note=custom_note,
    )
