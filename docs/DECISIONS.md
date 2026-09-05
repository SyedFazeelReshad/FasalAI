# FasalAI — Architecture & Product Decisions

This document records key decisions made during project initiation. Each entry includes the decision, rationale, and alternatives considered.

---

## 1. Frontend: React + Vite (JavaScript)

**Decision:** Use React 18 with Vite build tool, plain JavaScript (not TypeScript).

**Rationale:**
- **Vite:** Fast dev server (<1s HMR), optimized production builds, minimal config
- **React:** Component ecosystem, team familiarity, long-term support
- **JavaScript (not TS):** Faster initial velocity for MVP, lower barrier for contributors, TS can be added incrementally

**Alternatives Considered:**
- Next.js — Overkill for SPA, adds server complexity
- Vue/Svelte — Team less familiar
- TypeScript — Adds setup time, type definition maintenance for MVP

**Revisit When:** Team scales, type-related bugs increase, or backend contract formalized (OpenAPI → TS types)

---

## 2. Backend: FastAPI (Python)

**Decision:** Python 3.11+ with FastAPI framework.

**Rationale:**
- **Async native:** High concurrency for ML inference + API
- **Auto OpenAPI/Swagger:** Contract-first development, frontend SDK generation
- **Pydantic:** Validation + serialization built-in
- **ML Ecosystem:** Native integration with PyTorch, ONNX, scikit-learn
- **Performance:** On par with Node.js/Go for API workloads

**Alternatives Considered:**
- Django REST Framework — Heavier, sync-first, slower for ML serving
- Node.js/Express — ML integration requires child processes or separate service
- Go — ML ecosystem immature

**Revisit When:** Need GraphQL, or team prefers different stack

---

## 3. Database: PostgreSQL

**Decision:** PostgreSQL 15+ with PostGIS extension.

**Rationale:**
- **PostGIS:** First-class geospatial queries (hotspots, nearby cases, district aggregates)
- **JSONB:** Flexible storage for predictions, advisory, weather, recommendations
- **ACID:** Reliability for case/verification workflows
- **Maturity:** Battle-tested, excellent tooling, cloud-managed options
- **Extensions:** TimescaleDB (time-series), pgvector (embeddings) available later

**Alternatives Considered:**
- MongoDB — Geospatial weaker, no ACID transactions across collections
- MySQL — PostGIS equivalent weaker, JSON less flexible
- SQLite — No PostGIS, not production-ready for concurrent writes

**Revisit When:** Need horizontal scaling (Citus), or time-series volume justifies TimescaleDB

---

## 4. ML Architecture: Crop-Agnostic, Multi-Head

**Decision:** Single backbone with crop-specific classification heads; crop selection routes to correct head.

**Rationale:**
- **Extensibility:** Add crops by adding head + data, no architecture change
- **Shared Features:** Low-level features (edges, textures) transfer across crops
- **Deployment:** Single model artifact (initially), simpler serving
- **Farmer UX:** Farmer selects crop anyway (knows what they planted)

**Alternatives Considered:**
- One model per crop — Multiple artifacts, crop detection needed first
- Single giant head (all classes) — Class imbalance, no crop context, grows unbounded
- Hierarchical (crop → disease) — Two-stage inference, error propagation

**Revisit When:** >15 crops or model size >500MB (then split to per-crop models)

---

## 5. Human-in-the-Loop Verification

**Decision:** Mandatory extension worker verification for low-confidence predictions; optional for high-confidence.

**Rationale:**
- **Trust:** Farmers trust system more when experts validate
- **Quality:** Extension corrections create labeled data for retraining
- **Safety:** Prevents harmful actions from wrong predictions
- **Accountability:** Audit trail for every verified case
- **Policy Alignment:** Matches government extension system workflow

**Thresholds:**
- Confidence ≥ 85%: Auto-verified (farmer can still request review)
- Confidence 70-84%: Extension review encouraged
- Confidence < 70%: Extension review **required** before case closes

**Alternatives Considered:**
- No verification — Risk of wrong advice, no ground truth collection
- All cases verified — Bottleneck, delays farmer advisory
- Peer verification (other farmers) — Unreliable, no expertise guarantee

