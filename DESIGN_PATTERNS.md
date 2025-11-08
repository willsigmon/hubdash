# HubDash Design Patterns Reference

**Version:** 1.0.0  
**Last Updated:** November 8, 2025  
**Purpose:** Quick reference for designers and developers implementing HTI-branded components

---

## 🎨 Color Palette Quick Reference

### Primary Colors
```css
/* Dark Foundations */
--hti-midnight: #0F0C11;  /* Deep anchor, darkest backgrounds */
--hti-plum: #2F2D4C;      /* Primary brand, headings, navigation */
--hti-fig: #433D58;       /* Secondary depth, cards, borders */
--hti-dusk: #4D4965;      /* Muted accents */

/* Warm Accents */
--hti-ember: #C05F37;     /* Primary CTA, warm accent, alerts */
--hti-sunset: #C65B32;    /* Secondary warm accent */
--hti-gold: #E2A835;      /* Signature gold, highlights */
--hti-soleil: #EACF3A;    /* Bright highlights (dark bg only) */

/* Neutrals */
--hti-clay: #B4ABA3;      /* Neutral midtone */
--hti-sand: #EEE6DF;      /* Soft background neutral */
--hti-mist: #757A87;      /* Muted typography support */
--hti-stone: #615E5C;     /* Dark neutral, body text */
```

### Usage Guidelines

#### Text Colors
```tsx
/* Headings */
className="text-hti-plum"        // Primary headings
className="text-hti-midnight"    // Dark theme headings

/* Body Text */
className="text-hti-stone"       // Primary body text
className="text-hti-mist"        // Secondary/muted text

/* Accent Text */
className="text-hti-ember"       // Important text, CTAs
className="text-hti-gold"        // Highlights (on dark only)
className="text-hti-soleil"      // Bright accents (on dark only)
```

#### Background Colors
```tsx
/* Light Backgrounds */
className="bg-white"             // Pure white cards
className="bg-hti-sand"          // Warm tinted backgrounds
className="bg-hti-sand/40"       // Page backgrounds

/* Dark Backgrounds */
className="bg-hti-midnight"      // Deep dark
className="bg-hti-plum"          // Brand dark
className="bg-hti-fig"           // Mid-tone dark

/* Accent Backgrounds */
className="bg-hti-ember/10"      // Subtle warm tint
className="bg-hti-gold/20"       // Gold highlight
```

#### Border Colors
```tsx
/* Standard Borders */
className="border-hti-fig/10"    // Subtle dividers
className="border-hti-fig/30"    // Medium borders
className="border-hti-ember/25"  // Accent borders

/* Status Borders */
className="border-hti-ember"     // Alert borders
className="border-hti-gold"      // Highlight borders
```

---

## 📐 Spacing System

### Padding Scale
```tsx
p-3  = 12px   // Compact elements
p-4  = 16px   // Small components
p-5  = 20px   // Medium padding
p-6  = 24px   // Standard cards
p-8  = 32px   // Large cards
p-10 = 40px   // Hero sections
p-12 = 48px   // Extra large sections
```

### Gap Scale (Grids & Flex)
```tsx
gap-2  = 8px    // Tight spacing
gap-4  = 16px   // Small gaps
gap-6  = 24px   // Medium gaps
gap-8  = 32px   // Large gaps
gap-10 = 40px   // Extra large gaps
```

### Margin Scale (Sections)
```tsx
mb-6  = 24px    // Subsection spacing
mb-10 = 40px    // Section headers
mb-12 = 48px    // Medium sections
mb-16 = 64px    // Large sections
mb-20 = 80px    // Major sections
mb-24 = 96px    // Extra large sections
```

---

## 🔲 Border Radius System

```tsx
rounded-sm   = 2px     // Subtle rounding
rounded-md   = 6px     // Small elements
rounded-lg   = 8px     // Buttons, badges
rounded-xl   = 12px    // Standard cards
rounded-2xl  = 16px    // Featured cards
rounded-3xl  = 24px    // Hero sections
rounded-full = 9999px  // Badges, avatars, pills
```

