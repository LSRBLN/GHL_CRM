import random
import math
from typing import Optional
from models import (
    AuditReport, CriticalInfo, TechStackItem, GoogleProfile,
    ListingsAnalysis, ListingEntry, ReputationAnalysis,
    WebsitePerformance, SEOAnalysis, BusinessResult
)


def generate_conversion_rate(rating: float, review_count: int, has_website: bool) -> tuple:
    """Generate conversion rate based on business metrics."""
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

    rate = min(95, max(30, base + random.randint(-10, 10)))
    label = "Wahrscheinlicher" if rate >= 70 else "M\u00e4\u00dfig"
    return rate, label


def generate_mock_businesses(keyword: str, location: str) -> list:
    """Generate realistic mock business results."""
    templates = [
        {"suffix": "GmbH", "cat": "Restaurant"},
        {"suffix": "Berlin (Mitte)", "cat": "Gro\u00dfhandel"},
        {"suffix": "Urban Berlin", "cat": "Restaurant"},
        {"suffix": "Express", "cat": "Lieferservice"},
        {"suffix": "Service", "cat": "Catering"},
        {"suffix": "World Berlin", "cat": "Gro\u00dfhandel"},
        {"suffix": "Lounge", "cat": "Bar & Restaurant"},
        {"suffix": "Berlin", "cat": "Restaurant"},
    ]

    streets = [
        "Buolstra\u00dfe 14", "Kantstra\u00dfe 89", "Urbanstra\u00dfe 172",
        "Agricolastra\u00dfe 26", "Reinickendorfer Str. 107", "Friedrichstra\u00dfe 45",
        "Prenzlauer Allee 87", "Karl-Marx-Allee 33", "Oranienburger Str. 54",
        "Sonnenallee 142", "Torstra\u00dfe 99", "Warschauer Str. 76",
        "Sch\u00f6nhauser Allee 44", "Kottbusser Damm 22", "Greifswalder Str. 88",
    ]

    plz_list = ["10117", "10178", "10243", "10405", "10555", "10627",
                "10961", "12059", "13347", "13629"]

    city_name = "Berlin"
    parts = location.split(",")
    for part in parts:
        part = part.strip()
        if len(part) > 2 and not part.isdigit():
            city_name = part
            break

    businesses = []
    names_used = set()
    count = random.randint(8, 15)

    for i in range(count):
        tmpl = templates[i % len(templates)]
        # Create unique name
        prefix = keyword.capitalize() if keyword else "Business"
        possible_prefixes = [
            prefix, f"{prefix}s", f"KresoS {prefix}", f"GGM {prefix}",
            f"{prefix} Urban", f"Neretva {keyword}", f"Ege {prefix}",
            f"{city_name} {prefix}", f"Spree {prefix}", f"{prefix}haus",
            f"Mitte {prefix}", f"{prefix} Express", f"Alt-{city_name} {prefix}",
            f"{prefix} Werkstatt", f"Golden {prefix}"
        ]
        name = f"{possible_prefixes[i % len(possible_prefixes)]} {tmpl['suffix']}"
        while name in names_used:
            name = f"{prefix} {tmpl['suffix']} {i}"
        names_used.add(name)

        street = streets[i % len(streets)]
        plz = plz_list[i % len(plz_list)]
        address = f"{street}, {plz} {city_name}, Deutschland"

        rating = round(random.uniform(3.5, 4.9), 1)
        review_count = random.randint(5, 500)
        has_website = random.random() > 0.2

        conv_rate, conv_label = generate_conversion_rate(rating, review_count, has_website)

        has_google = True
        has_fb = random.random() > 0.3
        has_ig = random.random() > 0.5

        lat = 52.52 + random.uniform(-0.05, 0.05)
        lng = 13.40 + random.uniform(-0.1, 0.1)

        biz = BusinessResult(
            name=name,
            address=address,
            phone=f"+49 30 {random.randint(1000000, 9999999)}",
            website=f"www.{name.lower().replace(' ', '-').replace('(', '').replace(')', '')}.de" if has_website else None,
            rating=rating,
            review_count=review_count,
            category=tmpl["cat"],
            conversion_rate=conv_rate,
            conversion_label=conv_label,
            online_presence={"google": has_google, "facebook": has_fb, "instagram": has_ig, "website": has_website},
            has_website=has_website,
            lat=lat,
            lng=lng,
        )
        businesses.append(biz)

    return businesses


