# Soni Jewellers — Product Brief
**Last updated:** March 25, 2026
**Status:** Live (demo/staging)

---

## 1. Overview

Soni Jewellers is a mobile-first web app for a handcrafted jewellery store based in Dilshad Garden, Delhi. The product replaces walk-in-only discovery and a manual savings scheme with a digital experience customers can use on their phones.

**Core value props:**
- Browse the full catalogue with filters, images, and 360° views — anytime, anywhere
- Enroll in and track a gold savings scheme (pay 11/20 months, get 1/2 free)
- See live gold & silver rates updated daily by the store
- One tap to call, WhatsApp, or get directions

---

## 2. Users

| User | Description |
|------|-------------|
| **Customer** | Existing or prospective buyers. Primarily mobile. May not be tech-savvy. Authenticates via SMS OTP. |
| **Store Admin** | Owner or staff. Manages the catalogue, rates, and schemes from the admin portal. Authenticated via phone OTP + admin role check. |

---

## 3. Pages & Features

### 3.1 Homepage (`/`)
- **Hero carousel** — rotating promotional banners
- **Today's rates ticker** — Gold 24K, Gold 22K, Silver with day-over-day change indicator (↑/↓)
- **Category shortcuts** — Diamond, Gold, Silver, Top Selling, Bridal (link to pre-filtered catalogue)
- **Price filter chips** — Under ₹5K / ₹10K / ₹10K–25K / ₹25K–50K / Above ₹50K
- **Featured collection** — up to 4 pinned items set by admin
- **Gold scheme CTA** — banner linking to scheme enrollment

### 3.2 Catalogue (`/catalogue`)
- Grid of items (2-up mobile, 4-up desktop)
- **Search** — debounced free-text search
- **Filters** — Metal, Jewellery Type, Collection, Price Range, Top Selling (active filters shown as removable chips)
- **Item card** — image, name, metal, price
- **Item detail modal** — full image gallery, 360° viewer, specs (weight, purity), price, WhatsApp inquiry CTA

### 3.3 Gold Savings Scheme (`/scheme`)
Two scheme tiers:

| Tier | Pay | Get Free | Total Installments |
|------|-----|----------|--------------------|
| Standard (12+1) | 12 months | 1 month | 13 |
| Premium (20+2) | 20 months | 2 months | 22 |

- Min. amount: ₹500/month; quick-select buttons for ₹1K / ₹2K / ₹5K / ₹10K
- On enrollment: sends a pre-filled WhatsApp message to the store with customer name, phone, scheme type, and total value
- **Passbook view** (post-enrollment): shows all installments, paid/pending/free status, a progress bar, and total scheme value

### 3.4 Feedback (`/feedback`)
- Simple customer feedback form (name, rating, message)
- Submissions stored in Supabase, reviewed in admin portal

### 3.5 Store Locator (`/stores`)
- Google Maps embed centered on Dilshad Garden, Delhi
- Store card: address, phone, hours, "Get Directions" + "Call" buttons

### 3.6 Daily Rates (`/rates`)
- Dedicated page for full metal rates (24K, 22K, 18K gold; silver)

---

## 4. Admin Portal (`/admin`)

Password-gated (`admin123` in demo) + database role check (`role = "admin"`). Four sections:

| Section | What it does |
|---------|--------------|
| **Catalogue** | Add / edit items. Fields: name, description, metal, jewellery type, purity, weight (display + grams), price, collections, featured toggle. Auto-calculates price from today's rate × weight × purity. Upload gallery images + 360° frame sets. |
| **Rates** | Update daily gold (24K / 22K / 18K) and silver rates (per gram), with optional day-over-day change values. |
| **Schemes** | View all enrolled customers and their installment progress. |
| **Feedback** | Review all customer feedback submissions. |

---

## 5. Authentication

- SMS OTP via Supabase Auth (phone number prefixed `+91`)
- Three-step flow: enter phone → enter OTP → optional name (first sign-in only)
- Profile auto-created in `profiles` table on first sign-in
- Auth state available app-wide via `AuthContext`

---

## 6. Design System

### Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Gold | `#D4AF37` | Primary CTAs, highlights, selected states |
| Navy | `#1A1A2E` | Headings, primary text, dark backgrounds |
| Cream | `#FFF9F0` | Page backgrounds, soft surfaces |
| Rose | `#F8E8E0` | Secondary backgrounds, scheme CTA section |

### Typography & UI
- Tailwind CSS 4 utility classes
- Rounded cards with `border-gray-200` borders and subtle shadows
- Gradient buttons: `from-gold to-gold-dark`, text in `navy`
- Mobile-first; most layouts are single column with 2-col grids for cards

---

## 7. Technology Snapshot

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript / React 19 |
| Styling | Tailwind CSS 4 |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Image storage | Supabase Storage (`item-images` bucket) |
| Hosting | (TBD / Vercel-ready) |

---

## 8. Key User Flows

### Customer: Browse & Inquire
1. Land on homepage → see today's rates + featured items
2. Tap a category or "View All" → catalogue with filters
3. Tap an item card → detail modal with gallery / 360° view
4. Tap "WhatsApp" → pre-filled inquiry message opens in WhatsApp

### Customer: Enroll in Gold Scheme
1. Tap "Learn More & Enroll" on homepage CTA or navigate to `/scheme`
2. If not logged in → prompted to log in via SMS OTP
3. Choose tier (Standard or Premium) → enter monthly amount → review summary
4. Confirm → scheme created in DB → WhatsApp notification sent to store
5. Return to `/scheme` at any time → see passbook with installment status

### Admin: Add a New Item
1. Log in → navigate to `/admin`
2. Click "+ Add Item" → fill form (name, metal, type, weight, purity)
3. Enter weight in grams + purity → price auto-calculates from today's rate
4. Upload gallery images (set primary) + optional 360° frames
5. Toggle "Feature on homepage" if applicable → Save

### Admin: Update Daily Rates
1. Navigate to `/admin/rates`
2. Enter new per-gram values for Gold 24K / 22K / 18K and Silver
3. Optionally enter day-over-day change (shown as ↑/↓ on homepage)
4. Save → rates immediately reflected on customer-facing pages

---

## 9. Known Gaps & Open Questions

| # | Area | Gap / Decision needed |
|---|------|-----------------------|
| 1 | **Payments** | Scheme installment payments are tracked manually by admin — no payment gateway integration yet. Customers must pay in store; admin marks installments as paid. |
| 2 | **Admin auth** | Password is currently hardcoded (`admin123`). Should be replaced before production. |
| 3 | **Scheme — one per user** | A customer can only have one active scheme at a time. Multi-scheme support is not built. |
| 4 | **360° viewer** | Frames must be photographed and uploaded manually (24–36 images per item). No in-app guidance for photographers. |
| 5 | **Catalogue pagination** | Admin view is capped at 20 items. Customer catalogue loads all items with no pagination/infinite scroll. |
| 6 | **Notifications** | No push notifications or SMS reminders for upcoming scheme installments. |
| 7 | **Store** | Currently hardcoded to a single location. Multi-store support would require a DB-backed store table. |
| 8 | **SEO / OG tags** | Dynamic per-product meta tags not implemented; all pages share the same title/description. |

---

## 9. Out of Scope (current version)

- Online purchasing / checkout / cart
- Inventory / stock management
- Wishlist / saved items
- Customer reviews on products
- Multi-language support
