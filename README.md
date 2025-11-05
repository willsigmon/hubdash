# HubDash - HTI Dashboard System

**Real-time operational dashboards for the HUBZone Technology Initiative**

*Securely Repurposing Technology. Expanding Digital Opportunity.*

---

## Getting Started

### For First-Time Users

Welcome to HubDash! Here's what you need to know:

**HubDash has two dashboards:**

1. **Board Dashboard** - For board members, donors, and stakeholders
   - View: `https://hubdash.hubzonetech.org/board`
   - Shows: Impact metrics, growth trends, county distribution
   - Audience: Executives who want high-level overview

2. **Operations Hub** - For HTI staff managing day-to-day operations
   - View: `https://hubdash.hubzonetech.org/ops`
   - Shows: Device pipeline, inventory, donations, activity feed
   - Audience: Operations team tracking devices and coordinating pickups

**No login needed** - Dashboards are currently open access.

---

## How to Use

### Viewing the Board Dashboard

1. Go to `https://hubdash.hubzonetech.org/board`
2. See live impact metrics:
   - Laptops collected
   - Chromebooks distributed
   - Counties served
   - People trained
   - E-waste diverted
   - Partner organizations

**For board meetings**: Screenshot or share this URL with board members.

---

### Viewing the Operations Hub

1. Go to `https://hubdash.hubzonetech.org/ops`
2. See operational data:
   - Quick performance stats (top-right)
   - 7-stage device pipeline (center)
   - Pending donation requests
   - Full device inventory (searchable)
   - Real-time activity feed

**For daily operations**: Check this hub each morning to see device status and pending pickups.

---

### Using the Operations Hub Tools

**Search inventory**:
- Type in the search box to find devices by:
  - Serial number
  - Device model
  - Manufacturer
  - Status (ready, refurbishing, etc.)

**Check activity feed**:
- Auto-updates every 10 seconds
- Shows recent device movements
- Shows new donations added
- Shows distribution completions

**Monitor the device pipeline**:
- See how many devices are at each stage
- Identify bottlenecks (which stage has most devices)
- Track overall completion rate

---

## Documentation by Role

Choose the guide that matches your role:

### For Operations Team
**Start here**: [MAINTENANCE.md](./MAINTENANCE.md)
- How to update metrics manually
- How to trigger data syncs from Knack
- How to troubleshoot problems
- Daily health checks

### For Deploying to Production
**Start here**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Step-by-step Vercel deployment
- Environment variable setup
- Custom domain configuration (hubdash.hubzonetech.org)
- Monitoring and logging

### For Developers / Extending Features
**Start here**: [CLAUDE.md](./CLAUDE.md)
- Project architecture
- How components are structured
- HTI brand guidelines
- Development workflow

### For Backend Setup
**Start here**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) (5-minute setup)
- Create PostgreSQL database
- Run database migrations
- Seed sample data
- Verify everything works

### For Knack Integration
**Start here**: [KNACK_SETUP.md](./KNACK_SETUP.md)
- Get Knack API credentials
- Configure data sync
- Map Knack fields to dashboard
- Trigger manual or automatic syncs

---

## Quick Reference

**Production URLs**:
- Board: `https://hubdash.hubzonetech.org/board`
- Ops Hub: `https://hubdash.hubzonetech.org/ops`
- Admin: `https://hubdash.hubzonetech.org/admin` (sync controls)

**For development**:
- Local: `http://localhost:3000`
- Runs at: `npm run dev`
- Build: `npm run build`

**Data is updated**:
- Automatically every 1 hour (if automatic sync enabled)
- Manually via `/admin` "Trigger Full Sync" button
- Or when staff adds data in Knack

---

## Architecture Overview

```
Knack (Your Data Source)
    ↓
Sync Process (Manual or Automatic)
    ↓
Supabase Database (PostgreSQL)
    ↓
HubDash API Routes
    ↓
React Components
    ↓
Your Browser
    ↓
Live Dashboards!
```

**In plain English**: Your data lives in Knack. HubDash copies it to a fast database (Supabase), then displays it on dashboards. When you sync, all changes appear automatically.

---

## What's Inside

### Database Tables (5 total)

| Table | Purpose | Example Data |
|-------|---------|--------------|
| `devices` | Device tracking | Serial numbers, status, location |
| `donations` | Donation requests | Company, device count, pickup date |
| `partners` | Organizations | School names, counties served |
| `training_sessions` | Digital literacy | Training dates, attendee counts |
| `activity_log` | Change tracking | What happened and when |

### Components (9 total)

**Board Dashboard**:
- ImpactMetrics - Animated counters
- TrendChart - Growth trends
- CountyMap - County distribution
- RecentActivity - Latest updates

**Operations Hub**:
- QuickStats - Key performance numbers
- DevicePipeline - 7-stage workflow
- DonationRequests - Pending pickups
- InventoryOverview - Device table
- ActivityFeed - Real-time updates

---

## Development

### For Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up Supabase
# Follow: SUPABASE_SETUP.md (5 minutes)

# 3. Set up Knack integration (optional)
# Follow: KNACK_SETUP.md

# 4. Start dev server
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Technology Stack

- **Framework**: Next.js 16 (React)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4.1
- **Charts**: Recharts
- **Deployment**: Vercel
- **Hosting**: Vercel edge network

### Build for Production

```bash
npm run build   # Creates optimized bundle
npm start       # Runs production version locally
```

**Vercel auto-deploys** when you push to GitHub.

---

## Troubleshooting

