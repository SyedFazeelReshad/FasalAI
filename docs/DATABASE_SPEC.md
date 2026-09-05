# FasalAI — Database Specification

## Conceptual Entity-Relationship Model

```
User ──< Farm
User ──< Case (as farmer)
User ──< Verification (as extension worker)
Farm ──< Case
Crop (reference) ──< Case
Case ──< Prediction
Case ──< Verification
Case ──< Advisory
Case ──< Location
Case ──< WeatherSnapshot
```

---

## Entities

### 1. User
Represents all system users with role-based access.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| phone | VARCHAR(20) | UNIQUE, NULLABLE | Login phone (optional) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt/Argon2 hash |
| full_name | VARCHAR(100) | NOT NULL | Display name |
| role | ENUM | NOT NULL | 'farmer' \| 'extension_worker' \| 'official' \| 'admin' |
| avatar_url | VARCHAR(500) | NULLABLE | Profile image |
| preferred_language | VARCHAR(10) | DEFAULT 'en' | ISO 639-1 code |
| is_active | BOOLEAN | DEFAULT true | Soft delete flag |
| last_login_at | TIMESTAMP | NULLABLE | Track activity |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | DEFAULT now() | |

**Indexes:** email, phone, role

---

### 2. Farm
Farmer's field/plot information.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| user_id | UUID | FK → User.id, NOT NULL | Owner |
| name | VARCHAR(100) | NOT NULL | Farmer-defined name |
| location | GEOGRAPHY(POINT) | NOT NULL | Lat/Long (PostGIS) |
| address | TEXT | NULLABLE | Human-readable address |
| area_value | DECIMAL(10,2) | NOT NULL | Size value |
| area_unit | VARCHAR(10) | NOT NULL | 'acre' \| 'hectare' \| 'sqm' |
| primary_crop_id | UUID | FK → Crop.id, NULLABLE | Current/main crop |
| soil_type | VARCHAR(50) | NULLABLE | e.g., 'loamy', 'clay' |
| irrigation_type | VARCHAR(50) | NULLABLE | e.g., 'drip', 'flood', 'rainfed' |
| notes | TEXT | NULLABLE | |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | DEFAULT now() | |

**Indexes:** user_id, location (GIST), primary_crop_id

---

### 3. Crop (Reference Table)
Master list of supported crops. Extensible without schema changes.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Short code: 'tomato', 'maize', 'grape' |
| name | VARCHAR(100) | NOT NULL | Display name |
| scientific_name | VARCHAR(150) | NULLABLE | |
| icon_url | VARCHAR(500) | NULLABLE | UI icon |
| is_active | BOOLEAN | DEFAULT true | |
| sort_order | INT | DEFAULT 0 | UI ordering |
| created_at | TIMESTAMP | DEFAULT now() | |

**Example Data:**
| code | name | scientific_name |
|------|------|-----------------|
| tomato | Tomato | Solanum lycopersicum |
| maize | Maize | Zea mays |
| grape | Grape | Vitis vinifera |

---

### 4. Disease (Reference Table)
Master list of diseases/pests per crop. Extensible.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| crop_id | UUID | FK → Crop.id, NOT NULL | Parent crop |
| code | VARCHAR(50) | UNIQUE, NOT NULL | 'tomato_early_blight' |
| name | VARCHAR(100) | NOT NULL | 'Early Blight' |
| scientific_name | VARCHAR(150) | NULLABLE | 'Alternaria solani' |
| category | ENUM | NOT NULL | 'disease' \| 'pest' \| 'nutrient_deficiency' \| 'healthy' |
| severity_base | ENUM | DEFAULT 'medium' | 'low' \| 'medium' \| 'high' \| 'critical' |
| description | TEXT | NULLABLE | General info |
| symptoms | TEXT[] | NULLABLE | Array of symptom strings |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMP | DEFAULT now() | |

**Unique Constraint:** (crop_id, code)

