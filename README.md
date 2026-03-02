# 🐾 PetRescue – Location-Based Pet Emergency & Care Finder

Helping pets get the help they need — fast.

**PetRescue** is a location-aware web application designed to help pet owners quickly find nearby veterinary clinics, emergency animal hospitals, and pet shops.

The core mission is simple:
- In stressful situations, reduce search time.
- In emergencies, every second matters.

## 🌍 Vision
PetRescue aims to become a reliable digital assistant for pet owners by:
- Providing instant access to nearby veterinary services
- Prioritizing open and emergency-ready clinics
- Reducing panic during pet accidents or sudden illness
- Making pet care discovery simple and accessible

### Future goals include:
- Verified clinic listings
- Real-time open/closed status
- 24/7 emergency filtering
- Community reporting for incorrect information
- Expansion to multiple regions

## 🚀 Current Features (Production Ready)
- 📍 **Smart Location System**:
  - GPS Mode: Real-time distance-based sorting (Haversine).
  - District Mode: Manual selection of 25 Sri Lanka districts for users who deny GPS.
- 🚨 **Emergency mode**: Prioritizes 24/7 clinics and proximity.
- 🏥 **Data Ingestion**: Integrated OpenStreetMap (OSM) pipeline for free, automated data updates.
- 📞 **One-click call functionality**
- 🗺 **Directions integration** (Google/Apple Maps)
- 🛠 **DB Health Diagnostics**: Real-time monitoring of database health and district coverage.

## 🧱 Tech Stack
- **Frontend**: Next.js (App Router), React
- **Styling**: Vanilla CSS + Tailwind CSS
- **Backend**: Next.js API Routes (Node.js runtime)
- **Database**: Prisma + PostgreSQL (Vercel/Production) / SQLite (Local)
- **Data Source**: OpenStreetMap (OSM) via Overpass API

## 📁 Project Structure
```text
pet-care-app/
├── prisma/                  # Schema and migrations
├── src/app/                 # UI Screens & API Routes
│   ├── api/admin/import-osm # Free data ingestion pipeline
│   ├── api/places/nearby   # GPS-based search
│   ├── api/places/by-district # District-based search
│   └── api/debug/db-health  # Production monitoring
├── src/lib/                 # Geo utilities and DB Client
└── README.md
```

## ⚙️ Setup & Installation

### 1️⃣ Build & Migrate
```bash
npm install
npx prisma generate
npx prisma migrate dev
```

### 2️⃣ Production Environment Variables
Set these in Vercel (Settings > Environment Variables) or your `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string (Required for build).
- `ADMIN_SECRET`: A secure key for triggering data imports.

> [!IMPORTANT]
> If you see `P1012: Environment variable not found: DATABASE_URL` during Vercel build, ensure the variable is added in your Vercel Project Settings and that you've triggered a new redeploy.

### 3️⃣ Ingest Free Data (OSM)
Once deployed, trigger the OSM ingestion pipeline:
```bash
# Example using fetch in console
fetch("/api/admin/import-osm", {
  method: "POST",
  headers: { "x-admin-secret": "YOUR_ADMIN_SECRET" }
})
```

## 🧠 How Emergency Mode Works
The system detects the `locationMode` from localStorage:
- **GPS Mode**: Filters clinics within a 20km radius, sorted by distance.
- **District Mode**: Filters clinics in the selected Sri Lanka district, prioritizing those with "24 hours" in their status.

## ⚠️ Limitations
- OSM data depends on community contributions in Sri Lanka.
- Opening hours parsing is based on OSM tags (amenity=veterinary, shop=pet).

## 📊 Data Collection Note
This project currently uses CSV data exported from Google Maps search results for development purposes. Future production deployment would require the official Google Places API and scheduled data refresh jobs.

## 💡 Future Improvements
- 🔄 Automatic geocoding of addresses
- 📅 Real-time open-hours parsing
- 📱 Mobile-first PWA optimization
- 🐶 Pet profile tracking
- 🔔 Emergency push notifications

## 🤝 Contribution
This is an evolving project. Suggestions and improvements are welcome.
1. Fork the repo
2. Create a new branch
3. Submit a pull request

## 📜 License
This project is for educational and development purposes.

---
### ❤️ Why This Project Matters
Pets are family. In emergency situations, pet owners shouldn’t waste time searching multiple platforms. **PetRescue** aims to centralize critical information into one simple, fast interface.
