# FasalAI — API Specification

## Overview
- **Base URL:** `/api/v1`
- **Protocol:** HTTPS (production), HTTP (local dev)
- **Format:** JSON request/response
- **Authentication:** JWT Bearer tokens
- **Versioning:** URL path (`/v1/`) — breaking changes = new version

---

## Authentication

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

### Token Flow
1. `POST /auth/login` → returns `{ access_token, refresh_token, user }`
2. Access token: 15 min expiry, JWT (RS256)
3. Refresh token: 7 days, HTTP-only secure cookie + rotation
4. `POST /auth/refresh` → new access token

### Roles & Permissions
| Role | Prefix Access |
|------|---------------|
| farmer | `/farmer/*`, `/cases/*` (own), `/farms/*` (own) |
| extension_worker | `/extension/*`, `/cases/*` (assigned/nearby) |
| official | `/official/*`, `/cases/*` (all), `/analytics/*` |
| admin | All endpoints |

---

## Common Response Patterns

### Success
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [{ "field": "email", "message": "Invalid email format" }]
  }
}
```

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_REQUIRED | 401 | Missing/invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Request validation failed |
| CONFLICT | 409 | Resource conflict (e.g., duplicate) |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Downstream service down |

---

## Planned Endpoints

### Authentication
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register farmer (email/phone, password, name) |
| POST | `/auth/login` | Public | Login → tokens |
| POST | `/auth/refresh` | Auth | Refresh access token |
| POST | `/auth/logout` | Auth | Revoke refresh token |
| GET | `/auth/me` | Auth | Current user profile |
| PATCH | `/auth/me` | Auth | Update profile (name, language, avatar) |
| POST | `/auth/forgot-password` | Public | Request password reset |
| POST | `/auth/reset-password` | Public | Reset with token |

### Farms (Farmer)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/farms` | Farmer | List own farms (paginated, filterable) |
| POST | `/farms` | Farmer | Create farm |
| GET | `/farms/{id}` | Farmer | Get farm detail |
| PATCH | `/farms/{id}` | Farmer | Update farm |
| DELETE | `/farms/{id}` | Farmer | Soft delete farm |
| GET | `/farms/{id}/cases` | Farmer | Cases for this farm |

### Crops & Diseases (Reference)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/crops` | Auth | List active crops |
| GET | `/crops/{cropId}/diseases` | Auth | Diseases for a crop |
| GET | `/diseases/{id}` | Auth | Disease detail with advisory |

### Prediction (Core)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/predict` | Farmer | Upload image → AI prediction |

**Request (multipart/form-data):**
```
file: <image> (required, max 10MB, jpg/png)
farm_id: UUID (required)
crop_id: UUID (required)
latitude: float (optional)
longitude: float (optional)
notes: string (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "case_id": "uuid",
    "prediction": {
      "disease_id": "uuid",
      "disease_name": "Early Blight",
      "disease_code": "tomato_early_blight",
      "confidence": 0.87,
      "risk_level": "high",
      "all_scores": { "tomato_early_blight": 0.87, "tomato_healthy": 0.08, ... }
    },
    "advisory": {
      "immediate_actions": [...],
      "monitoring": [...],
      "expert_consultation": [...],
      "input_guidance": [...]
    }
  }
}
```

### Cases
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/cases` | Farmer/Ext/Official | List cases (role-scoped, paginated, filters) |
| POST | `/cases` | Farmer | Submit case from prediction (draft → submitted) |
| GET | `/cases/{id}` | Farmer/Ext/Official | Case detail (role-scoped fields) |
| PATCH | `/cases/{id}` | Farmer | Update draft case (notes, images) |
| DELETE | `/cases/{id}` | Farmer | Delete draft case |
| GET | `/cases/{id}/prediction` | Farmer/Ext/Official | Prediction detail |
| GET | `/cases/{id}/advisory` | Farmer/Ext/Official | Advisory detail |
| GET | `/cases/{id}/verification` | Ext/Official | Verification detail |

### Verification (Extension Worker)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/cases/{id}/verify` | Extension | Submit verification |
| GET | `/extension/cases/pending` | Extension | Pending cases for review |
| GET | `/extension/cases/assigned` | Extension | Assigned cases |
| PATCH | `/extension/cases/{id}/assign` | Extension | Self-assign case |

**Verification Request:**
```json
{
  "action": "confirmed" | "corrected",
  "corrected_disease_id": "uuid", // required if corrected
  "confidence_agreement": "agree" | "disagree" | "uncertain",
  "field_observations": "string",
  "field_images": [{ "url": "string", "caption": "string" }],
  "recommendations": [
    { "type": "treatment", "description": "string", "priority": "high", "timing": "immediate" }
  ],
  "status_after": "verified" | "rejected"
}
```

### Advisory
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/advisories/{diseaseId}` | Auth | Get advisory for disease (with crop context via query) |
| GET | `/advisories/{diseaseId}/pdf` | Auth | Download PDF advisory |

### Dashboards
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/farmer` | Farmer | Stats, recent cases, farm summary, weather |
| GET | `/dashboard/extension` | Extension | Pending count, assigned, verified today, stats |
| GET | `/dashboard/official` | Official | Regional stats, trends, hotspots summary |

### Analytics (Official)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/analytics/cases` | Official | Cases with filters (region, crop, disease, date) |
| GET | `/analytics/diseases` | Official | Disease distribution |
| GET | `/analytics/trends` | Official | Time series (granularity: day/week/month) |
| GET | `/analytics/hotspots` | Official | GeoJSON for map clusters |
| GET | `/analytics/risk-areas` | Official | High-risk regions table |
| GET | `/analytics/export` | Official | CSV/PDF export |

### Weather
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/weather/current` | Auth | Current weather for lat/lon (query params) |
| GET | `/weather/forecast` | Auth | 3-7 day forecast for lat/lon |

---

## Request/Response Concepts

### Pagination
Query params: `page` (default 1), `limit` (default 20, max 100)
Response `meta`: `{ page, limit, total, totalPages }`

### Filtering (Common)
- `crop_id`, `disease_id`, `status`, `date_from`, `date_to`, `farm_id`
- Extension: `assigned_to_me=true`, `confidence_below=0.7`
- Official: `district`, `state`, `risk_level`

### Sorting
`sort=field:asc|desc` (e.g., `sort=captured_at:desc`)

### File Uploads
- Max 10MB per image
- Accepted: `image/jpeg`, `image/png`, `image/webp`
- Returns: `{ url, thumbnail_url, width, height, size }`

### Idempotency
- `POST /predict` supports `Idempotency-Key` header for retry safety

---

## WebSocket (Future)
- Real-time case status updates for extension workers
- Notification feed for farmers
- Live dashboard updates for officials

---

## Rate Limiting
| Tier | Requests/Minute | Burst |
|------|-----------------|-------|
| Auth endpoints | 10 | 20 |
| Prediction | 30 | 50 |
| General API | 120 | 200 |
| Analytics/Export | 10 | 20 |

---

## Security Considerations
- All endpoints HTTPS in production
- CORS restricted to known frontend origins
- Input validation on all endpoints (Zod/Pydantic)
- SQL injection prevention via ORM/parameterized queries
- XSS prevention via output encoding
- Rate limiting per IP + per user
- Audit logging for all mutating operations
- PII encryption at rest (email, phone, location)

---

## Implementation Notes
- **Not implemented yet** — this is a contract document
- Endpoint paths, params, and response shapes may evolve
- Version increment on breaking changes
- OpenAPI/Swagger spec to be generated from implementation