**Example Data (Tomato):**
| code | name | category | severity_base |
|------|------|----------|---------------|
| tomato_healthy | Healthy | healthy | low |
| tomato_bacterial_spot | Bacterial Spot | disease | high |
| tomato_early_blight | Early Blight | disease | high |
| tomato_late_blight | Late Blight | disease | critical |
| tomato_ylcv | Tomato Yellow Leaf Curl Virus | disease | critical |

---

### 5. Case
Core entity linking farmer, farm, crop, and detection event.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| farmer_id | UUID | FK → User.id, NOT NULL | |
| farm_id | UUID | FK → Farm.id, NOT NULL | |
| crop_id | UUID | FK → Crop.id, NOT NULL | Crop at time of detection |
| status | ENUM | DEFAULT 'submitted' | 'draft' \| 'submitted' \| 'under_review' \| 'verified' \| 'rejected' \| 'closed' |
| images | JSONB | NOT NULL | Array: [{url, thumbnail_url, is_primary, metadata}] |
| location | GEOGRAPHY(POINT) | NULLABLE | Detection location (may differ from farm) |
| captured_at | TIMESTAMP | NOT NULL | When image was taken |
| submitted_at | TIMESTAMP | NULLABLE | When submitted for review |
| reviewed_at | TIMESTAMP | NULLABLE | |
| closed_at | TIMESTAMP | NULLABLE | |
| notes | TEXT | NULLABLE | Farmer notes |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | DEFAULT now() | |

**Indexes:** farmer_id, farm_id, crop_id, status, captured_at, location (GIST)

---

### 6. Prediction
AI model output linked to a case. One case can have multiple predictions (re-runs, ensemble).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| case_id | UUID | FK → Case.id, NOT NULL | |
| model_version | VARCHAR(50) | NOT NULL | e.g., 'v1.2.0-tomato' |
| disease_id | UUID | FK → Disease.id, NOT NULL | Predicted class |
| confidence | DECIMAL(5,4) | NOT NULL | 0.0000 – 1.0000 |
| all_scores | JSONB | NOT NULL | Full probability distribution: {disease_id: score} |
| risk_level | ENUM | NOT NULL | 'low' \| 'medium' \| 'high' \| 'critical' |
| risk_factors | JSONB | NULLABLE | {weather, confidence, severity, spread_risk} |
| inference_time_ms | INT | NULLABLE | Model latency |
| is_primary | BOOLEAN | DEFAULT true | Primary prediction for case |
| created_at | TIMESTAMP | DEFAULT now() | |

**Indexes:** case_id, disease_id, is_primary

---

### 7. Verification
Extension worker review of a case.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| case_id | UUID | FK → Case.id, NOT NULL, UNIQUE | One verification per case |
| extension_worker_id | UUID | FK → User.id, NOT NULL | |
| action | ENUM | NOT NULL | 'confirmed' \| 'corrected' |
| corrected_disease_id | UUID | FK → Disease.id, NULLABLE | Required if action='corrected' |
| confidence_agreement | ENUM | NULLABLE | 'agree' \| 'disagree' \| 'uncertain' |
| field_observations | TEXT | NULLABLE | Free text notes |
| field_images | JSONB | NULLABLE | [{url, caption}] |
| recommendations | JSONB | NULLABLE | Structured: [{type, description, priority, timing}] |
| status_before | ENUM | NOT NULL | Case status at start of review |
| status_after | ENUM | NOT NULL | Case status after review |
| reviewed_at | TIMESTAMP | DEFAULT now() | |
| created_at | TIMESTAMP | DEFAULT now() | |

**Indexes:** case_id, extension_worker_id, action

---

### 8. Advisory
Structured advisory content per disease (can be crop-specific).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| disease_id | UUID | FK → Disease.id, NOT NULL | |
| crop_id | UUID | FK → Crop.id, NOT NULL | |
| language | VARCHAR(10) | DEFAULT 'en' | |
| immediate_actions | TEXT[] | NOT NULL | Array of action strings |
| monitoring | TEXT[] | NOT NULL | |
| expert_consultation | TEXT[] | NOT NULL | |
| input_guidance | TEXT[] | NOT NULL | Pesticide/fertilizer guidance with compliance note |
| preventive_measures | TEXT[] | NULLABLE | |
| source_references | TEXT[] | NULLABLE | Links to govt/univ sources |
| version | INT | DEFAULT 1 | For updates |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | DEFAULT now() | |