**Dashboard shows "Loading..." forever?**
- Check internet connection
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- See [MAINTENANCE.md](./MAINTENANCE.md) for more

**Data not updating?**
- Go to `/admin` and click "Trigger Full Sync"
- Check Supabase has data (see SUPABASE_SETUP.md)
- See [MAINTENANCE.md](./MAINTENANCE.md) troubleshooting section

**Can't find something?**
- Check the relevant guide listed above
- Email: will@hubzonetech.org

---

## Change History

See [CHANGELOG.md](./CHANGELOG.md) for complete development history.

**Current Version**: 1.0 (November 4, 2025)
**Status**: Production Ready with Full Backend

**What was built**:
- Complete PostgreSQL database
- 6 REST API endpoints
- 9 React components with real data
- Knack data synchronization
- Vercel deployment ready

---

## FAQ - Frequently Asked Questions

### General Questions

**Q: Do I need a login to use HubDash?**
A: Not yet. Currently, both dashboards are open access. Login and role-based permissions are coming in a future version.

**Q: How often is the data updated?**
A: Automatically every 1 hour (if enabled). You can manually trigger a sync anytime via the `/admin` page.

**Q: What happens if Knack goes down?**
A: HubDash keeps working with the last synced data. It's a copy/cache, so outages don't affect the dashboards.

**Q: Can I export the data?**
A: Not yet. That's a planned feature. For now, you can screenshot dashboards or query the Supabase database directly.

---

### Operations Questions

**Q: How do I add a new device?**
A: Add it in Knack, then go to `/admin` and click "Trigger Full Sync". It appears on HubDash within seconds.

**Q: Why does my data show old information?**
A: Sync hasn't happened recently. Go to `/admin` and click "Trigger Full Sync" to update immediately.

**Q: How do I see who donated devices?**
A: Check the Donations section in the Operations Hub. Shows company name, contact info, and pickup status.

**Q: Can I edit data in HubDash?**
A: Not yet. HubDash is read-only for now. Edit data in Knack, then sync to HubDash.

---

### Technical Questions

**Q: What if I see an error?**
A: Take a screenshot (press F12 for browser console errors), note the error message, and email will@hubzonetech.org.

**Q: Is my data secure?**
A: Yes. All data is encrypted in transit (HTTPS) and at rest (Supabase). Row-Level Security is enabled on all tables.

**Q: Where is the data stored?**
A: Supabase (PostgreSQL database) hosted on Amazon Web Services (AWS).

**Q: Can I download the source code?**
A: Yes, it's on GitHub. See CLAUDE.md for the repository location.

---

### Feature Requests

**Q: Can you add feature X?**
A: Yes, probably! Email your request to will@hubzonetech.org with:
- What problem does it solve?
- Who needs it?
- When do you need it?

---

## Device Pipeline Stages Explained

HubDash shows devices flowing through 7 stages:

1. **Donated** - Device arrives from donor
2. **Received** - Staff logged it into system
3. **Data Wipe** - Securely wiped (NIST standard)
4. **Refurbishing** - Installed ChromeOS Flex
5. **QA Testing** - Tested to ensure it works
6. **Ready** - Ready to distribute
7. **Distributed** - Delivered to recipient

Each stage shows how many devices are there. A high number at one stage = bottleneck.

---

## Impact Metrics Explained

**Board Dashboard shows**:

- **Laptops Collected** - Total devices donated to HTI
- **Chromebooks Distributed** - Devices successfully given to recipients
- **Counties Served** - How many North Carolina counties HTI reached
- **People Trained** - Attendees in digital literacy training
- **E-Waste Diverted** - Tons of waste kept from landfills (calculated)
- **Partners** - Schools, libraries, nonprofits we work with

---

## Support & Help

### Quick Help

| Issue | Solution |
|-------|----------|
| Dashboard won't load | Hard refresh: Ctrl+Shift+R (Win) or Cmd+Shift+R (Mac) |
| Data is old | Go to `/admin`, click "Trigger Full Sync" |
| Search not working | Try searching by exact serial number |
| Can't find a device | Check it was synced (check activity feed) |
| Need help with a feature | See the guide at top of this document |

### Get More Help

- **Day-to-day operations**: See [MAINTENANCE.md](./MAINTENANCE.md)
- **Deploying to production**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Setting up backend**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Syncing Knack data**: See [KNACK_SETUP.md](./KNACK_SETUP.md)
- **Everything else**: Email will@hubzonetech.org

---

## Future Roadmap

**Coming Soon (Next 3 months)**:
- User login and role-based permissions
- Email notifications (new donations, device ready)
- PDF report generation

**This Year**:
- WebSocket real-time updates
- Interactive county map
- Training calendar
- Bulk import/export

---

## About HTI

**HUBZone Technology Initiative** is a North Carolina-based nonprofit dedicated to:

- **Collecting** donated laptops from businesses and individuals
- **Refurbishing** them securely with ChromeOS Flex
- **Training** recipients in digital literacy
- **Distributing** to underserved communities across North Carolina

**Current Impact**:
- 3,500+ laptops collected
- 2,500+ Chromebooks distributed
- 15 counties served
- 450+ people trained
- 50+ partner organizations

**Learn more**: [hubzonetech.org](https://hubzonetech.org)

---

## Version & Status

**Current Version**: 1.0 (November 4, 2025)
**Status**: Production Ready
**Last Updated**: November 4, 2025

**Built for HTI by Claude Code**
**Questions?** Email will@hubzonetech.org