### Pattern Usage
```tsx
/* Buttons */
className="rounded-lg"        // Primary/Secondary buttons

/* Cards */
className="rounded-xl"        // Standard cards
className="rounded-2xl"       // Featured/hero cards

/* Badges */
className="rounded-full"      // Status badges, pills

/* Inputs */
className="rounded-xl"        // All form inputs (0.75rem)
```

---

## 🎴 Card Patterns

### 1. Standard Light Card
```tsx
<div className="rounded-xl bg-white shadow-lg hover:shadow-2xl 
                transition-all duration-300 hover:-translate-y-1 
                border border-hti-fig/10">
  <div className="h-2 bg-gradient-to-r from-hti-plum to-hti-fig" />
  <div className="p-6 space-y-4">
    {/* Content */}
  </div>
  <div className="h-1 bg-gradient-to-r from-hti-plum to-hti-fig" />
</div>
```

**Use for:** Impact metrics, board dashboard cards, general purpose

### 2. Featured Hero Card
```tsx
<div className="rounded-2xl bg-white shadow-2xl hover:shadow-3xl 
                transition-all duration-300 border border-hti-ember/25">
  <div className="h-3 bg-gradient-to-r from-hti-ember to-hti-gold" />
  <div className="relative p-8 md:p-10">
    <div className="absolute inset-0 bg-gradient-to-br from-hti-ember to-hti-gold 
                    opacity-5 group-hover:opacity-10 transition-opacity" />
    {/* Content */}
  </div>
  <div className="h-1 bg-gradient-to-r from-hti-ember to-hti-gold" />
</div>
```

**Use for:** Primary metrics, featured content, grant progress

### 3. Dark Theme Glass Card (Operations)
```tsx
<div className="rounded-xl bg-white/5 backdrop-blur-sm 
                border border-hti-yellow/50 shadow-xl 
                hover:border-hti-red/70 hover:scale-105 
                transition-all duration-300">
  <div className="relative p-5 md:p-6">
    <div className="absolute inset-0 bg-gradient-to-br from-hti-yellow to-hti-yellow-bright 
                    opacity-5 group-hover:opacity-15 transition-opacity" />
    {/* Content */}
  </div>
  <div className="h-2 bg-gradient-to-r from-hti-yellow to-hti-yellow-bright" />
</div>
```

**Use for:** Operations dashboard, dark theme components

### 4. Minimal Report Card
```tsx
<div className="rounded-xl bg-white border border-hti-fig/20 p-6 
                hover:shadow-lg transition-shadow">
  {/* Content */}
</div>
```

**Use for:** Reports dashboard, document-style layouts

---

## 🔘 Button Patterns

### Primary CTA Button
```tsx
<button className="px-6 py-3 
                   bg-gradient-to-r from-hti-ember to-hti-gold 
                   text-white font-semibold rounded-lg 
                   shadow-lg hover:shadow-xl 
                   hover:-translate-y-0.5 
                   transition-all duration-200">
  Generate Report
</button>
```

**Use for:** Primary actions, form submissions, main CTAs

### Secondary Button
```tsx
<button className="px-6 py-3 
                   border border-hti-fig/35 
                   text-hti-plum font-semibold rounded-lg 
                   hover:bg-hti-sand 
                   transition-all duration-200">
  Preview Report
</button>
```

**Use for:** Secondary actions, cancel buttons

### Destructive Button
```tsx
<button className="px-4 py-2 
                   bg-hti-ember text-white font-semibold rounded-lg 
                   hover:bg-hti-sunset 
                   transition-colors duration-200">
  Delete
</button>
```

**Use for:** Delete actions, dangerous operations

### Link-style Button
```tsx
<button className="text-hti-ember font-semibold 
                   hover:text-hti-sunset 
                   hover:underline 
                   transition-colors">
  Learn More →
</button>
```

**Use for:** Inline links, view more actions

---

## 🏷️ Badge Patterns

