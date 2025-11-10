# Operations Dashboard Responsive Design Guide

## Quick Reference: Component Breakpoint Behavior

### Device Pipeline Component

#### Desktop (lg, 1024px+)
- 7-stage horizontal pipeline with arrow connectors
- Full stage names visible
- 4-column stats grid below
- All elements visible at once

#### Tablet (md, 768px+)
- 4-column responsive grid
- Compact stage cards
- Stats still in 4-column layout
- Horizontal scrolling not needed

#### Mobile (sm, 640px)
- 2-column grid layout (wraps to 3x rows)
- Compact icons and numbers
- Stats in 2-column layout
- Touch-friendly sizing

---

### Donation Requests Component

#### Desktop (1024px+)
- Full company names visible
- Side-by-side priority dot and company info
- Compact location display
- Medium padding (24px)

#### Tablet (640px - 1024px)
- Responsive text truncation applied
- Details properly aligned
- Device count shows "devices" label
- Better spacing for touch

#### Mobile (<640px)
- Company name and contact truncated
- Priority indicator as larger left border (hover effect)
- Device count label hidden (shows number only)
- Stacked actions (full-width buttons)
- Smaller padding (16px)

---

### Inventory Table Component

#### Desktop (1024px+)
- 6 columns visible: Serial, Device Info, Status, Assigned To, Received, Actions
- Normal padding (px-6)
- Table header sticky during scroll
- Full date display

#### Tablet (640px - 768px)
- 5 columns: Serial, Device Info, Status, Assigned To (hidden), Received, Actions
- "Assigned To" column hidden with `hidden sm:table-cell`
- Responsive padding (px-3 md:px-6)
- Smooth horizontal scroll with overflow-x-auto

#### Mobile (<640px)
- 4 columns: Serial, Device Info, Status, Actions
- "Assigned To" and "Received" columns hidden
- Tight padding (px-3)
- Compact serial numbers with break-words
- Action links in dropdown format with separator

---

### Activity Feed Component

#### Desktop (1024px+)
- Regular padding (20px)
- Full-size icons (xl)
- Normal text sizes
- Color-coded left border (4px)

#### Tablet (640px - 1024px)
- Responsive padding (p-4 md:p-5)
- Medium icons (lg)
- Scaled text (text-xs md:text-sm)
- Better spacing

#### Mobile (<640px)
- Tighter padding (16px)
- Smaller icons (lg)
- Small text (text-xs)
- Word breaking for long activity targets
- Centered empty state

---

### Quick Stats Cards

#### Desktop (1024px+)
- 4 columns in a row
- Full icon size (text-3xl)
- Full value size (text-4xl)
- Large gaps (gap-6)
- Hover scale (105%)

#### Tablet (640px - 1024px)
- 2 columns
- Icon size (text-2xl md:text-3xl)
- Value size (text-3xl md:text-4xl)
- Medium gaps (gap-4 md:gap-6)
- Smooth hover effects

#### Mobile (<640px)
- 1 column (full width)
- Smaller icons (text-2xl)
- Smaller values (text-3xl)
- Tight gaps (gap-4)
- Optimized padding (p-5 md:p-6)

---

## Responsive Utility Classes Used

### Padding Strategy
```
p-4         # Mobile: 16px
md:p-6      # Desktop: 24px
sm:p-4      # Small mobile: 16px
```

### Typography Strategy
```
text-xs        # Extra small (12px) - labels
text-sm        # Small (14px) - body text
md:text-sm     # Scale up on desktop
text-2xl       # Large (24px) - cards
md:text-3xl    # Larger (30px) on desktop
```

### Grid Strategy
```
grid-cols-1              # Mobile: 1 column
sm:grid-cols-2           # Tablet: 2 columns
md:grid-cols-3           # Medium: 3 columns
lg:grid-cols-4           # Desktop: 4 columns
```

### Visibility Strategy
```
hidden           # Hide by default
sm:table-cell    # Show on tablet+
md:table-cell    # Show on medium+
hidden md:flex   # Show only on medium+
hidden lg:grid   # Show only on desktop
lg:hidden        # Hide on desktop only
```

### Gap Strategy
```
gap-3           # Mobile: 12px
md:gap-4        # Desktop: 16px
gap-4 md:gap-6  # Mobile 16px, Desktop 24px
```

---

## Testing Checklist

### Mobile (375px - 480px)
- [ ] Text is readable (16px minimum)
- [ ] Buttons are tap-friendly (48x48px minimum)
- [ ] No horizontal scrolling except tables
- [ ] Images scale properly
- [ ] Form inputs are usable
- [ ] Touch targets have proper spacing

### Tablet (640px - 1024px)
- [ ] Layout uses 2-3 columns appropriately
- [ ] Spacing feels balanced
- [ ] Tables fit without horizontal scroll
- [ ] Buttons and inputs sized correctly
- [ ] Icons and images scale proportionally

### Desktop (1024px+)
- [ ] Full layout displays as intended
- [ ] 4-column grids work
- [ ] All columns visible in tables
- [ ] Hover effects smooth and intentional
- [ ] Spacing consistent throughout

---

## Performance Tips

1. **Mobile First**: Build for 375px, enhance for larger screens
2. **Avoid Large Images**: Use SVG or emoji for icons
3. **Optimize Lists**: Use virtual scrolling for large datasets
4. **Lazy Load**: Load images and components on demand
5. **CSS Grid**: Preferred over flexbox for multi-column layouts
6. **Media Queries**: Keep breakpoints to sm/md/lg/xl

---

## Color Contrast Requirements (WCAG AA)
- Normal text: 4.5:1 ratio minimum
- Large text: 3:1 ratio minimum
- HTI colors used:
  - hti-teal (#4a9b9f) - Interactive elements
  - hti-navy (#1e3a5f) - Primary
  - gray-400/500 - Secondary text

---

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers support the CSS Grid and Flexbox utilities used.

