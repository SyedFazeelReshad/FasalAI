# FasalAI — UI Specification

## Design System

### Color Palette
| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Primary | #2E7D32 | #4CAF50 | Primary actions, headers, success states |
| Secondary | #1565C0 | #2196F3 | Secondary actions, links, info states |
| Warning | #F57F17 | #FFB300 | Medium risk, attention |
| Error | #C62828 | #EF5350 | High risk, errors, critical alerts |
| Success | #2E7D32 | #4CAF50 | Healthy, verified, completed |
| Background | #F5F5F5 | #121212 | Page background |
| Surface | #FFFFFF | #1E1E1E | Cards, modals, sheets |
| Text Primary | #212121 | #FFFFFF | Primary text |
| Text Secondary | #757575 | #B0B0B0 | Secondary text, hints |
| Border | #E0E0E0 | #333333 | Dividers, input borders |

### Typography
- **Font Family:** Inter (system fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Scale:**
  - H1: 32px / 40px, weight 700
  - H2: 24px / 32px, weight 600
  - H3: 20px / 28px, weight 600
  - Body Large: 16px / 24px, weight 400
  - Body: 14px / 20px, weight 400
  - Body Small: 12px / 16px, weight 400
  - Caption: 11px / 14px, weight 400

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64

### Border Radius
- Small: 4px (inputs, chips)
- Medium: 8px (cards, buttons)
- Large: 16px (modals, sheets)
- Full: 9999px (pills, avatars)

### Shadows
- Level 1: 0 1px 2px rgba(0,0,0,0.05) — cards
- Level 2: 0 4px 8px rgba(0,0,0,0.1) — elevated cards, dropdowns
- Level 3: 0 8px 24px rgba(0,0,0,0.15) — modals, sheets

### Icons
- Library: Lucide React (consistent, lightweight)
- Size scale: 16, 20, 24, 28, 32

---

## Navigation

### Farmer App
- Bottom tab bar (mobile) / Left sidebar (desktop)
  - Dashboard (Home)
  - Detect (Camera/Upload)
  - Farms
  - Cases
  - Profile/Settings

### Extension Worker App
- Left sidebar (persistent)
  - Dashboard
  - Cases (Pending, All)
  - Verified Cases
  - Profile/Settings

### Official App
- Left sidebar (persistent)
  - Dashboard
  - Cases
  - Trends
  - Hotspots
  - Risk Areas
  - Reports
  - Profile/Settings

---

## Page Architecture

### Shared Layout Components
- **AppShell:** Header (user menu, notifications), Sidebar/BottomNav, Main content area
- **PageHeader:** Title, breadcrumb, primary action
- **Card:** Surface container with consistent padding, shadow, border
- **EmptyState:** Illustration, message, primary action
- **LoadingState:** Skeleton loaders matching content structure
- **ErrorState:** Icon, message, retry action

---

## Key Pages

### Farmer Dashboard
- Welcome banner (name, quick stats)
- Quick Actions: New Detection, Add Farm, View Cases
- Recent Cases (horizontal scroll, max 5)
- Farm Summary (card grid)
- Weather widget (current + 3-day forecast for primary farm)

### Farm Management
- **Farm List:** Card grid — name, location, primary crop, size, last activity
- **Add Farm Modal:** Name, Location (map picker + manual), Size (acres/hectares), Primary Crop (dropdown), Soil Type (optional), Irrigation (optional)
- **Farm Detail:** Info, crop history, cases linked to farm

### Detection Flow
1. **Crop Selection:** Grid of supported crops (image + name), search/filter
2. **Image Upload:** Camera / Gallery / Drag-drop, preview, retake, confirm
3. **Processing:** Full-screen loader with animated steps (Uploading → Analyzing → Generating Advisory)
4. **Result Page:** See Prediction Card spec below

### Prediction Card (Result Page)
```
┌─────────────────────────────────────┐
│  Crop: Tomato          [Edit]       │
│  Farm: North Field                 │
│  Date: 2026-09-05  10:30 AM        │
├─────────────────────────────────────┤
│  [Uploaded Image]                   │
├─────────────────────────────────────┤
│  AI Prediction: Early Blight        │
│  Confidence: 87%  ████████████░░ High│
│  Risk Level: HIGH  ⚠️               │
├─────────────────────────────────────┤
│  [View Advisory]  [Submit Case]     │
│  [Retake]  [Save Draft]             │
└─────────────────────────────────────┘
```

### Advisory Card
```
┌─────────────────────────────────────┐
│  Advisory for Early Blight (Tomato) │
├─────────────────────────────────────┤
│  🔴 IMMEDIATE ACTIONS               │
│  • Remove infected leaves           │
│  • Apply copper-based fungicide     │
│  • Avoid overhead irrigation        │
├─────────────────────────────────────┤
│  🟡 MONITORING                      │
│  • Check daily for spread           │
│  • Monitor humidity levels          │
├─────────────────────────────────────┤
│  🟢 EXPERT CONSULTATION             │
│  • Contact extension worker         │
│  • Share this case for verification │
├─────────────────────────────────────┤
│  📋 INPUT GUIDANCE                  │
│  • Use only label-approved products │
│  • Follow local agricultural dept.  │
└─────────────────────────────────────┘
```

### Case List (Farmer)
- Table (desktop) / Cards (mobile)
- Columns: Date, Crop, Farm, Prediction, Confidence, Risk, Status, Actions
- Filters: Date range, Crop, Status, Farm
- Pagination: 10 per page

### Case Detail (Farmer)
- Case header: ID, Date, Status badge
- Farm + Crop info
- Uploaded image
- AI Prediction + Confidence + Risk
- Advisory (collapsible)
- Extension Worker Feedback (if verified)
- Timeline: Submitted → Under Review → Verified/Rejected → Closed

---

### Extension Worker Dashboard
- Stats cards: Pending, In Review, Verified Today, This Week
- Case table with filters: Status, Crop, Date, Distance, Confidence
- Quick actions: Verify, View, Assign

### Extension Case Detail
- Split view: Left (image + AI prediction), Right (verification form)
- Verification form:
  - Agreement: Confirm / Correct (dropdown with search)
  - Field Observations (rich text editor)
  - Recommendations (structured: Treatment, Dosage, Timing, Follow-up)
  - Status update dropdown
  - Submit button

---

### Official Dashboard
- KPI cards: Total Cases, Active Diseases, High-Risk Areas, Verification Rate
- Disease distribution chart (donut)
- Trend chart (line, last 30 days)
- Mini hotspot map
- Quick links to full views

### Trends Page
- Time series chart (cases over time)
- Multi-select: Diseases, Crops, Regions
- Granularity: Daily, Weekly, Monthly
- Export button

### Hotspots Page
- Full-screen map (Leaflet/Mapbox)
- Cluster markers by case density
- Color coding: Disease type / Risk level
- Filters: Date range, Disease, Crop, Confidence threshold
- Click cluster → list cases → click case → detail modal

### Risk Areas Page
- Table: Region, Case Count, Dominant Disease, Avg Confidence, Trend (↑↓), Risk Score
- Sortable, filterable
- Drill-down to district level

---

## Reusable Components

| Component | Variants | States |
|-----------|----------|--------|
| Button | Primary, Secondary, Outline, Ghost, Danger | Default, Hover, Active, Disabled, Loading |
| Input | Text, Textarea, Select, File, Date | Default, Focus, Error, Disabled, Filled |
| Card | Default, Elevated, Outlined | Default, Hover, Selected |
| Badge | Default, Success, Warning, Error, Info | — |
| Avatar | Image, Initials, Icon | — |
| Chip | Filter, Input, Choice | Default, Selected, Disabled |
| Modal | Small, Medium, Large, Fullscreen | Open, Closing, Closed |
| Toast | Success, Error, Warning, Info | Enter, Exit |
| Table | Default, Striped, Bordered | Hover, Selected, Loading |
| Pagination | Numbers, Simple | Active, Disabled |
| Select | Single, Multi, Searchable | Open, Closed |
| DatePicker | Single, Range | — |
| MapPicker | Point, Polygon | — |
| ImageCropper | Aspect ratios | — |

---

## Responsive Behavior

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Bottom nav, stacked cards, full-screen modals, card-based lists |
| Tablet | 640–1024px | Collapsible sidebar, 2-col grids, side sheets |
| Desktop | > 1024px | Persistent sidebar, 3-4 col grids, modals, tables |

- Touch targets minimum 44×44px
- Font sizes scale appropriately
- Images max-width 100%

---

## Accessibility (WCAG 2.1 AA)

- Semantic HTML (header, main, nav, section, article, aside, footer)
- Heading hierarchy (h1 → h2 → h3)
- Color contrast ≥ 4.5:1 (text), ≥ 3:1 (UI components)
- Focus indicators visible (2px outline, offset 2px)
- Keyboard navigation: Tab order logical, skip links, focus trapping in modals
- ARIA labels for icon-only buttons, dynamic content
- Alt text for all informative images
- Form labels associated with inputs
- Error messages announced (aria-live)
- Reduced motion respected (prefers-reduced-motion)
- Language attribute on html tag

---

## State Management Patterns

- **Server State:** React Query (TanStack Query) for caching, background sync
- **Client State:** React Context + useReducer for auth, UI state
- **Form State:** React Hook Form with Zod validation
- **Optimistic Updates:** For case status changes, farm updates