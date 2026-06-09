# RentTrack — Go-To-Market Playbook

## Product Summary
- **What**: Dead-simple rent tracking for independent landlords (1-20 units)
- **Price**: Free for 1 unit. $15/month unlimited.
- **Positioning**: "The simplest way to track rent payments" — not a bloated property management system
- **Target**: US-based independent landlords managing 1-20 units themselves

---

## Phase 1: Find Your First 10 Users (Week 1-2)

### Where They Hang Out

#### Reddit (Primary Channel)
- **r/landlord** (150K+ members) — THE main channel
- **r/RealEstateInvesting** (400K+ members)
- **r/realestateinvesting** 
- **r/PropertyManagement**
- **r/LeaseLords**

**Strategy**: Do NOT post "I built a tool, try it!" — that gets downvoted and banned.

**What actually works on Reddit:**
1. Find threads where people complain about spreadsheets or PM software
2. Write a genuinely helpful comment (200+ words) about how you solved this problem
3. At the end, casually mention: "I actually got so fed up I built a simple tool for myself — it's at renttrack.app if you want to check it out. Free for 1 unit."
4. Ratio: 10 helpful comments per 1 mention of your tool

**Search queries to monitor daily on Reddit:**
- "spreadsheet" "rent" "tracking"
- "landlord" "software" "recommend"
- "Buildium" "too expensive"
- "Stessa" "review"
- "Landlord Studio" "alternative"
- "what do you use for rent tracking"

#### BiggerPockets Forums
- URL: biggerpockets.com/forums
- Strategy: Participate in landlord discussions. Signature line can have your link. Write detailed posts about rent tracking best practices.

#### Facebook Groups
- "Landlord Support Group"
- "Real Estate Investors Network"
- "DIY Landlords"
- Strategy: Same as Reddit — help first, mention product second

### Cold Outreach (High-Effort, High-Reward)

Find landlords on:
1. BiggerPockets — DM active users who posted about software frustrations
2. Twitter/X — Search "landlord spreadsheet" "tired of Buildium"
3. Local real estate investor meetups (virtual)

**Message template:**
> Hey [Name], saw your post about [their frustration]. I had the same problem — I tried Buildium/Stessa/Landlord Studio and they all felt like overkill for my [X] units. I ended up building a dead-simple rent tracker that just does the basics. Would you be open to trying it and giving me feedback? It's free, no strings attached. I just want to make sure it actually solves the problem before I charge anyone.

---

## Phase 2: SEO Foundation (Month 1-2)

### Target Keywords (long-tail, low competition)

| Keyword | Monthly Volume | Difficulty |
|---------|----------------|------------|
| "simple rent tracker for landlords" | 500+ | Low |
| "free rent tracking spreadsheet alternative" | 300+ | Low |
| "best rent collection app small landlord" | 800+ | Medium |
| "rent payment tracker excel alternative" | 400+ | Low |
| "landlord software for 1-5 units" | 200+ | Very Low |
| "Buildium alternative small landlord" | 300+ | Low |
| "Stessa alternative 2025" | 500+ | Medium |
| "how to track rental income" | 1000+ | Medium |

### Content to Create (one article per week)

1. **"Why Spreadsheets Fail After 3 Rental Units (And What to Use Instead)"**
   - SEO target: "rent tracking spreadsheet alternative"
   
2. **"Buildium vs Stessa vs Landlord Studio: Honest Comparison for Small Landlords"**
   - SEO target: "Buildium alternative small landlord"
   
3. **"How to Track Rental Income Without an Accountant (2025 Guide)"**
   - SEO target: "how to track rental income"
   
4. **"The 5 Best Rent Collection Apps for Independent Landlords"**
   - SEO target: "best rent collection app small landlord"
   
5. **"Landlord Tax Deductions Checklist: Track These or Lose Money"**
   - SEO target: "landlord tax deductions rental property"

### Technical SEO Checklist
- [ ] Meta descriptions on all pages
- [ ] /blog/ section with articles
- [ ] Sitemap.xml
- [ ] robots.txt (already created)
- [ ] Google Search Console submission
- [ ] Schema markup (SoftwareApplication)

---

## Phase 3: Launch (Week 3)

