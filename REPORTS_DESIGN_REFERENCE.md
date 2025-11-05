# Reports Page Design Reference

## Page Structure

```
HEADER (HTI Branded Gradient)
├─ Dashboard Title with icon
├─ Subtitle: NCDIT Digital Champion Grant tracking
└─ Back to Hub button

HERO SECTION: Grant Progress (NEW & PROMINENT)
├─ 2024-2026 Grant Progress Header
├─ Three Progress Cards (3-column grid):
│  ├─ Laptops Card (Blue gradient)
│  │  └─ 832 / 1,500 | 55% Complete
│  ├─ Training Hours Card (Green gradient)
│  │  └─ 125 / 250 | 50% Complete
│  └─ Participants Card (Purple gradient)
│     └─ 450 / 600 | 75% Complete
└─ Summary Stats Grid (4-column)
   ├─ 15 Counties Served
   ├─ 3,500+ Total Devices
   ├─ 35+ Community Partners
   └─ 2024-26 Grant Cycle

REPORT CONFIGURATION
├─ Form Heading with gear icon
├─ Report Type Dropdown
├─ Reporting Period Dropdown
└─ Action Buttons (Generate | Preview | Export CSV)

REPORT PREVIEW
├─ Professional Report Title
├─ Generation Metadata
├─ Executive Summary with real data
├─ Key Metrics Grid (3-column)
├─ Device Acquisition Section
├─ Digital Literacy Training Section
├─ Compliance & Audit Statement
└─ Footer with HTI branding

EXPORT OPTIONS (3-column)
├─ PDF Report Card
├─ Excel/CSV Data Card
└─ HTML Report Card
```

## Color Scheme

### Primary Colors (HTI Brand)
- **HTI Navy**: #1e3a5f (headings, primary text)
- **HTI Teal**: #4a9b9f (accents, borders)
- **HTI Teal Light**: #6db3b7 (lighter accents)

### Progress Card Colors
- **Laptops (Blue)**: bg-blue-50/100, border-blue-200
- **Training (Green)**: bg-green-50/100, border-green-200
- **Participants (Purple)**: bg-purple-50/100, border-purple-200

### Section Borders
- Grant Progress Section: border-t-4 border-hti-navy
- Report Config Section: border-t-4 border-hti-teal
- Report Preview Section: border-t-4 border-hti-navy

## Typography Hierarchy

### Headings
```
Page Title:       text-3xl md:text-4xl font-bold tracking-tight
Section Title:    text-2xl font-bold
Subsection Title: text-xl font-bold
Card Title:       text-lg font-bold
Label:            text-sm font-semibold
```

### Metrics Display
```
Large Numbers:    text-4xl font-bold text-hti-navy
Medium Numbers:   text-3xl font-bold text-hti-navy
Small Numbers:    text-2xl font-bold text-hti-navy
Meta Text:        text-xs uppercase tracking-wide
```

## Interactive Elements

### Progress Cards
- Hover effect: shadow-lg transition-shadow
- Emoji icons: text-3xl
- Progress bar: animated gradient fill
- Status badge: small pill with background color

### Buttons
- Primary: btn-primary class (gradient bg, white text)
- Secondary: btn-secondary class (border, navy text)
- Tertiary: gray-100 bg with gray-400 border
- Responsive: flex-1 on mobile, flex-none on desktop

### Form Inputs
- Border: border-2 (not border-1)
- Focus: focus:ring-2 focus:ring-hti-navy focus:border-hti-navy
- Text: font-medium text-gray-800
- Padding: px-4 py-3

## Spacing & Layout

### Page Margins
- Container max-w: max-w-7xl
- Padding: px-4 sm:px-6 lg:px-8
- Vertical: py-8 for main content
- Section spacing: space-y-8

### Section Cards
- Border radius: rounded-xl (not lg)
- Padding: p-6 to p-10
- Shadow: shadow-md to shadow-lg
- Background: white with gradient headers where needed

### Grid Layouts
- 3-column: grid-cols-1 md:grid-cols-3
- 2-column: grid-cols-1 md:grid-cols-2
- 4-column stats: grid-cols-2 md:grid-cols-4
- Gap: gap-4 to gap-6

## Data Constants

```typescript
const GRANT_DATA = {
  laptopsConverted: 832,      // Current
  laptopsGoal: 1500,          // 2026 Target
  trainingHours: 125,         // Current
  trainingHoursGoal: 250,     // 2026 Target
  participants: 450,          // Current
  participantsGoal: 600,      // 2026 Target
};

// Auto-calculated percentages
55% - Laptops (832/1500)
50% - Training (125/250)
75% - Participants (450/600)
```

## Responsive Breakpoints

### Mobile (default)
- Single column layouts
- Stacked buttons (flex-col)
- Full-width form inputs
- Emoji icons in section titles

### Tablet (md: breakpoint)
- 2-3 column grids
- Horizontal button layout
- Side-by-side form fields
- Maintained proportions

### Desktop
- Full-width optimal layouts
- 3-4 column grids
- Horizontal forms
- Maximum readability

## Accessibility Features

- Semantic HTML structure (h1, h2, h3)
- Proper label associations for form fields
- Color not the only indicator (text + color for status)
- Readable font sizes and line heights
- Clear focus indicators on interactive elements
- Alt text context through aria-labels where needed

## Performance Optimizations

- No external image dependencies
- Uses CSS gradients (not images)
- Emoji as text (no image assets)
- Lightweight Tailwind utility classes
- Static data constants (no API calls needed yet)
- Client-side only (no complex server logic)

