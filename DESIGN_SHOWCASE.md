# HubDash Visual Component Showcase

**Purpose:** Visual catalog of all UI components with screenshots and usage examples  
**Version:** 1.0.0  
**Date:** November 8, 2025

---

## 📸 Page Screenshots

### Home / Hub Selector Page
![Home Page](https://github.com/user-attachments/assets/f903194e-821d-4604-9a8c-3d190c7942d3)

**Design Highlights:**
- Gradient background: `from-hti-midnight via-hti-plum to-hti-midnight`
- Glass morphism card: `bg-white/95 backdrop-blur`
- 2×2 grid of dashboard cards with distinct color schemes
- Each card has unique gradient and hover effects
- Emoji icons for visual appeal
- Footer with branding and attribution

**Color Schemes Used:**
- **Board Dashboard:** Purple gradient (`from-hti-plum to-hti-fig`)
- **Operations:** Orange gradient (`from-hti-ember to-hti-sunset`)
- **Reports:** Gold gradient (`from-hti-gold to-hti-ember`)
- **Marketing:** Purple-orange blend (`from-hti-fig to-hti-sunset`)

---

### Board Dashboard Page
![Board Dashboard](https://github.com/user-attachments/assets/377998a2-d572-403d-aa19-0c8d599d4f8d)

**Design Highlights:**
- Header: Purple gradient banner with navigation
- **Impact Metrics Section:**
  - Featured card: Grant Laptops Presented with progress bar
  - 6 metric cards in responsive grid
  - Animated counters with smooth transitions
  - Icon + gradient accent pattern
- **Counties Served Section:**
  - Map-style visualization
  - Distribution statistics
- **Recent Activity Section:**
  - Activity feed with timestamps
  - Icon-based activity types

**Key Components:**
1. **Featured Grant Card** - Large card with progress tracking
2. **Metric Cards** - 3-column grid on desktop, stacked on mobile
3. **County Map Card** - Geographic distribution display
4. **Activity Feed** - Timeline-style updates

---

### Operations Dashboard Page
![Operations Dashboard](https://github.com/user-attachments/assets/328101bc-f7b0-4435-b6f1-537bc6fac55a)

**Design Highlights:**
- **Dark Theme:** `bg-gradient-to-br from-hti-navy via-hti-gray`
- **Header:** Red accent border, system status indicator
- **Quick Stats:** 4-column glass cards with yellow/green/red accents
- **Device Pipeline:** Visual workflow with emoji stages
- **Two-column layout:** Donation Requests + Activity Feed
- **Inventory Table:** Sortable device listing

**Dark Theme Color Palette:**
- Background: Dark navy gradient
- Cards: Glass morphism (`bg-white/5 backdrop-blur-sm`)
- Accents: Yellow borders (`border-hti-yellow/50`)
- Text: White with yellow highlights
- Hover: Red borders (`hover:border-hti-red/70`)

**Key Components:**
1. **Quick Stats Cards** - Glass morphism with trend indicators
2. **Device Pipeline** - Horizontal workflow visualization
3. **Donation Requests** - Priority-coded request cards
4. **Inventory Table** - Comprehensive device listing

---

### Reports Dashboard Page
![Reports Dashboard](https://github.com/user-attachments/assets/ce4be507-df00-46d7-9fd9-41f7a2e8ac48)

**Design Highlights:**
- Clean, document-style layout
- **Grant Progress Cards:** 3 goal tracking cards with progress bars
- **Report Configuration:** Dropdown selectors for report type/period
- **Generated Report Preview:** Full quarterly report with sections
- **Export Options:** 3 download format cards (PDF, CSV, HTML)

**Color Scheme:**
- Primary: Gold and ember gradients
- Backgrounds: White and sand tones
- Accents: Orange buttons with rounded corners
- Progress bars: Ember-to-gold gradients

**Key Components:**
1. **Goal Progress Cards** - Laptop/Training/Participant metrics
2. **Report Configuration Panel** - Dropdown selectors + action buttons
3. **Report Preview** - Formatted document with sections
4. **Export Cards** - File format download options

---

## 🎨 Component Catalog

### 1. Card Components

#### 1.1 Featured Metric Card
**Used in:** Board Dashboard (Grant Laptops Presented)

**Visual Elements:**
- 3px gradient top bar
- White background with shadow
- Large emoji icon (6xl)
- Progress bar with percentage
- Bottom gradient accent
- Hover: Shadow increase

**Colors:**
- Gradient: `from-hti-ember to-hti-gold`
- Border: `border-hti-ember/25`
- Background: `bg-white`

#### 1.2 Standard Metric Card
**Used in:** Board Dashboard (Laptops, Counties, People Trained, etc.)

**Visual Elements:**
- 2px gradient top bar
- White background
- 5xl emoji icon
- "Live" badge in top right
- Bottom gradient accent (1px)
- Hover: Lift effect (`-translate-y-1`)

**Colors:**
- Various gradients (plum-fig, sunset-ember, gold-soleil, etc.)
- Background: `bg-white`
- Shadow: `shadow-lg` → `hover:shadow-2xl`

#### 1.3 Dark Glass Card (Operations)
**Used in:** Operations Dashboard (Quick Stats)

**Visual Elements:**
- Glass morphism background (`bg-white/5 backdrop-blur-sm`)
- Glowing border (`border-hti-yellow/50`)
- Emoji icon with scale on hover
- Trend indicator badge
- Bottom gradient bar (2px)
- Hover: Border color change + scale

**Colors:**
- Background: `bg-white/5`
- Border: `border-hti-yellow/50` → `hover:border-hti-red/70`
- Text: White with yellow accents
- Gradient: `from-hti-yellow to-hti-yellow-bright`

#### 1.4 Report Document Card
**Used in:** Reports Dashboard (Report Preview)

**Visual Elements:**
- White background
- Left border accent (4px plum)
- Standard padding
- Section headers
- Table-style data presentation

**Colors:**
- Background: `bg-white`
- Border: `border-l-4 border-hti-plum`
- Text: `text-hti-plum` for headers, `text-hti-stone` for body

---

### 2. Button Components

#### 2.1 Primary Gradient Button
**Example:** "Generate Report", "Download PDF"

**Visual:**
```
┌─────────────────────────────┐
│   Generate Report   →       │ (Gradient: ember → gold)
└─────────────────────────────┘
```

**Specs:**
- Height: 48px (`py-3`)
- Padding: `px-6 py-3`
- Background: `bg-gradient-to-r from-hti-ember to-hti-gold`
- Text: White, font-semibold
- Corners: `rounded-lg`
- Hover: Shadow increase + slight lift

#### 2.2 Secondary Outline Button
**Example:** "Preview Report", "Export CSV"

**Visual:**
```
┌─────────────────────────────┐
│   Preview Report            │ (Border: fig, no fill)
└─────────────────────────────┘
```

**Specs:**
- Height: 48px
- Border: `border border-hti-fig/35`
- Text: `text-hti-plum`, font-semibold
- Hover: `bg-hti-sand`

#### 2.3 Icon Button
**Example:** Search, menu toggle

**Visual:**
```
┌────┐
│ 🔍 │
└────┘
```

**Specs:**
- Size: 40-48px square
- Background: Transparent or subtle
- Hover: Background tint
- Icon: 20-24px

---

### 3. Badge Components

#### 3.1 Status Badge - Success (Green)
**Example:** "Ready to Ship"

**Visual:**
```
┌─────────────────┐
│ ✅ Ready to Ship│ (Green glow)
└─────────────────┘
```

**Specs:**
- Background: `bg-green-500/20`
- Text: `text-green-400`, font-bold, text-xs
- Border: `border border-green-500/30`
- Shape: `rounded-full`
- Padding: `px-3 py-1`

#### 3.2 Status Badge - Warning (Yellow)
**Example:** "Pending", "In Progress"

**Visual:**
```
┌─────────────┐
│ ⏳ Pending  │ (Yellow glow)
└─────────────┘
```

**Specs:**
- Background: `bg-hti-yellow/30`
- Text: `text-hti-yellow`, font-bold
- Border: `border border-hti-yellow/60`

#### 3.3 Status Badge - Error (Red)
**Example:** "Urgent", "Failed"

**Visual:**
```
┌───────────┐
│ 🚨 Urgent │ (Red glow)
└───────────┘
```

**Specs:**
- Background: `bg-hti-red/30`
- Text: `text-hti-red`, font-bold
- Border: `border border-hti-red/60`

#### 3.4 Info Badge (Gradient)
**Example:** "80% Complete", "Live Data"

**Visual:**
```
┌─────────────────┐
│ 80% Complete    │ (Gradient badge)
└─────────────────┘
```

**Specs:**
- Background: `bg-gradient-to-br from-hti-ember to-hti-gold`
- Text: White, font-bold
- Shadow: `shadow-lg`
- Padding: `px-4 py-2`

---

### 4. Form Elements

#### 4.1 Text Input
**Visual:**
```
┌─────────────────────────────────────┐
│ Enter device serial number...       │
└─────────────────────────────────────┘
```

**Specs:**
- Border: `border border-hti-fig/18`
- Corners: `rounded-xl`
- Padding: `px-4 py-3`
- Focus: `border-hti-ember` with `ring-4 ring-hti-gold/25`

#### 4.2 Select Dropdown
**Visual:**
```
┌─────────────────────────────────────┐
│ Q2 2025 (Apr-Jun)              ▼   │
└─────────────────────────────────────┘
```

**Specs:**
- Same as text input
- Arrow icon on right

#### 4.3 Search Input
**Visual:**
```
┌─────────────────────────────────────┐
│ 🔍  Search devices...                │
└─────────────────────────────────────┘
```

**Specs:**
- Icon: Left-aligned, 20px
- Padding: `pl-12 pr-4 py-3`
- Icon color: `text-hti-mist`

---

### 5. Progress Components

#### 5.1 Standard Progress Bar
**Example:** Grant Progress

**Visual:**
```
Grant Progress                    65%
┌──────────────────────────────────┐
│████████████████████░░░░░░░░░░░░░│ (Gradient fill)
└──────────────────────────────────┘
0%    25%    50%    75%    100%
```

**Specs:**
- Height: 16px (`h-4`)
- Background: `bg-hti-sand/80`
- Fill: `bg-gradient-to-r from-hti-ember to-hti-gold`
- Border: `border border-hti-gold/30`
- Corners: `rounded-full`
- Animation: `transition-all duration-500`

#### 5.2 Thin Progress Bar
**Example:** Loading indicator

**Visual:**
```
┌──────────────────────────────────┐
│████████████░░░░░░░░░░░░░░░░░░░░░│
└──────────────────────────────────┘
```

**Specs:**
- Height: 8px (`h-2`)
- Simpler styling than standard

---

### 6. Navigation Components

#### 6.1 AppNav (Top Navigation)
**Used in:** All dashboard pages

**Visual:**
```
┌────────────────────────────────────────────────────────┐
│  HTI HubDash    [📊 Board] [⚡ Operations] [📄 Reports] [🔍]  │
└────────────────────────────────────────────────────────┘
```

**Specs:**
- Height: 64px
- Background: White with border bottom
- Logo: Left-aligned
- Nav links: Center
- Active state: Underline or background tint
- Search: Right-aligned

#### 6.2 Breadcrumbs
**Visual:**
```
Home / Board
```

**Specs:**
- Text: `text-sm text-hti-mist`
- Separator: `/`
- Active: `text-hti-plum font-semibold`

---

### 7. Data Display Components

#### 7.1 Device Pipeline (Operations)
**Visual:**
```
🚚 Donated → 🔒 Data Wipe → 🔧 Refurbishing → ... → 🎯 Distributed
     120           85             45                    1,250
```

**Specs:**
- Horizontal flow with arrows
- Stage cards with emoji + count
- Current stage highlighted (green)
- Below: 4 metric cards (Total, Completion %, Avg Time, Bottleneck)

#### 7.2 Activity Feed Item
**Visual:**
```
┌────────────────────────────────────────────┐
│ 📦  Device ABC123 moved to QA Testing      │
│     2 minutes ago                           │
└────────────────────────────────────────────┘
```

**Specs:**
- Left border: 4px colored accent
- Icon: Left-aligned
- Text: 2-line format (action + timestamp)
- Padding: `p-4`
- Border bottom: Separator

#### 7.3 County Map Card
**Visual:**
```
┌────────────────────────────────────────┐
│ 📍 15 Counties Served                  │
│                                        │
│ • Vance County          125 devices   │
│ • Warren County          87 devices   │
│ • Halifax County         92 devices   │
│ ...                                    │
└────────────────────────────────────────┘
```

**Specs:**
- White background
- List format with bullet points
- County name + device count per row

---

## 🎯 Design System Rules

### Spacing Consistency
- Card padding: `p-6` (24px) or `p-8` (32px)
- Section spacing: `mb-20` (80px) between major sections
- Grid gaps: `gap-6` (24px) for cards
- Element spacing: `space-y-4` (16px) within cards

### Color Usage Rules
1. **Headings:** Always `text-hti-plum` on light backgrounds
2. **Body Text:** Use `text-hti-stone` for primary, `text-hti-mist` for secondary
3. **Backgrounds:** White for cards, `bg-hti-sand` for page backgrounds
4. **Accents:** Use gradients (`ember → gold` for CTAs, `plum → fig` for brand)
5. **Dark Theme:** `bg-white/5` for cards, yellow/red for accents

### Shadow Hierarchy
- **Subtle:** `shadow-sm` - Minimal depth
- **Standard:** `shadow-lg` - Default cards
- **Elevated:** `shadow-xl` - Hover states
- **Hero:** `shadow-2xl` - Featured content

### Border Radius Hierarchy
- **Buttons/Badges:** `rounded-lg` (8px)
- **Cards:** `rounded-xl` (12px)
- **Featured Cards:** `rounded-2xl` (16px)
- **Pills/Badges:** `rounded-full`

### Animation Guidelines
- **Duration:** 200-300ms for most transitions
- **Easing:** Use default or ease-out
- **Hover Effects:** Combine 2-3 properties (shadow + transform + color)
- **Loading:** Pulse animation for skeletons
- **Counters:** 2-second smooth counting

---

## 📊 Component Usage Matrix

| Component | Board | Ops | Reports | Marketing |
|-----------|-------|-----|---------|-----------|
| Featured Card | ✅ | ❌ | ✅ | ❌ |
| Metric Card | ✅ | ❌ | ✅ | ❌ |
| Glass Card | ❌ | ✅ | ❌ | ❌ |
| Primary Button | ✅ | ✅ | ✅ | ✅ |
| Secondary Button | ❌ | ❌ | ✅ | ✅ |
| Status Badge | ❌ | ✅ | ❌ | ✅ |
| Gradient Badge | ✅ | ❌ | ✅ | ❌ |
| Progress Bar | ✅ | ❌ | ✅ | ❌ |
| Activity Feed | ✅ | ✅ | ❌ | ❌ |
| Device Pipeline | ❌ | ✅ | ❌ | ❌ |
| Data Table | ❌ | ✅ | ❌ | ✅ |

---

## 🔧 Component Implementation Checklist

When creating a new component:

- [ ] Choose appropriate card style (standard/featured/glass/minimal)
- [ ] Add gradient accent bar (top and/or bottom)
- [ ] Include hover state (shadow/lift/scale)
- [ ] Set proper padding (p-6 or p-8)
- [ ] Use HTI brand colors
- [ ] Add loading skeleton variant
- [ ] Ensure mobile responsiveness
- [ ] Test keyboard navigation
- [ ] Verify color contrast (AA minimum)
- [ ] Add smooth transitions (300ms)

---

## 📚 References

- **Full Design Audit:** See `DESIGN_AUDIT.md`
- **Design Patterns:** See `DESIGN_PATTERNS.md`
- **Component Review:** See `COMPONENT_REVIEW.md`
- **UX Improvements:** See `UX_IMPROVEMENTS.md`
- **Responsive Guide:** See `RESPONSIVE_DESIGN_GUIDE.md`

---

**Version:** 1.0.0  
**Last Updated:** November 8, 2025  
**Maintained by:** HubDash Design Team
