# 🎯 HubDash - HTI Dashboard System

**Dual dashboard system for the HUBZone Technology Initiative**

Securely Repurposing Technology. Expanding Digital Opportunity.

---

## 📊 Overview

HubDash provides two specialized dashboards for HTI's operations:

1. **Board Dashboard** (`/board`) - Executive summary for board members
   - Impact metrics with animated counters
   - Growth trends and charts
   - County distribution map
   - Recent activity feed

2. **Operations Hub** (`/ops`) - Mission control for internal team
   - Real-time device pipeline visualization
   - Donation request management
   - Comprehensive inventory system
   - Live activity feed
   - Advanced filtering and search

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.18+ or 20.0+
- npm 9+ or yarn 1.22+

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard hub.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 📁 Project Structure

```
hubdash/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Dashboard hub (home)
│   │   ├── globals.css          # Global styles (HTI brand colors)
│   │   ├── board/
│   │   │   └── page.tsx         # Board dashboard
│   │   └── ops/
│   │       └── page.tsx         # Operations hub
│   └── components/
│       ├── board/
│       │   ├── ImpactMetrics.tsx       # Animated metrics cards
│       │   ├── TrendChart.tsx          # Growth charts
│       │   ├── CountyMap.tsx           # County distribution
│       │   └── RecentActivity.tsx      # Activity feed
│       └── ops/
│           ├── QuickStats.tsx          # Key performance indicators
│           ├── DevicePipeline.tsx      # Visual workflow
│           ├── DonationRequests.tsx    # Donation management
│           ├── InventoryOverview.tsx   # Device inventory
│           └── ActivityFeed.tsx        # Real-time updates
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind configuration (HTI colors)
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── vercel.json                  # Vercel deployment settings
```

---

## 🎨 HTI Brand Colors

The dashboard uses HTI's official brand palette:

```css
--hti-navy: #1e3a5f;          /* Primary brand color */
--hti-teal: #4a9b9f;          /* Accent/interactive elements */
--hti-teal-light: #6db3b7;    /* Lighter accent */
--hti-red: #ff6b6b;           /* Alerts/CTAs */
--hti-yellow: #ffeb3b;        /* Highlights/warnings */
--hti-yellow-light: #fff9c4;  /* Light highlights */
```

Use these colors via Tailwind classes:
- `bg-hti-navy` - Navy background
- `text-hti-teal` - Teal text
- `border-hti-red` - Red border
- etc.

---

## 📱 Dashboards

### Board Dashboard (`/board`)

**Purpose**: High-level executive summary for board members

**Features**:
- ✅ Live impact metrics (3,500+ laptops, 2,500+ Chromebooks, etc.)
- ✅ Animated counters
- ✅ Growth trend charts
- ✅ 15 counties served visualization
- ✅ Recent activity feed

**Use Case**: Monthly board meetings, investor presentations, annual reports

---

### Operations Hub (`/ops`)

**Purpose**: Real-time operations management for HTI team

**Features**:
- ✅ Visual device pipeline (Donated → Received → Data Wipe → Refurbishing → QA → Ready → Distributed)
- ✅ Quick performance stats (devices in pipeline, avg turnaround time, bottlenecks)
- ✅ Donation request management (schedule pickups, track status, assign staff)
- ✅ Comprehensive inventory table (search, filter, bulk actions)
- ✅ Live activity feed (team actions, system notifications)

**Use Case**: Daily operations, device tracking, donation coordination

---

## 🔄 Next Steps (Future Enhancements)

### Phase 2: Backend Integration
- [ ] Connect to Supabase for real database
- [ ] Add authentication (board vs ops roles)
- [ ] Real-time updates via WebSockets
- [ ] API routes for data operations

### Phase 3: Advanced Features
- [ ] Interactive county map (Mapbox/Leaflet)
- [ ] Export reports (PDF, CSV)
- [ ] Email notifications for donations/distributions
- [ ] Certificate of Destruction generator
- [ ] Training session calendar
- [ ] Partner CRM

### Phase 4: Analytics
- [ ] Advanced metrics dashboard
- [ ] Predictive analytics (device demand forecasting)
- [ ] Impact reports (automated monthly summaries)
- [ ] Performance leaderboards (gamification)

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository to Vercel
3. Vercel auto-detects Next.js
4. Deploy! 🎉

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

### Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_APP_NAME=HubDash
# Add Supabase, API keys, etc. when ready
```

---

## 🤝 Contributing

This is an internal HTI project. For changes:

1. Create feature branch from `main`
2. Make changes
3. Test locally (`npm run build` must pass)
4. Submit pull request
5. Deploy to preview environment via Vercel

---

## 📝 License

Internal HTI project - All rights reserved.

---

## 📞 Contact

**HUBZone Technology Initiative**
- Website: [hubzonetech.org](https://hubzonetech.org)
- Email: will@hubzonetech.org
- Location: Henderson, NC

---

## 🎯 Impact

Every dashboard view represents real impact:
- **3,500+ laptops** diverted from landfills
- **2,500+ Chromebooks** distributed to families in need
- **15 counties** served across North Carolina
- **450+ people** trained in digital literacy

**Built with ❤️ for HTI by Claude Code**
