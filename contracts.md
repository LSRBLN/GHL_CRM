# API Contracts - GoHighLevel Prospecting Clone

## Backend Endpoints

### 1. POST /api/prospecting/search
Search for businesses by keyword and location.
- Request: `{ keyword: str, location: str, radius: int }`
- Response: `{ businesses: [...], total: int }`
- Uses Google Places API (or mock data)

### 2. POST /api/prospecting/report
Generate a marketing audit report for a business.
- Request: `{ business_id: str, business_name: str, address: str, phone: str, website: str, rating: float, review_count: int }`
- Response: `{ report_id: str, report: AuditReport }`
- Stores in MongoDB

### 3. GET /api/prospecting/report/{report_id}
Get a saved audit report by ID.
- Response: `AuditReport`

### 4. GET /api/prospecting/leads
Get all saved leads.
- Response: `{ leads: [...] }`

### 5. POST /api/prospecting/leads
Save a lead/business as prospect.
- Request: `{ business data }`
- Response: `{ lead_id: str }`

## Data Models

### Lead
- id, name, address, phone, website, rating, review_count
- conversion_rate, online_presence, status, created_at

### AuditReport
- id, lead_id, business_name, created_at
- overall_score
- critical_info: { sms_enabled, hosting_type, chat_widget, review_response_rate }
- tech_stack: { gtm, analytics, fb_pixel, google_ads_pixel, google_ads }
- google_profile: { verified, score, details }
- listings: { score, total, exact, partial, none, details[] }
- reputation: { score, total_reviews, positive, negative, avg_rating, reviews[] }
- website_performance: { score, mobile_speed, desktop_speed, web_vitals, health }
- seo: { score, avg_ranking, competitors[] }

## Mock Data
- prospectingData.js contains mock businesses for search
- Report generation creates realistic mock analysis data

## Frontend Integration
- Prospecting page calls /api/prospecting/search
- Click "Hinzufügen" saves lead via /api/prospecting/leads
- Click on business name opens audit report page
- Report page fetches/generates via /api/prospecting/report
