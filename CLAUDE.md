# CLAUDE.md - HubDash Project Guide

This file provides guidance to Claude Code when working with the HubDash codebase.

## Project Overview

HubDash is a dual-dashboard system for the **HUBZone Technology Initiative (HTI)**, a 501(c)(3) nonprofit that refurbishes donated laptops into Chromebooks and distributes them to underserved communities across North Carolina.

**Two Dashboards**:
1. **Board Dashboard** (`/board`) - Clean executive summary for board members
2. **Operations Hub** (`/ops`) - Feature-rich mission control for internal team

## Architecture

**Stack**:
- Next.js 16 (App Router) with TypeScript
- Tailwind CSS 4.1 (using `@import "tailwindcss"` syntax)
- Recharts for data visualization
- Lucide React for icons
- Deployed on Vercel

**Key Technical Decisions**:
- **ES Modules**: package.json uses `"type": "module"` - all configs use `export default`
- **Tailwind 4**: Uses new `@import` syntax instead of `@tailwind` directives
- **No @apply**: Tailwind 4 doesn't support @apply in globals.css - use utility classes directly
- **Client Components**: All interactive components use `"use client"` directive
- **No Backend Yet**: Currently using mock data - designed for easy Supabase integration later

## HTI Brand Guidelines

**Color Palette** (defined in globals.css and tailwind.config.ts):
- `hti-navy` (#1e3a5f) - Primary brand color
- `hti-teal` (#4a9b9f) - Accent/interactive
- `hti-teal-light` (#6db3b7) - Light accent
- `hti-red` (#ff6b6b) - Alerts/CTAs
- `hti-yellow` (#ffeb3b) - Highlights
- `hti-yellow-light` (#fff9c4) - Light highlights

**Design Principles**:
- Professional yet accessible
- Optimistic and empowering tone
- Impact-focused messaging
- Mobile-first responsive design
- Clean, modern aesthetic

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with HTI metadata
│   ├── page.tsx                # Hub selector (home page)
│   ├── globals.css             # Tailwind import + HTI CSS variables
│   ├── board/
│   │   └── page.tsx            # Board dashboard page
│   └── ops/
│       └── page.tsx            # Operations hub page
└── components/
    ├── board/                  # Board dashboard components
    │   ├── ImpactMetrics.tsx   # Animated metric cards
    │   ├── TrendChart.tsx      # Recharts line chart
    │   ├── CountyMap.tsx       # County list visualization
    │   └── RecentActivity.tsx  # Activity feed
    └── ops/                    # Ops dashboard components
        ├── QuickStats.tsx      # KPI cards
        ├── DevicePipeline.tsx  # Visual workflow
        ├── DonationRequests.tsx # Donation management
        ├── InventoryOverview.tsx # Device table
        └── ActivityFeed.tsx    # Live updates
```

## Development Guidelines

### When Adding Features

1. **Use HTI Brand Colors**: Always use the HTI color palette (hti-navy, hti-teal, etc.)
2. **Client Components**: Add `"use client"` to interactive components
3. **TypeScript**: Define proper interfaces for data structures
4. **Responsive**: Mobile-first design (Tailwind breakpoints: sm, md, lg, xl)
5. **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation

### Common Patterns

**Animated Metrics**:
```tsx
"use client";
import { useEffect, useState } from "react";
// Animate counter from 0 to target value over 2 seconds
```

**HTI Card Component**:
```tsx
<div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
  <div className="bg-gradient-to-br from-hti-navy to-hti-teal ...">
```

**Status Badges**:
```tsx
<span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
  Ready to Ship
</span>
```

### Build & Deploy

```bash
# Development
npm run dev          # Start dev server on :3000

# Production
npm run build        # Build for production (must pass before PR)
npm start            # Start production server

# Deployment
git push origin main # Vercel auto-deploys from main branch
```

### Tailwind 4 Syntax

**Correct** (Tailwind 4):
```css
@import "tailwindcss";

:root {
  --custom-var: #fff;
}
```

**Incorrect** (Old Tailwind 3 syntax):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-gray-200; /* @apply not supported in Tailwind 4 */
  }
}
```

## Data Models (Future Supabase Schema)

**Devices**:
```typescript
interface Device {
  id: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  status: "Donated" | "Received" | "Data Wipe" | "Refurbishing" | "QA Testing" | "Ready to Ship" | "Distributed";
  location: string;
  assignedTo: string;
  receivedDate: string;
  distributedDate?: string;
  partnerId?: string;
  techId?: string;
  notes?: string;
}
```

**Donations**:
```typescript
interface Donation {
  id: string;
  company: string;
  contact: string;
  deviceCount: number;
  location: string;
  priority: "urgent" | "high" | "normal";
  status: "pending" | "scheduled" | "in_progress" | "completed";
  requestedDate: string;
  scheduledDate?: string;
  completedDate?: string;
}
```

**Partners**:
```typescript
interface Partner {
  id: string;
  name: string;
  type: "school" | "library" | "nonprofit" | "veteran_org";
  contactEmail: string;
  address: string;
  county: string;
  devicesReceived: number;
  notes?: string;
}
```

## HTI Context

**Mission**: Remove barriers to technology access by turning donated laptops into HTI Chromebooks and providing free digital literacy training.

**Process**: You Donate → We Convert → They Receive
- Donors give retired laptops
- HTI securely wipes (NIST/DOD standards) and installs ChromeOS Flex
- Recipients get refurbished Chromebooks + digital literacy training

**Impact** (current):
- 3,500+ laptops collected
- 2,500+ Chromebooks distributed
- 15 counties served (Digital Champion Grant)
- 450+ people trained

**Target Beneficiaries**: Students, families, veterans, job seekers, nonprofits

## Modification Guidelines

### When Editing Dashboards

**Board Dashboard** (`/board`):
- Keep it **simple and clean** - board members want high-level overview
- Focus on **impact metrics** and **trends**
- Use **charts** for storytelling (growth over time)
- Minimal interactivity - mostly read-only

**Operations Hub** (`/ops`):
- **Feature-rich** - daily operational tool
- **Real-time updates** (prepare for WebSocket integration)
- **Interactive** - filters, search, bulk actions
- **Dark theme** - easier on eyes during long sessions
- **Action-oriented** - buttons for scheduling, assigning, exporting

### Adding New Components

1. Create in appropriate folder (`components/board/` or `components/ops/`)
2. Use TypeScript interfaces for props
3. Add `"use client"` if interactive
4. Use HTI color palette
5. Test on mobile (Board) or desktop (Ops)
6. Add to parent page with proper section heading

### Future Integration Points

**Supabase** (when ready):
- Replace mock data with Supabase queries
- Add authentication (board vs ops roles)
- Real-time subscriptions for activity feeds

**Additional Features to Add**:
- Interactive county map (Mapbox/Leaflet)
- PDF report generation (jsPDF, react-pdf)
- Email notifications (Resend, SendGrid)
- Certificate of Destruction generator
- Training session calendar (FullCalendar)
- Export to CSV/Excel

## Troubleshooting

**Build Errors**:
- Ensure `"type": "module"` in package.json
- Check all config files use `export default` (not `module.exports`)
- Verify globals.css uses `@import "tailwindcss"` (not `@tailwind`)

**Tailwind Classes Not Working**:
- Ensure tailwind.config.ts includes correct content paths
- Check HTI colors are defined in theme.extend.colors
- Restart dev server after config changes

**TypeScript Errors**:
- Check `React.ReactNode` (not `React.Node`) in layouts
- Ensure all components have proper type definitions

## Contact & Resources

- **HTI Website**: https://hubzonetech.org
- **HTI Skill**: `~/.claude/skills/hti_expert.md` - Complete HTI knowledge base
- **Brand Guide**: Available in HTI skill and local PDFs
- **Contact**: Will Sigmon (will@hubzonetech.org)

---

**Built for HTI with Claude Code**
**Last Updated**: November 4, 2025