### Status Badge - Success
```tsx
<span className="px-3 py-1 
                rounded-full text-xs font-bold
                bg-green-500/20 text-green-400 
                border border-green-500/30">
  Ready to Ship
</span>
```

### Status Badge - Warning
```tsx
<span className="px-3 py-1 
                rounded-full text-xs font-bold
                bg-hti-yellow/30 text-hti-yellow 
                border border-hti-yellow/60">
  Pending
</span>
```

### Status Badge - Error/Urgent
```tsx
<span className="px-3 py-1 
                rounded-full text-xs font-bold
                bg-hti-red/30 text-hti-red 
                border border-hti-red/60">
  Urgent
</span>
```

### Info Badge
```tsx
<span className="px-3 py-1 
                rounded-full text-xs font-bold
                bg-hti-plum/20 text-hti-plum 
                border border-hti-plum/30">
  Live Data
</span>
```

### Gradient Badge (Premium)
```tsx
<span className="px-4 py-2 
                rounded-full text-sm font-bold
                bg-gradient-to-br from-hti-ember to-hti-gold 
                text-white shadow-lg">
  80% Complete
</span>
```

---

## 📊 Metric Card Patterns

### Standard Metric Card
```tsx
<div className="rounded-xl bg-white shadow-lg 
                hover:shadow-2xl hover:-translate-y-1 
                transition-all duration-300 
                border border-hti-fig/10">
  {/* Top accent */}
  <div className="h-2 bg-gradient-to-r from-hti-plum to-hti-fig" />
  
  <div className="relative p-6 space-y-4">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-hti-plum to-hti-fig 
                    opacity-3 group-hover:opacity-8 transition-opacity" />
    
    {/* Header with icon and badge */}
    <div className="flex items-start justify-between">
      <div className="text-5xl">💻</div>
      <span className="px-2 py-1 rounded-full 
                     bg-gradient-to-br from-hti-plum to-hti-fig 
                     text-white text-xs font-bold shadow-sm">
        Live
      </span>
    </div>
    
    {/* Value */}
    <div>
      <div className="text-4xl font-bold text-hti-plum">
        3,500<span className="text-2xl font-bold text-hti-ember ml-1">+</span>
      </div>
      <h4 className="text-sm font-bold text-hti-plum">
        Total Laptops
      </h4>
    </div>
    
    {/* Description */}
    <div className="text-xs text-hti-stone leading-relaxed font-medium">
      Overall collection since inception
    </div>
  </div>
  
  {/* Bottom accent */}
  <div className="h-1 bg-gradient-to-r from-hti-plum to-hti-fig" />
</div>
```

### Operations Stat Card
```tsx
<div className="rounded-xl bg-white/5 backdrop-blur-sm 
                border border-hti-yellow/50 shadow-xl 
                hover:border-hti-red/70 hover:scale-105 
                transition-all duration-300 group">
  <div className="absolute inset-0 bg-gradient-to-br from-hti-yellow to-hti-yellow-bright 
                  opacity-5 group-hover:opacity-15 transition-opacity" />
  
  <div className="relative p-5 md:p-6">
    {/* Header with icon and trend */}
    <div className="flex items-start justify-between mb-4">
      <div className="text-3xl md:text-4xl group-hover:scale-110 
                      transition-transform origin-left">
        🔄
      </div>
      <div className="flex items-center gap-1 text-hti-yellow text-xs font-bold 
                      bg-hti-yellow/30 px-2 py-1 rounded-full border border-hti-yellow/60">
        ↑ Up
      </div>
    </div>
    
    {/* Main value */}
    <div className="mb-3">
      <div className="text-3xl md:text-4xl font-bold text-white 
                      group-hover:text-hti-yellow transition-colors">
        125
      </div>
      <div className="text-xs md:text-sm font-bold text-hti-yellow">
        In Pipeline
      </div>
    </div>
    
    {/* Change indicator */}
    <div className="text-xs text-hti-yellow bg-hti-yellow/20 
                    rounded px-3 py-1.5 inline-block font-bold 
                    border border-hti-yellow/60">
      +12 today
    </div>
  </div>
  
  {/* Bottom accent */}
  <div className="h-2 bg-gradient-to-r from-hti-yellow to-hti-yellow-bright" />
</div>
```

