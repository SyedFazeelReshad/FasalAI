# FasalAI — SIH Demo Flow

## Demo Objective
Demonstrate the complete FasalAI workflow from farmer detection to official monitoring in a realistic, end-to-end scenario.

---

## Demo Personas & Credentials

| Role | Username | Password | Notes |
|------|----------|----------|-------|
| Farmer | `farmer_demo` | `demo123` | Pre-registered with 2 farms |
| Extension Worker | `ext_worker_demo` | `demo123` | Assigned to farmer's district |
| Agriculture Official | `official_demo` | `demo123` | State-level access |

---

## Demo Script (8-10 minutes)

### 1. Farmer Login & Dashboard (1 min)
**Actions:**
- Login as `farmer_demo`
- Show dashboard: farm cards, quick stats, recent cases
- Highlight: Weather widget for primary farm

**Talking Points:**
- "Farmer sees personalized view with their farms and recent activity"
- "Weather context shown upfront for risk awareness"

---

### 2. Add Farm (Optional, 30 sec)
**Actions:**
- Navigate to Farms → Add Farm
- Fill: Name "Demo Farm", pick location on map, size 2.5 acres, crop: Tomato
- Save

**Talking Points:**
- "Geotagged farms enable location-based risk assessment"
- "Crop selection drives correct model head"

---

### 3. Disease Detection Flow (3 min)
**Actions:**
- Navigate to Detect
- Select crop: **Tomato**
- Upload image: **Pre-loaded test image** (Tomato Early Blight, real-field photo)
- Show processing screen (uploading → analyzing → generating advisory)
- **Result Page Appears:**
  - Image preview
  - Prediction: "Early Blight"
  - Confidence: 87% (High)
  - Risk Level: HIGH ⚠️
- Click **View Advisory**
  - Show structured advisory: Immediate Actions, Monitoring, Expert Consultation, Input Guidance
- Click **Submit Case**
  - Case saved with status "Submitted"
  - Show case ID, timestamp

**Talking Points:**
- "AI Prediction — not diagnosis. Confidence 87% = model confidence, not correctness proof"
- "Risk level combines confidence + disease severity + weather context"
- "Advisory is structured and actionable, not just chemical prescription"
- "Input guidance emphasizes label-approved products and extension consultation"

---

### 4. Case History (30 sec)
**Actions:**
- Navigate to Cases
- Show list with new case at top
- Click case → show detail with timeline

**Talking Points:**
- "Full traceability: image, prediction, advisory, status history"
- "Farmer can track case through verification"

---

### 5. Extension Worker Verification (2 min)
**Actions:**
- Logout farmer, login as `ext_worker_demo`
- Dashboard shows: "3 Pending Cases" (including farmer's case)
- Click farmer's case
- **Case Detail View:**
  - Left: Image + AI Prediction (Early Blight, 87%)
  - Right: Verification form
- **Verify:** Select "Confirm" (agree with AI)
- Add field observation: "Observed concentric rings on lower leaves, 30% canopy affected"
- Add recommendation: "Copper oxychloride 50% WP @ 2.5g/L, repeat after 10 days"
- Set status: **Verified**
- Submit

**Talking Points:**
- "Human-in-the-loop: Extension worker validates AI"
- "Field observations add ground truth"
- "Recommendations are structured: type, priority, timing"
- "Verified case becomes confirmed data point for hotspot analysis"

---

### 6. Agriculture Official Monitoring (2 min)
**Actions:**
- Logout extension, login as `official_demo`
- **Dashboard:** KPI cards, disease distribution, trend chart, mini hotspot map
- Navigate to **Trends**
  - Show 30-day trend for Tomato Early Blight in district
  - Highlight: Spike last week correlates with humidity
- Navigate to **Hotspots**
  - Full-screen map with clustered markers
  - Click cluster → list cases → click case → detail modal
  - Show: Verified cases (green), Pending (yellow), Rejected (red)
- Navigate to **Risk Areas**
  - Table: District, Case Count, Dominant Disease, Risk Score
  - Sort by Risk Score → top district highlighted
- Click **Export Report** → CSV download

**Talking Points:**
- "Officials see aggregated intelligence, not individual farmer PII"
- "Trends correlate disease with weather for predictive insight"
- "Hotspot map enables targeted intervention"
- "Risk areas prioritize resource allocation"
- "Export for coordination with state agencies"

---

### 7. Low-Confidence Demo (Optional, 1 min)
**Actions:**
- Login as farmer again
- Upload **ambiguous image** (e.g., nutrient deficiency vs disease)
- Show result: Confidence 42%, Risk Level: CRITICAL
- Advisory shows: "AI uncertain — expert review required"
- Submit case
- Switch to extension worker → shows as **Priority Review** (red badge)

**Talking Points:**
- "Low confidence triggers mandatory expert review"
- "System doesn't guess — it escalates"
- "Builds trust: AI knows what it doesn't know"

---

## Demo Data Requirements

### Pre-loaded Test Images (in repo/assets/demo)
| Image | Crop | Expected Prediction | Confidence Range |
|-------|------|---------------------|------------------|
| `tomato_early_blight_1.jpg` | Tomato | Early Blight | 80-95% |
| `tomato_late_blight_1.jpg` | Tomato | Late Blight | 75-90% |
| `maize_common_rust_1.jpg` | Maize | Common Rust | 80-95% |
| `grape_black_rot_1.jpg` | Grape | Black Rot | 70-85% |
| `tomato_ambiguous_1.jpg` | Tomato | Uncertain | 30-50% |

### Pre-seeded Database
- 1 Farmer user with 2 farms (Tomato, Maize)
- 1 Extension worker assigned to same district
- 1 Official with state access
- 5 historical cases (mixed statuses) for dashboard charts
- Weather snapshots linked to cases

---

## Technical Demo Setup

### Local Demo Stack
```bash
# Terminal 1: Backend (when ready)
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2: ML Service (when ready)
cd ml && python serve.py --port 8001

# Terminal 3: Frontend
cd frontend && npm run dev -- --port 5173
```

### Demo Mode Flags
- `VITE_DEMO_MODE=true` — enables pre-loaded test images, mock ML responses
- `VITE_MOCK_ML=true` — bypasses real ML, returns scripted predictions
- Demo users auto-created on backend init

---

## Key Messages for Judges

1. **"AI Prediction, not Diagnosis"** — Responsible AI framing
2. **"Human-in-the-Loop"** — Extension worker verification closes the loop
3. **"Crop-Agnostic Architecture"** — Add new crops without code changes
4. **"Contextual Risk"** — Confidence + Weather + Severity = Actionable Risk
5. **"Actionable Advisory"** — Structured, not just chemical names
6. **"Data for Governance"** — Hotspots, trends, risk areas for officials
7. **"Farmer-First UX"** — Simple, visual, multilingual-ready
8. **"Extensible Foundation"** — Sensors, satellite, schemes, marketplace ready

---

## Backup Plan (If Live Demo Fails)
1. **Recorded video** of full flow (3 min)
2. **Screenshots** of each step in presentation
3. **Postman collection** showing API contracts
4. **Database schema** and **ML architecture** diagrams
5. **Code walkthrough** of key components