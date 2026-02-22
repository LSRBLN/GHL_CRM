from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid


# --- Search Models ---
class ProspectingSearchRequest(BaseModel):
    keyword: str
    location: str
    radius: int = 5


class BusinessResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    category: Optional[str] = None
    conversion_rate: int = 50
    conversion_label: str = "M\u00e4\u00dfig"
    online_presence: Dict[str, bool] = {}
    has_website: bool = False
    status: str = "Nicht hinzugef\u00fcgt"
    lat: Optional[float] = None
    lng: Optional[float] = None


class SearchResponse(BaseModel):
    businesses: List[BusinessResult]
    total: int
    keyword: str
    location: str


# --- Lead Models ---
class LeadCreate(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    category: Optional[str] = None
    conversion_rate: int = 50
    online_presence: Dict[str, bool] = {}


class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    category: Optional[str] = None
    conversion_rate: int = 50
    online_presence: Dict[str, bool] = {}
    status: str = "Nicht hinzugef\u00fcgt"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# --- Audit Report Models ---
class CriticalInfo(BaseModel):
    sms_enabled: bool = False
    sms_text: str = ""
    hosting_type: str = ""
    hosting_text: str = ""
    chat_widget: bool = False
    chat_widget_text: str = ""
    review_response_rate: int = 0
    review_response_text: str = ""


class TechStackItem(BaseModel):
    name: str
    detected: bool
    description: str
    icon: str = ""


class GoogleProfile(BaseModel):
    verified: bool = False
    score: int = 0
    details: Dict[str, Any] = {}


class ListingEntry(BaseModel):
    platform: str
    display_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    status: str = "Keine \u00dcbereinstimmung"


class ListingsAnalysis(BaseModel):
    score: int = 0
    total: int = 0
    exact_matches: int = 0
    partial_matches: int = 0
    no_matches: int = 0
    details: List[ListingEntry] = []
    summary_text: str = ""


class ReputationAnalysis(BaseModel):
    score: int = 0
    total_reviews_analyzed: int = 0
    positive_reviews: int = 0
    negative_reviews: int = 0
    total_gmb_reviews: int = 0
    gmb_rating: float = 0.0
    total_fb_reviews: int = 0
    has_facebook: bool = False
    sample_reviews: List[Dict[str, str]] = []


class WebsitePerformance(BaseModel):
    score: int = 0
    mobile_speed: float = 0.0
    desktop_speed: float = 0.0
    mobile_score: int = 0
    desktop_score: int = 0
    mobile_issues: int = 0
    mobile_warnings: int = 0
    mobile_passed: int = 0
    desktop_issues: int = 0
    desktop_warnings: int = 0
    desktop_passed: int = 0


class SEOAnalysis(BaseModel):
    score: int = 0
    avg_ranking: str = "10+"
    competitors: List[Dict[str, Any]] = []
    keyword_used: str = ""


class AuditReportCreate(BaseModel):
    business_name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    lead_id: Optional[str] = None


class AuditReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: Optional[str] = None
    business_name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    overall_score: int = 0
    critical_info: CriticalInfo = CriticalInfo()
    tech_stack: List[TechStackItem] = []
    google_profile: GoogleProfile = GoogleProfile()
    listings: ListingsAnalysis = ListingsAnalysis()
    reputation: ReputationAnalysis = ReputationAnalysis()
    website_performance: WebsitePerformance = WebsitePerformance()
    seo: SEOAnalysis = SEOAnalysis()
    created_at: datetime = Field(default_factory=datetime.utcnow)
    agency_name: str = "PHNX Vision"
    agency_phone: str = "+491741547610"
    agency_email: str = "phnxvision@gmail.com"


# --- Offer / Angebot Models ---
class ServiceItem(BaseModel):
    name: str
    description: str
    price: float = 0.0
    included: bool = True


class BenefitItem(BaseModel):
    title: str
    description: str
    metric: str = ""
    icon: str = ""


class OfferCreate(BaseModel):
    lead_id: Optional[str] = None
    report_id: Optional[str] = None
    business_name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    overall_score: int = 0
    # Optional custom data
    custom_services: Optional[List[Dict[str, Any]]] = None
    custom_note: Optional[str] = None


class Offer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: Optional[str] = None
    report_id: Optional[str] = None
    business_name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    overall_score: int = 0
    # Calculated values
    potential_customer_increase: str = ""
    potential_revenue_increase: str = ""
    potential_visibility_increase: str = ""
    potential_profit_increase: str = ""
    # Problems found
    problems: List[Dict[str, str]] = []
    # Services offered
    services: List[ServiceItem] = []
    total_price: float = 0.0
    discount_price: Optional[float] = None
    # Benefits
    benefits: List[BenefitItem] = []
    # Agency info
    agency_name: str = "PHNX Vision"
    agency_phone: str = "+491741547610"
    agency_email: str = "phnxvision@gmail.com"
    agency_website: str = "www.phnxvision.de"
    # Timestamps
    valid_until: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    custom_note: Optional[str] = None

