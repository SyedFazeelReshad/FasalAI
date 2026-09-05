# FasalAI — Project Context

## Project Overview
**Project Name:** FasalAI  
**Tagline:** AI-Powered Crop Health Intelligence  
**SIH Problem Statement:** SIH26131 — Early detection and management of crop diseases and pest infestations.

## Purpose
FasalAI is a farmer- and agriculture-worker-friendly crop health intelligence system designed to support:
- Early detection of crop diseases and pest infestations
- Risk assessment based on AI confidence, weather, and location
- Structured management advisory guidance
- Expert verification by extension workers
- Follow-up monitoring of cases
- Agricultural administration and hotspot monitoring

## Core Workflow
```
Farmer uploads crop/plant image
        ↓
AI prediction (with confidence score)
        ↓
Risk assessment (confidence + contextual factors)
        ↓
Advisory generation (structured, actionable)
        ↓
Case saved to database
        ↓
Extension worker can verify/correct prediction
        ↓
Agriculture officials monitor cases, trends, hotspots
```

## Target Users
1. **Farmer** — Primary user; uploads images, receives predictions, tracks cases
2. **Extension Worker** — Verifies/corrects AI predictions, adds field observations
3. **Agriculture Official** — Monitors regional trends, disease statistics, hotspots

## Technical Architecture
- **Frontend:** React + Vite + JavaScript
- **Backend:** Python + FastAPI
- **Database:** PostgreSQL
- **ML Service:** Python-based ML model/service
- **External Services:** Weather API, Maps/Location functionality

```
Frontend
    ↓ REST API
FastAPI Backend
    ├── PostgreSQL
    ├── ML Model/Service
    ├── Weather API
    └── Maps/Location Service
```

## Important Product Principles
1. AI output = "AI Prediction" or "AI Crop Health Assessment" (not definitive diagnosis)
2. Confidence = model confidence score, not proof of correctness
3. Low confidence → encourage expert verification
4. Advisory = structured and actionable
5. Avoid blind pesticide prescription; encourage label-approved/local guidance
6. Human-in-the-loop: AI prediction → extension verification → confirmed case
7. Location and time associated with cases where appropriate
8. Historical cases support risk assessment and hotspot analysis
9. Weather supports contextual risk assessment
10. Architecture must allow future addition of crops, diseases, pests, sensors, models without redesign

## Initial Crop/Model Direction (Working Baseline)
**Architecture must remain crop-agnostic.** Do not hard-code around specific crops.

Current prototype baseline:
- **Tomato:** Healthy, Bacterial Spot, Early Blight, Late Blight, Tomato Yellow Leaf Curl Virus
- **Maize:** Healthy, Common Rust, Gray Leaf Spot, Northern Leaf Blight
- **Grape:** Healthy, Black Rot, Black Measles/Esca, Leaf Blight

Classes may change after dataset inspection and model development.

## Competitive Reference: Plantix
Plantix is a **Research & Competitive Reference** only.
Relevant lessons: image-based prediction, real-field images, confidence workflow, human confirmation, advisory, geotagged data, spatial intelligence, multilingual UX.
**FasalAI does NOT have access to Plantix's private dataset.**

## MVP Scope
**Farmer:** Registration/login, dashboard, farm management, crop selection, image upload, AI prediction, confidence, risk level, advisory, case history  
**Extension Worker:** Login, dashboard, case list/detail, AI result review, verification/correction, field observations, recommendations, case status  
**Agriculture Official:** Login, dashboard, cases, disease statistics, trends, basic hotspot map, high-risk areas  
**System:** Frontend/backend communication, database persistence, ML integration, location, weather/contextual risk

## Long-term Direction
- Expand crop and disease coverage
- Integrate pest traps and IoT sensors
- Multi-language support
- Offline-capable mobile experience
- Predictive risk modeling with weather + historical data
- Integration with government agricultural schemes