---

## 📝 Form Element Patterns

### Text Input
```tsx
<input
  type="text"
  className="w-full px-4 py-3 
             rounded-xl border border-hti-fig/18 
             focus:border-hti-ember focus:ring-4 focus:ring-hti-gold/25 
             transition-all duration-200
             text-hti-stone placeholder:text-hti-mist"
  placeholder="Enter device serial number"
/>
```

### Select Dropdown
```tsx
<select className="w-full px-4 py-3 
                   rounded-xl border border-hti-fig/18 
                   focus:border-hti-ember focus:ring-4 focus:ring-hti-gold/25 
                   transition-all duration-200
                   text-hti-stone bg-white">
  <option>Select period</option>
  <option>Q1 2025</option>
  <option>Q2 2025</option>
</select>
```

### Search Input
```tsx
<div className="relative">
  <input
    type="search"
    className="w-full pl-12 pr-4 py-3 
               rounded-xl border border-hti-fig/18 
               focus:border-hti-ember focus:ring-4 focus:ring-hti-gold/25 
               transition-all duration-200"
    placeholder="Search devices..."
  />
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hti-mist">
    {/* Search icon */}
  </svg>
</div>
```

---

## 🎭 Animation Patterns

### Hover Lift (Cards)
```tsx
className="hover:-translate-y-1 transition-transform duration-300"
```

### Hover Scale (Buttons, Cards)
```tsx
className="hover:scale-105 transition-transform duration-300"
```

### Shadow Progression
```tsx
className="shadow-lg hover:shadow-2xl transition-shadow duration-300"
```

### Fade In
```tsx
className="opacity-0 animate-fade-in"

// In tailwind.config.ts
animation: {
  'fade-in': 'fadeIn 0.5s ease-in forwards'
}
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  }
}
```

### Slide Up
```tsx
className="opacity-0 animate-slide-up"

// In tailwind.config.ts
animation: {
  'slide-up': 'slideUp 0.5s ease-out forwards'
}
keyframes: {
  slideUp: {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' }
  }
}
```

### Counter Animation (JavaScript)
```typescript
useEffect(() => {
  const duration = 2000; // 2 seconds
  const steps = 60;
  const interval = duration / steps;
  const increment = targetValue / steps;
  
  let currentStep = 0;
  const timer = setInterval(() => {
    currentStep++;
    setDisplayValue(Math.min(
      Math.floor(increment * currentStep),
      targetValue
    ));
    
    if (currentStep >= steps) {
      clearInterval(timer);
    }
  }, interval);
  
  return () => clearInterval(timer);
}, [targetValue]);
```

---

## 🎯 Progress Bar Patterns

### Standard Progress Bar
```tsx
<div className="w-full h-4 bg-hti-sand/80 rounded-full overflow-hidden 
                shadow-inner border border-hti-gold/30">
  <div 
    className="h-full bg-gradient-to-r from-hti-ember to-hti-gold 
               rounded-full transition-all duration-500 ease-out shadow-md"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Thin Progress Bar
```tsx
<div className="w-full h-2 bg-hti-sand rounded-full overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-hti-ember to-hti-gold 
               transition-all duration-500"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Progress with Labels
```tsx
<div className="space-y-3">
  <div className="flex justify-between items-center">
    <span className="text-sm font-bold text-hti-plum">Grant Progress</span>
    <span className="text-sm font-bold text-hti-ember">{progress}%</span>
  </div>
  
  <div className="w-full h-4 bg-hti-sand/80 rounded-full overflow-hidden 
                  shadow-inner border border-hti-gold/30">
    <div 
      className="h-full bg-gradient-to-r from-hti-ember to-hti-gold 
                 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>
  
  <div className="flex justify-between text-xs text-hti-plum font-bold">
    <span>0%</span>
    <span>25%</span>
    <span>50%</span>
    <span>75%</span>
    <span>100%</span>
  </div>
</div>
```