---

## 6. Weather & Contextual Risk Integration

**Decision:** Integrate weather API at prediction time; store WeatherSnapshot with each case.

**Rationale:**
- **Disease Biology:** Many diseases require specific humidity/temperature windows
- **Risk Accuracy:** Same confidence + high humidity = higher actual risk
- **Predictive:** Historical weather + cases → risk forecasting
- **Advisory Relevance:** "Avoid irrigation" only matters if rain not forecast

**Data Stored per Case:**
- Temperature, humidity, rainfall (24h), wind, condition
- 3-day forecast at time of detection
- Weather source attribution

**Alternatives Considered:**
- No weather — Misses critical context, lower advisory relevance
- Weather only in advisory — Not stored, can't analyze historically
- Satellite weather only — Lower resolution, no forecast

---

## 7. Plantix as Research Reference Only

**Decision:** Reference Plantix for UX patterns, workflow, feature ideas. No data, model, or API dependency.

**Rationale:**
- **Legal:** Plantix data is proprietary; no license for reuse
- **Independence:** FasalAI must own its model and data pipeline
- **Differentiation:** Government-backed, open, extensible, multilingual
- **Credibility:** Cite as inspiration, not as source

**What We Learn From Plantix:**
- Image-based detection UX
- Confidence display patterns
- Farmer-friendly advisory structure
- Geotagged case mapping
- Multilingual agricultural terminology

**What We Do NOT Do:**
- Claim Plantix dataset access
- Use Plantix model/API
- Replicate Plantix business model

---

## 8. MVP-First Approach

**Decision:** Build minimal viable product covering core detection → verification → monitoring loop. Defer all nice-to-haves.

**MVP Scope (Must Have):**
- Farmer: Login, farm, detect, prediction, advisory, case history
- Extension: Login, case list, verify/correct, observations, recommendations
- Official: Login, dashboard, trends, hotspots, risk areas
- System: API, DB, ML inference, location, weather

**Explicitly Deferred (Post-MVP):**
- Multilingual UI
- Offline mode / PWA
- Mobile app (React Native)
- Pest trap / IoT integration
- Satellite imagery
- Market linkage
- Government scheme integration
- Farmer community/forum
- Advanced analytics (ML-powered forecasting)
- Notification system (SMS, push, WhatsApp)
- Role-based access control (beyond 3 roles)
- Audit logging UI
- Automated retraining pipeline

**Rationale:**
- SIH demo needs working end-to-end flow
- Scope creep kills MVP
- Each deferred item is documented for future sprints

---

## 9. Authentication: JWT + Refresh Tokens

**Decision:** Short-lived access tokens (15 min) + HTTP-only refresh cookies (7 days, rotation).

**Rationale:**
- **Security:** Access token compromise limited window
- **UX:** Silent refresh, no login interruption
- **Scalability:** Stateless access tokens, no server session store
- **Standards:** OAuth2/OIDC compatible

**Alternatives Considered:**
- Session cookies only — CSRF risk, doesn't scale to multiple services
- Long-lived JWT only — No revocation, security risk
- OAuth2 provider (Keycloak/Auth0) — Overhead for MVP, can integrate later

---

## 10. Image Handling: Compress + Thumbnail + CDN

**Decision:** Client-side compression (max 1920px), server generates thumbnail, store on object storage (S3/MinIO), CDN delivery.

**Rationale:**
- **Bandwidth:** Rural networks — compress before upload
- **Performance:** Thumbnails for lists, full-res for detail
- **Cost:** Object storage cheaper than DB blobs
- **Privacy:** Auto-delete originals after 90 days (configurable)

**Flow:**
1. Client: Resize to max 1920px, quality 0.85, convert to WebP
2. Upload → Presigned URL → Object Storage
3. Server: Generate 300px thumbnail
4. DB: Store URLs + metadata
5. Frontend: Thumbnail in lists, full-res in detail

---

## 11. API Versioning: URL Path (/api/v1/)

**Decision:** Version in URL path, not headers.

**Rationale:**
- **Visibility:** Easy to see version in logs, browser, docs
- **Simplicity:** No custom header parsing
- **CDN Friendly:** Cacheable per version
- **Deprecation:** Clear migration path to /v2/

