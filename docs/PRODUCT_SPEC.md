# FasalAI — Product Specification

## User Roles

### 1. Farmer
**Primary Goal:** Detect crop health issues early and get actionable guidance.

**Capabilities:**
- Register/login with phone/email
- Create and manage farms (name, location, size, crop types)
- Select crop for detection
- Upload crop/plant images (camera or gallery)
- Receive AI crop health prediction with confidence score
- View risk level assessment (Low/Medium/High)
- View structured advisory (immediate actions, monitoring, expert consultation)
- Submit case for extension worker review
- View case history with status tracking
- Receive notifications for case updates

**Key Workflows:**
1. **Detection Flow:** Select farm → Select crop → Upload image → View prediction → View advisory → Save/submit case
2. **Case Tracking:** View case list → Filter by status/crop/date → View case detail → See extension worker feedback

---

### 2. Extension Worker
**Primary Goal:** Verify AI predictions and provide expert guidance to farmers.

**Capabilities:**
- Login with assigned credentials
- View dashboard with assigned/nearby cases
- Filter cases by status (Pending, Verified, Rejected), crop, date, location
- View case detail: farmer info, farm, crop, uploaded image, AI prediction, confidence, risk level, advisory
- Verify AI prediction (Confirm) or correct it (Change disease/class)
- Add field observations (text, photos)
- Add recommendations (treatment, monitoring, follow-up)
- Update case status (Under Review → Verified/Rejected → Closed)
- Communicate with farmer via in-app notes

**Key Workflows:**
1. **Case Review Flow:** Dashboard → Select case → Review AI prediction → Verify/Correct → Add observations → Add recommendations → Update status
2. **Bulk Review:** Filter pending cases → Quick verify/correct multiple cases

---

### 3. Agriculture Official
**Primary Goal:** Monitor crop health trends, identify hotspots, coordinate interventions.

**Capabilities:**
- Login with admin credentials
- View dashboard with regional overview
- Monitor cases by district/region/state
- View disease/crop statistics (counts, percentages, trends)
- View disease trends over time (weekly, monthly, seasonal)
- View geographical hotspot map (case density, disease clusters)
- Identify high-risk areas (high case volume, low confidence, spreading diseases)
- Export reports (CSV/PDF) for coordination
- View extension worker activity and verification rates

**Key Workflows:**
1. **Monitoring Flow:** Dashboard → Select region → View statistics/trends → Drill into hotspots → Export report
2. **Intervention Planning:** Identify high-risk areas → Review case details → Coordinate with extension workers

---

## MVP Features

### Farmer
- [ ] Registration/Login (JWT-based)
- [ ] Farm CRUD (Create, Read, Update, Delete)
- [ ] Crop selection from supported list
- [ ] Image upload (camera/gallery, max 10MB, JPG/PNG)
- [ ] AI prediction endpoint integration
- [ ] Prediction result display (class, confidence, risk level)
- [ ] Advisory display (structured sections)
- [ ] Case submission and history
- [ ] Basic notifications

### Extension Worker
- [ ] Login
- [ ] Dashboard with case list (pagination, filters)
- [ ] Case detail view
- [ ] Verify/Correct prediction (dropdown of valid classes)
- [ ] Field observations (rich text + photos)
- [ ] Recommendations (structured template)
- [ ] Case status management

### Agriculture Official
- [ ] Login
- [ ] Dashboard with summary cards
- [ ] Cases table with filters
- [ ] Disease statistics (charts)
- [ ] Trend charts (time series)
- [ ] Hotspot map (basic markers/clusters)
- [ ] High-risk area identification

### System
- [ ] REST API communication
- [ ] PostgreSQL persistence
- [ ] ML model inference integration
- [ ] Location services (farm geotagging)
- [ ] Weather API integration for risk context

---

## Future Features (Post-MVP)
- Offline image capture with sync
- Multi-language support (Hindi, regional languages)
- Voice-based input for low-literacy users
- Pest trap / IoT sensor integration
- Predictive risk alerts (weather + historical)
- Market linkage for treatment inputs
- Government scheme integration
- Farmer community/forum
- Advanced analytics dashboard
- Mobile app (React Native / PWA)

---

## Important Product Rules

1. **Terminology:** Always use "AI Prediction" or "AI Crop Health Assessment" — never "Diagnosis"
2. **Confidence Display:** Show as percentage with visual indicator (Low < 50%, Medium 50-75%, High > 75%)
3. **Risk Level:** Derived from confidence + disease severity + weather context
4. **Advisory Structure:** Immediate Actions | Monitoring | Expert Consultation | Input Guidance (with label compliance note)
5. **Verification Required:** Cases with confidence < 70% flagged for mandatory extension review
6. **Data Privacy:** Farmer PII encrypted; location precision configurable
7. **Image Handling:** Compress on upload; store original + thumbnail; delete after 90 days unless case active
8. **Audit Trail:** All verification/correction actions logged with timestamp and user