def generate_audit_report(business_name: str, address: str, phone: str = None,
                          website: str = None, rating: float = 0.0,
                          review_count: int = 0, lead_id: str = None,
                          seo_override: Optional[SEOAnalysis] = None) -> AuditReport:
    """Generate a comprehensive marketing audit report."""

    has_website = website is not None and len(website) > 0

    # --- Critical Info ---
    sms_enabled = random.random() > 0.6
    chat_widget = random.random() > 0.7
    review_resp_rate = random.randint(0, 40)

    critical = CriticalInfo(
        sms_enabled=sms_enabled,
        sms_text="Ihre Rufnummer ist SMS-f\u00e4hig." if sms_enabled else
                 "Ihre Rufnummer ist NICHT SMS-f\u00e4hig. 9 von 10 Personen nutzen Messaging!",
        hosting_type="WordPress" if random.random() > 0.5 else "Andere",
        hosting_text="Website nicht auf WordPress oder LeadConnector erkannt. Hosting-Wahl beeinflusst SEO und Geschwindigkeit."
                     if not has_website else "Website erkannt. Hosting-Analyse verf\u00fcgbar.",
        chat_widget=chat_widget,
        chat_widget_text="Chat-Widget aktiviert. Gute Kundenbindung!" if chat_widget else
                         "Kein Chat-Widget aktiviert. Sie verpassen Gelegenheiten f\u00fcr bessere Kundenbindung.",
        review_response_rate=review_resp_rate,
        review_response_text=f"Nur {review_resp_rate}% der Bewertungen beantwortet. 89% bevorzugen aktive Unternehmen."
    )

    # --- Tech Stack ---
    tech_stack = [
        TechStackItem(
            name="Google Tag Manager",
            detected=random.random() > 0.5,
            description="Google Tag Manager ist nicht auf Ihrer Website implementiert." if random.random() > 0.5 else
                       "Google Tag Manager ist auf Ihrer Website erkannt.",
            icon="gtm"
        ),
        TechStackItem(
            name="Google Analytics",
            detected=random.random() > 0.3,
            description="Google Analytics ist auf Ihrer Website erkannt. Sie sind auf dem richtigen Weg."
            if random.random() > 0.4 else
            "Google Analytics wird nicht auf Ihrer Website erkannt.",
            icon="analytics"
        ),
        TechStackItem(
            name="Facebook-Pixel",
            detected=random.random() > 0.6,
            description="Das Facebook-Pixel wird auf Ihrer Website nicht erkannt. Sie verpassen M\u00f6glichkeiten."
            if random.random() > 0.4 else
            "Das Facebook-Pixel ist auf Ihrer Website aktiv.",
            icon="fb_pixel"
        ),
        TechStackItem(
            name="Google Ads-Pixel",
            detected=random.random() > 0.5,
            description="Das Google Ads-Conversion-Tracking-Pixel ist auf Ihrer Website vorhanden."
            if random.random() > 0.5 else
            "Kein Google Ads-Tracking erkannt.",
            icon="gads_pixel"
        ),
        TechStackItem(
            name="Google Ads",
            detected=random.random() > 0.7,
            description="Ihr Unternehmen f\u00fchrt derzeit keine Google Ads-Kampagnen durch."
            if random.random() > 0.3 else
            "Google Ads-Kampagnen erkannt.",
            icon="gads"
        ),
    ]

    # --- Google Profile ---
    gp_verified = random.random() > 0.2
    gp_score = random.randint(60, 100) if gp_verified else random.randint(0, 30)
    google_profile = GoogleProfile(
        verified=gp_verified,
        score=gp_score,
        details={
            "name": business_name,
            "address": address,
            "phone": phone,
            "website": website,
            "hours": random.random() > 0.3,
            "photos": random.randint(0, 50),
            "description": random.random() > 0.4,
        }
    )

    # --- Listings ---
    platforms = [
        "GOLOCAL", "OEFFNUNGSZEITEN", "AUSKUNFT", "TELLOWS", "FINDERR",
        "GOOGLE", "WHERETO", "FACEBOOK", "STADTBRANCHENBUCH", "MEINESTADT",
        "CYLEX", "INFOBEL", "HOTFROG", "GOYELLOW", "ACOMPIO",
        "TUPALO", "NAVMII", "YELLOWMAP", "MARKTPLATZM", "BUNDESTELEFONBUCH",
        "IGLOBAL", "BRANCHENBUCH", "YALWA", "AROUNDME", "KOOMIO",
        "INFOISINFO", "BRUNCHLUNCH", "ORTSDIENSTDE", "WOGIBTSWASDE",
        "NOCHOFFEN", "T-ONLINE", "WOGIBTSWAS"
    ]

    listing_entries = []
    exact = 0
    partial = 0
    none_count = 0

    for platform in platforms:
        r = random.random()
        if r > 0.75:
            status = "\u00dcbereinstimmung"
            display_name = business_name[:30] + ("..." if len(business_name) > 30 else "")
            phone_val = phone
            addr_val = address.split(",")[0]
            exact += 1
        elif r > 0.4:
            status = "Unvollst\u00e4ndige \u00dcbereinstimmung"
            display_name = business_name[:20] + "..." if random.random() > 0.3 else "Nicht verf\u00fcgbar"
            phone_val = phone if random.random() > 0.4 else "Nicht verf\u00fcgbar"
            addr_val = address.split(",")[0] if random.random() > 0.5 else "Nicht verf\u00fcgbar"
            partial += 1
        else:
            status = "Keine \u00dcbereinstimmung"
            display_name = "Nicht verf\u00fcgbar"
            phone_val = "Nicht verf\u00fcgbar"
            addr_val = "Nicht verf\u00fcgbar"
            none_count += 1

        listing_entries.append(ListingEntry(
            platform=platform,
            display_name=display_name,
            phone=phone_val,
            address=addr_val,
            status=status,
        ))

    total_listings = len(platforms)
    listing_score = round((exact / total_listings) * 100) if total_listings > 0 else 0

    listings = ListingsAnalysis(
        score=listing_score,
        total=total_listings,
        exact_matches=exact,
        partial_matches=partial,
        no_matches=none_count,
        details=listing_entries,
        summary_text=f"Sie sind auf einigen Websites korrekt aufgef\u00fchrt, w\u00e4hrend die Informationen auf vielen anderen Plattformen falsch zu sein scheinen."
    )

    # --- Reputation ---
    analyzed = min(review_count, random.randint(3, 10))
    positive = max(0, analyzed - random.randint(0, 2))
    negative = analyzed - positive
    has_facebook = random.random() > 0.4
    fb_reviews = random.randint(0, 50) if has_facebook else 0

    sample_reviews = []
    positive_texts = [
        "Tolles Essen und freundlicher Service! Absolut empfehlenswert.",
        "Sehr gutes Preis-Leistungs-Verh\u00e4ltnis. Wir kommen gerne wieder.",
        "Nettes Ambiente, coole Kellner und super gelegen. Das Essen kam fix.",
        "Hervorragendes Restaurant mit ausgezeichneter K\u00fcche.",
        "Super Erfahrung, das Team ist sehr professionell.",
    ]
    for i in range(min(3, positive)):
        sample_reviews.append({
            "text": positive_texts[i % len(positive_texts)],
            "rating": str(random.randint(4, 5)),
            "author": f"Kunde {i+1}",
            "type": "positive",
        })

    rep_score = min(100, max(0, round((positive / max(analyzed, 1)) * 50 + (rating / 5) * 50)))

    reputation = ReputationAnalysis(
        score=rep_score,
        total_reviews_analyzed=analyzed,
        positive_reviews=positive,
        negative_reviews=negative,
        total_gmb_reviews=review_count,
        gmb_rating=rating,
        total_fb_reviews=fb_reviews,
        has_facebook=has_facebook,
        sample_reviews=sample_reviews,
    )

    # --- Website Performance ---
    mobile_speed = round(random.uniform(0.8, 4.5), 1)
    desktop_speed = round(random.uniform(0.3, 2.5), 1)
    mobile_score = max(10, min(100, round(100 - mobile_speed * 20 + random.randint(-10, 10))))
    desktop_score = max(20, min(100, round(100 - desktop_speed * 15 + random.randint(-5, 10))))
    perf_score = round((mobile_score + desktop_score) / 2)

    web_perf = WebsitePerformance(
        score=perf_score if has_website else 0,
        mobile_speed=mobile_speed,
        desktop_speed=desktop_speed,
        mobile_score=mobile_score,
        desktop_score=desktop_score,
        mobile_issues=random.randint(1, 5),
        mobile_warnings=random.randint(2, 6),
        mobile_passed=random.randint(8, 14),
        desktop_issues=random.randint(1, 4),
        desktop_warnings=random.randint(2, 5),
        desktop_passed=random.randint(9, 14),
    )

    # --- SEO ---
    if seo_override:
        seo = seo_override
    else:
        avg_rank = random.choice(["3", "5", "7", "10+", "15+", "20+"])
        competitors = [
            {"name": f"Wettbewerber {i+1}", "photos": "Ja", "reviews": f"{random.randint(100, 30000)/1000:.2f}K", "rating": round(random.uniform(3.5, 4.9), 1)}
            for i in range(10)
        ]
        seo_score = max(0, min(100, 100 - int(avg_rank.replace('+', '')) * 8 + random.randint(-5, 5)))

        seo = SEOAnalysis(
            score=seo_score,
            avg_ranking=avg_rank,
            competitors=competitors,
            keyword_used=business_name.split()[0] if business_name else "Business",
        )

    # --- Overall Score ---
    weights = {
        "google_profile": 0.15,
        "listings": 0.15,
        "reputation": 0.2,
        "website": 0.25,
        "seo": 0.15,
        "tech": 0.1,
    }
    tech_score = round((sum(1 for t in tech_stack if t.detected) / len(tech_stack)) * 100)

    overall = round(
        gp_score * weights["google_profile"] +
        listing_score * weights["listings"] +
        rep_score * weights["reputation"] +
        (perf_score if has_website else 0) * weights["website"] +
        seo_score * weights["seo"] +
        tech_score * weights["tech"]
    )

    return AuditReport(
        lead_id=lead_id,
        business_name=business_name,
        address=address,
        phone=phone,
        website=website,
        rating=rating,
        review_count=review_count,
        overall_score=overall,
        critical_info=critical,
        tech_stack=tech_stack,
        google_profile=google_profile,
        listings=listings,
        reputation=reputation,
        website_performance=web_perf,
        seo=seo,
    )