---

## 📱 Responsive Patterns

### Mobile-First Grid
```tsx
/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
```

### Responsive Text
```tsx
/* Heading sizes */
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">

/* Body text */
<p className="text-sm md:text-base lg:text-lg">
```

### Responsive Padding
```tsx
<div className="p-4 md:p-6 lg:p-8">
<div className="px-4 sm:px-6 lg:px-8">
```

### Responsive Spacing
```tsx
<div className="space-y-4 md:space-y-6 lg:space-y-8">
<div className="gap-4 md:gap-6 lg:gap-8">
```

### Hide/Show on Mobile
```tsx
/* Hidden on mobile, visible on tablet+ */
<div className="hidden md:block">

/* Visible on mobile, hidden on tablet+ */
<div className="md:hidden">
```

---

## 🎨 Gradient Patterns

### Primary Brand Gradient
```tsx
className="bg-gradient-to-r from-hti-plum via-hti-fig to-hti-midnight"
```

### Warm Accent Gradient
```tsx
className="bg-gradient-to-r from-hti-ember to-hti-gold"
```

### Sunset Gradient
```tsx
className="bg-gradient-to-r from-hti-sunset to-hti-ember"
```

### Operations Theme Gradient
```tsx
className="bg-gradient-to-r from-hti-yellow to-hti-yellow-bright"
```

### Diagonal Gradients (Backgrounds)
```tsx
className="bg-gradient-to-br from-hti-midnight via-hti-plum to-hti-midnight"
className="bg-gradient-to-br from-hti-ember to-hti-gold"
```

### Subtle Background Gradients (Overlays)
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-hti-ember to-hti-gold 
                opacity-5 group-hover:opacity-10 transition-opacity" />
```

---

## 🔍 Loading State Patterns

### Skeleton Cards
```tsx
<div className="rounded-xl bg-gray-200 animate-pulse h-44" />

<div className="h-64 rounded-2xl bg-gradient-to-br 
                from-gray-200 to-gray-100 animate-pulse" />
```

### Skeleton Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {[...Array(6)].map((_, i) => (
    <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-44" />
  ))}
</div>
```

### Loading Spinner
```tsx
<div className="flex items-center justify-center p-12">
  <div className="w-12 h-12 border-4 border-hti-plum border-t-transparent 
                  rounded-full animate-spin" />
</div>
```

---

## ✅ Best Practices Checklist

### For Every Component

- [ ] Uses HTI brand colors (plum, ember, gold, etc.)
- [ ] Includes hover states with smooth transitions
- [ ] Has appropriate focus styles for keyboard navigation
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states match component shape
- [ ] Minimum 44px × 44px touch targets on mobile
- [ ] Text contrast meets AA or AAA standards
- [ ] Uses semantic HTML elements
- [ ] Includes ARIA labels where needed
- [ ] Smooth animations (300ms duration typical)

### For Cards

- [ ] Gradient accent bar (top or bottom)
- [ ] Appropriate shadow (lg, xl, 2xl)
- [ ] Hover lift or scale effect
- [ ] Rounded corners (xl or 2xl)
- [ ] Consistent padding (p-6 or p-8)
- [ ] Background gradient overlay on hover

### For Buttons

- [ ] Clear visual hierarchy (primary vs secondary)
- [ ] Gradient background for CTAs
- [ ] Hover states (shadow, lift, or color change)
- [ ] Proper padding (px-4 to px-6, py-2 to py-3)
- [ ] Font weight 600 or 700
- [ ] Rounded-lg corners

---

## 📚 Additional Resources

- **Tailwind CSS Docs:** https://tailwindcss.com
- **HTI Brand Guidelines:** See CLAUDE.md
- **Component Examples:** See COMPONENT_REVIEW.md
- **Accessibility Guide:** WCAG 2.1 AA standards
- **Design Audit:** See DESIGN_AUDIT.md

---

**Version:** 1.0.0  
**Maintained by:** HubDash Development Team  
**Last Updated:** November 8, 2025