**Unique Constraint:** (disease_id, crop_id, language, version)

---

### 9. Location
Reusable location entity for farms, cases, weather stations.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| latitude | DECIMAL(10,8) | NOT NULL | -90 to 90 |
| longitude | DECIMAL(11,8) | NOT NULL | -180 to 180 |
| accuracy_meters | INT | NULLABLE | GPS accuracy |
| address | TEXT | NULLABLE | Reverse geocoded |
| district | VARCHAR(100) | NULLABLE | |
| state | VARCHAR(100) | NULLABLE | |
| country | VARCHAR(100) | DEFAULT 'India' | |
| timezone | VARCHAR(50) | NULLABLE | IANA tz |
| created_at | TIMESTAMP | DEFAULT now() | |

**Index:** (latitude, longitude) — GIST on geography point

---

### 10. WeatherSnapshot
Weather conditions at time/location of detection for risk context.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, default gen | |
| case_id | UUID | FK → Case.id, NOT NULL, UNIQUE | One snapshot per case |
| temperature_c | DECIMAL(5,2) | NULLABLE | |
| humidity_percent | INT | NULLABLE | 0-100 |
| rainfall_mm | DECIMAL(6,2) | NULLABLE | Last 24h |
| wind_speed_kmh | DECIMAL(5,2) | NULLABLE | |
| weather_condition | VARCHAR(50) | NULLABLE | 'sunny', 'cloudy', 'rainy', etc. |
| forecast_3day | JSONB | NULLABLE | Array of daily forecasts |
| source | VARCHAR(50) | NOT NULL | 'openweather', 'imd', etc. |
| captured_at | TIMESTAMP | NOT NULL | When fetched |
| created_at | TIMESTAMP | DEFAULT now() | |

---

## Relationships Summary

| From | To | Type | Via |
|------|-----|------|-----|
| User | Farm | 1:N | user_id |
| User | Case (farmer) | 1:N | farmer_id |
| User | Verification | 1:N | extension_worker_id |
| Farm | Case | 1:N | farm_id |
| Crop | Case | 1:N | crop_id |
| Crop | Disease | 1:N | crop_id |
| Case | Prediction | 1:N | case_id |
| Case | Verification | 1:1 | case_id |
| Case | WeatherSnapshot | 1:1 | case_id |
| Disease | Advisory | 1:N | disease_id |

---

## Design Principles

1. **Crop-agnostic:** Crop and Disease are reference tables — new crops/diseases added via data, not schema changes
2. **Audit trail:** All entities have created_at/updated_at; Case has full lifecycle timestamps
3. **Soft deletes:** is_active flags instead of hard deletes
4. **JSONB for flexibility:** images, all_scores, risk_factors, recommendations, forecast — allows evolution without migrations
5. **PostGIS for geography:** Location-based queries (nearby cases, district aggregates, heatmaps)
6. **Versioned advisory:** Supports multi-language and content updates
7. **Single verification per case:** Enforced by UNIQUE constraint on case_id in Verification
8. **Model versioning:** Predictions track model_version for reproducibility and A/B testing

---

## Future Extensibility (No Schema Changes Needed)

- New crops → INSERT into Crop
- New diseases → INSERT into Disease
- New advisory languages → INSERT into Advisory
- Pest traps/IoT sensors → New table SensorReading (case_id, sensor_type, value, timestamp)
- Satellite imagery → New table SatelliteImage (case_id, url, bands, captured_at)
- Treatment products → New table TreatmentProduct (disease_id, product_name, active_ingredient, label_url)
- Government schemes → New table Scheme (region, crop_id, disease_id, benefits, eligibility)