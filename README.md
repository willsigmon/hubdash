# 🧠 HTI Dashboard Intelligence Suite

**HUBZone Technology Initiative** Grant Compliance & Device Tracking Dashboard

> *Secure. Simple. Socially Good.*

![HTI Colors](https://img.shields.io/badge/Navy-0E2240-0E2240)
![HTI Colors](https://img.shields.io/badge/Blue-6FC3DF-6FC3DF)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

---

## 🎯 Purpose

This dashboard suite empowers HTI to act as a **data-driven strategist, engineer, and compliance analyst** — seamlessly integrating **Knack**, **Vercel**, and **grant reporting** into one intelligent workflow.

HTI transforms donated laptops into secure **HTI Chromebooks** and delivers them with **digital literacy training** to residents and organizations in underserved HUBZone communities across 15 counties in North Carolina and southern Virginia.

### Grant Framework

**Supported by:** NC Department of Information Technology Digital Champion Grant
**Funded by:** American Rescue Plan Act (ARPA)
**Grant Period:** 2024-2026

**Core Commitments:**
- Acquire **3,500+ donated laptops** by end of 2026
- Convert **2,500 into functional HTI Chromebooks**
- Deliver **156+ hours** of digital literacy instruction
- Maintain transparency through quarterly progress reports

---

## 🏛️ Organizational Context

### Mission
Bridge the digital divide by pairing **technology access** (refurbished laptops) with **digital literacy** training.

### Service Area (15 Counties)
Wake, Durham, Vance, Franklin, Granville, Halifax, Wilson, Edgecombe, Martin, Hertford, Greene, Warren, Northampton, Person, Nash

### 2026 Business Development Goals
- Source laptops from **10+ unique organizations**
- Secure **6+ recurring donors** committing 50+ laptops annually
- Generate **$65,000 in grant-matched funding**
- Onboard **2 corporate sponsors**

---

## 🧩 Core Technical Skills

This suite implements **12 specialized skills** for Knack API integration:

### 1. **knack_reader** - Data Extraction
REST-based access to Knack Objects and Views for data retrieval

### 2. **knack_auth** - Authentication
Handles API key and user token authentication with auto-refresh

### 3. **knack_pagination** - Full Data Retrieval
Manages pagination respecting Knack's 1,000-record limit

### 4. **knack_filter_sort** - Dynamic Filtering
Query optimization for dashboards with complex filtering

### 5. **knack_realtime** - Live Updates
Simulates real-time sync between Knack and Vercel dashboards

### 6. **knack_cache_optimizer** - Performance
Caches results and enforces 10-requests-per-second rate limit

### 7. **knack_dashboard_ai** - Insights
Generates metrics and visual summaries from operational data

### 8. **knack_reporting_sync** - Grant Compliance
Automates quarterly reporting for NCDIT and internal use

### 9. **knack_data_cleaner** - Quality Assurance
Ensures data accuracy for compliance dashboards

### 10. **knack_exporter** - Report Generation
Creates shareable reports in PDF, CSV, HTML, and Markdown

### 11. **knack_goal_tracker** - Progress Monitoring
Tracks HTI's performance against grant and business goals

### 12. **knack_devops** - Infrastructure
Manages automated builds, environment sync, and monitoring

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Knack account with API credentials
- Vercel account (optional, for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hubdash.git
cd hubdash

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Knack credentials
```

### Environment Variables

Create a `.env` file:

```env
KNACK_APP_ID=your_app_id_here
KNACK_API_KEY=your_api_key_here
KNACK_API_BASE_URL=https://api.knack.com/v1
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
hubdash/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Main layout with HTI branding
│   ├── page.tsx             # Home page with goal overview
│   ├── dashboard/           # Grant compliance dashboard
│   └── reports/             # Report generator
├── components/              # React components
│   ├── GoalProgressCard.tsx
│   ├── QuickStats.tsx
│   ├── DeviceStatusChart.tsx
│   ├── CountyDistribution.tsx
│   └── TrainingMetrics.tsx
├── lib/                     # Core logic
│   └── knack/              # 12 Core Skills
│       ├── types.ts         # TypeScript definitions
│       ├── auth.ts          # Skill 2: Authentication
│       ├── reader.ts        # Skill 1: Data reading
│       ├── pagination.ts    # Skill 3: Pagination
│       ├── filter.ts        # Skill 4: Filtering/sorting
│       ├── cache.ts         # Skill 6: Caching
│       ├── goal-tracker.ts  # Skill 11: Goal tracking
│       ├── reporting.ts     # Skill 8: Report generation
│       ├── data-cleaner.ts  # Skill 9: Data quality
│       ├── exporter.ts      # Skill 10: Export formats
│       ├── client.ts        # Unified client
│       └── index.ts         # Main export
└── public/                  # Static assets
```

---

## 🎨 Brand Guidelines

### Colors
- **Navy Blue:** `#0E2240` - Primary brand color
- **Light Blue:** `#6FC3DF` - Accent color
- **White:** `#FFFFFF` - Background

### Tone
Clear, factual, and empowering with emphasis on measurable community benefit

### Voice
Mission-driven but approachable, highlighting local stories of access and empowerment

---

## 📊 Dashboard Features

### Home Dashboard
- **Quick Stats:** Real-time device and training metrics
- **Goal Progress:** Visual tracking of 2026 grant commitments
- **Service Area Map:** 15-county coverage visualization

### Grant Compliance Dashboard
- **Device Status Overview:** Acquired, converted, ready, presented, discarded
- **County Distribution:** Geographic breakdown of impact
- **Training Metrics:** Hours, participants, topics
- **Alerts & Recommendations:** AI-powered insights

### Report Generator
- **Quarterly Reports:** NCDIT-compliant accountability reports
- **Export Formats:** PDF, CSV, HTML, Markdown
- **Branded Templates:** HTI visual identity
- **Historical Analysis:** Quarter-over-quarter comparisons

---

## 🔧 Knack API Integration

### Basic Usage

```typescript
import { getKnackClient } from '@/lib/knack';

const client = getKnackClient();

// Fetch all device records with caching
const devices = await client.fetchAllWithCache(
  'object_1', // Your Knack object key
  'devices',  // Cache key
  300         // TTL in seconds
);

// Get goal progress
const progress = await client.getGoalProgress({
  laptopsAcquired: 1500,
  laptopsConverted: 1000,
  trainingHours: 75,
  uniqueDonors: 8,
  recurringDonors: 4,
  grantMatching: 30000,
  privateDonations: 12,
  corporateSponsors: 1,
});

// Generate quarterly report
const report = await client.generateQuarterlyReport(
  'Q2 2025',
  '2025-04-01',
  '2025-06-30'
);
```

### Advanced Filtering

```typescript
import { KnackFilterSort } from '@/lib/knack';

// Filter by HTI counties
const countyFilter = KnackFilterSort.createCountyFilter([
  'Wake', 'Durham', 'Halifax'
]);

// Filter by device status
const statusFilter = KnackFilterSort.createStatusFilter([
  'converted', 'ready'
]);

// Date range filter
const dateFilter = KnackFilterSort.createDateRangeFilter(
  'acquisition_date',
  '2025-04-01',
  '2025-06-30'
);
```

---

## 📈 Grant Compliance & Reporting

### Quarterly Accountability Reports (QAR)

Generate NCDIT-compliant reports:

```typescript
import { KnackReportingSync } from '@/lib/knack';

const reporting = new KnackReportingSync();

const report = reporting.generateQuarterlyReport(
  'Q2 2025',
  '2025-04-01',
  '2025-06-30',
  devices,
  training,
  goals
);

// Export as NCDIT-compliant HTML
const html = reporting.generateNCDITReport(report);
```

### Goal Tracking

```typescript
import { KnackGoalTracker, HTI_2026_GOALS } from '@/lib/knack';

const tracker = new KnackGoalTracker(HTI_2026_GOALS);

const report = tracker.checkProgress({
  laptopsAcquired: 1500,
  laptopsConverted: 1000,
  trainingHours: 75,
  uniqueDonors: 8,
  recurringDonors: 4,
  grantMatching: 30000,
  privateDonations: 12,
  corporateSponsors: 1,
});

// Generate dashboard summary
const summary = tracker.generateDashboardSummary(report);
```

---

## 🔐 Security & Compliance

- **API Keys:** Never commit `.env` files
- **Rate Limiting:** Automatic 10 req/s limit enforcement
- **Data Validation:** All inputs sanitized
- **ARPA Compliance:** Audit-ready data retention
- **NCDIT Standards:** Quarterly reporting alignment

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker

```bash
# Build image
docker build -t hti-dashboard .

# Run container
docker run -p 3000:3000 --env-file .env hti-dashboard
```

---

## 🤝 Contributing

This is an internal HTI project. For questions or support:

1. **Internal Team:** Contact the HTI technical lead
2. **Issues:** Report bugs via GitHub Issues
3. **Features:** Submit feature requests with business justification

---

## 📜 License

Proprietary - HUBZone Technology Initiative

---

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Core Knack API integration (12 skills)
- [x] Dashboard UI with HTI branding
- [x] Goal tracking and progress visualization
- [x] Basic report generation

### Phase 2 (Next)
- [ ] Real-time webhook integration
- [ ] Advanced analytics and forecasting
- [ ] Mobile-responsive optimizations
- [ ] Automated NCDIT report submission

### Phase 3 (Future)
- [ ] Donor portal integration
- [ ] Training session scheduling
- [ ] Inventory management system
- [ ] Multi-language support

---

## 📞 Support

**HUBZone Technology Initiative**
Website: [Your HTI Website]
Email: [Your Contact Email]

**Technical Support:**
For dashboard-related issues, contact the development team.

---

**Built with ❤️ for the communities we serve**

*Every dataset tells a story — this one tells the story of access, empowerment, and community progress.*