---

## 12. Error Handling: Standardized Envelope

**Decision:** All responses use `{ success, data, error, meta }` envelope.

**Rationale:**
- **Consistency:** Frontend handles all responses uniformly
- **Type Safety:** Discriminated union in TS (when adopted)
- **Debugging:** Error codes machine-readable
- **Pagination:** Meta carries pagination info

---

## 13. Configuration: Environment Variables + .env Files

**Decision:** 12-factor config via environment variables; `.env.local` for dev, secrets in vault for prod.

**Rationale:**
- **Portability:** Works across local, CI, staging, prod
- **Security:** No secrets in code
- **Validation:** Pydantic Settings / Zod schemas validate at startup

---

## 14. Testing Strategy: Pyramid

**Decision:** Unit (70%) → Integration (20%) → E2E (10%).

**Tools:**
- Backend: pytest + httpx (unit/integration)
- Frontend: Vitest (unit), Playwright (E2E)
- ML: pytest for data pipeline, separate eval scripts

**CI:** Run on every PR; block merge on failure.

---

## 15. Monorepo vs Polyrepo

**Decision:** Monorepo (this repo) with `/frontend`, `/backend`, `/ml`, `/docs`.

**Rationale:**
- **Atomic Commits:** Cross-cutting changes (API contract) in one PR
- **Shared Config:** ESLint, Prettier, Husky, CI/CD
- **Simpler Dev Setup:** One clone, one `npm install` (frontend), one `pip install` (backend/ml)
- **Code Sharing:** TypeScript types (future), constants, utilities

**Alternatives Considered:**
- Separate repos — Harder to coordinate API changes, duplicate tooling

---

## 16. CI/CD: GitHub Actions

**Decision:** GitHub Actions for lint, test, build, deploy.

**Pipelines:**
- `frontend`: lint → typecheck (future) → test → build → deploy preview
- `backend`: lint → test → build docker → deploy staging
- `ml`: lint → test → eval → package model → register
- `docs`: markdown lint → link check

**Deployment Targets (Future):**
- Frontend: Vercel / Netlify / Cloudflare Pages
- Backend: Cloud Run / Fly.io / Kubernetes
- ML: Same as backend or dedicated inference endpoint

---

## 17. Monitoring & Observability (Planned)

**Decision:** Structured logging (JSON), OpenTelemetry traces, Prometheus metrics, Grafana dashboards.

**Key Metrics:**
- API: Latency, error rate, throughput by endpoint
- ML: Inference latency, prediction distribution, confidence calibration
- Business: Detection→Verification time, verification agreement rate, case closure rate
- System: CPU, memory, disk, DB connections, queue depth

---

## 18. Accessibility: WCAG 2.1 AA Target

**Decision:** Build to AA standard from start.

**Non-Negotiables:**
- Semantic HTML
- Color contrast ≥ 4.5:1
- Keyboard navigation
- Focus indicators
- Alt text for images
- Form labels
- Reduced motion support

**Rationale:** Government project; farmers include elderly, low-vision users; legal requirement.

---

## 19. Internationalization (i18n) Ready

**Decision:** English-only for MVP; all strings externalized, RTL-ready layout.

**Implementation:**
- `i18next` or `react-i18next` added in post-MVP
- All user-facing strings in `src/locales/en.json`
- Date/number formatting via `Intl` API
- Font stack supports Devanagari (Hindi) and Latin

---

## 20. License & Open Source

**Decision:** MIT License for code; data/models under separate license (CC-BY-4.0 for datasets, custom for models).

**Rationale:**
- **Maximize Adoption:** Government, NGOs, researchers can use freely
- **Community:** Encourage contributions
- **Transparency:** Public algorithm, auditable
- **SIH Alignment:** Open innovation spirit

---

## Decision Log Format (For Future Decisions)

| Date | Decision | Context | Alternatives | Decision Maker | Status |
|------|----------|---------|--------------|----------------|--------|
| YYYY-MM-DD | Short title | Why needed | What else considered | Who decided | Active/Superseded |

*Add new decisions to this table as project evolves.*