### Pre-Launch Checklist
- [ ] Landing page live and tested
- [ ] Auth flow tested (register, login, dashboard)
- [ ] Stripe payments connected and tested
- [ ] Email reminders working
- [ ] Blog with 3 articles published
- [ ] Analytics set up (Plausible or Google Analytics)

### Launch Platforms (in order)

1. **Product Hunt** (Day 1)
   - Prep: Create maker profile, prepare 5 images/GIFs
   - Best day: Tuesday or Wednesday
   - First comment should tell your story authentically
   - Target: Top 10 of the day = 500-2000 signups

2. **BetaList** (Day 1)
   - Submit at least 2 weeks before launch

3. **Hacker News** "Show HN" (Day 3-5)
   - Title: "Show HN: RentTrack — Simple rent tracking for landlords fed up with spreadsheets"
   - Be in the comments answering everything

4. **Indie Hackers** (Day 1-ongoing)
   - Post your building journey
   - Share revenue transparently (drives massive traffic)

5. **Reddit** (Day 5-7)
   - Post in r/landlord, r/RealEstateInvesting
   - Frame as: "I built a free tool for landlords — looking for honest feedback"

6. **AlternativeTo, G2, Capterra, GetApp** (Week 2-3)
   - List your product on all software directories
   - Monitor and respond to reviews

---

## Phase 4: Growth (Month 2-6)

### Weekly Routine
| Day | Activity | Time |
|-----|----------|------|
| Mon | Write 1 blog post (SEO) | 2-3 hours |
| Tue | Reddit/BiggerPockets community engagement | 1-2 hours |
| Wed | Product improvements (based on feedback) | 3-4 hours |
| Thu | Reddit/BiggerPockets community engagement | 1-2 hours |
| Fri | Social/content creation (Twitter, LinkedIn) | 1-2 hours |
| Sat | Customer support + bug fixes | 1 hour |
| Sun | Off | 0 |

### Metrics to Track
- Weekly signups
- Free → Paid conversion rate (target: 5-10%)
- Monthly churn rate (target: <5%)
- Customer acquisition channels (which one works best?)
- MRR growth rate

### When to Raise Prices
Don't rush to raise prices. First get to 50 paying users at $15/month ($750 MRR).
Then consider:
- Annual plan ($150/year = 17% discount)
- "Landlord Pro" tier ($29/month — adds expense tracking + tax export)

---

## Positioning vs Competitors

| Feature | Spreadsheets | Buildium | Stessa | Landlord Studio | **RentTrack** |
|---------|-------------|----------|--------|-----------------|---------------|
| Simple to use | No (manual) | No (complex) | Kind of | Kind of | **Yes** |
| Automated reminders | No | Yes* | No | Yes | **Yes** |
| Use your own bank | N/A | Yes | No (forced Thread bank) | Yes | **Yes** |
| Price | Free | $50-200+/mo | Freemium | $12-35/mo | **Free-15/mo** |
| Built for 1-20 units | No | No (50+) | Yes | Yes | **Yes** |
| Setup time | Hours | Days | 30 min | 30 min | **5 min** |

### Our "Unfair" Advantage
We are NOT trying to be a property management system. We do ONE thing well: track who paid and remind who hasn't. This focus means:
- Less code to maintain
- Less surface area for bugs
- Clearer value proposition
- Easier for solo founder to run

---

## Financial Projections (Conservative)

| Month | Users (Free) | Users (Paid) | MRR | Notes |
|-------|-------------|--------------|-----|-------|
| 1 | 50 | 3 | $45 | Early adopters, word of mouth |
| 2 | 100 | 8 | $120 | Reddit posts go live |
| 3 | 200 | 18 | $270 | SEO starts kicking in |
| 4 | 400 | 35 | $525 | Content compound effect |
| 5 | 600 | 55 | $825 | Product Hunt residual |
| 6 | 900 | 80 | $1,200 | Referral loop starting |

Target: **$5,000 MRR** by Month 12-15 (~330 paying users)

---

## What NOT To Do

1. ❌ Don't run paid ads until you have $2K+ MRR — negative ROI at small scale
2. ❌ Don't add features users don't ask for — stay focused on rent tracking
3. ❌ Don't ignore support emails — in the beginning, reply to every single one within 2 hours
4. ❌ Don't copy competitors' positioning — "simplest" is our moat
5. ❌ Don't give up after 3 months — SaaS is a 12-18 month game
