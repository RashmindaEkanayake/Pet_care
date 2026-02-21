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

## 🚀 Current Features (MVP)
- 📍 **Location-based nearby search** (Geolocation support)
- 🚨 **Emergency mode** (Prioritized by proximity and availability)
- 🏥 **Browse clinics, veterinarians, and pet shops**
- 📞 **One-click call functionality**
- 🗺 **Directions integration** (Google Maps)
- 🗂 **CSV-based data import system**
- 🛠 **Admin import dashboard**

## 🧱 Tech Stack
- **Frontend**: Next.js (App Router), React
- **Styling**: Vanilla CSS + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma + SQLite
- **Data Source**: Google Maps data (CSV import)
- **Utilities**: Haversine Formula for distance calculation

## 📁 Project Structure
```text
pet-care-app/
├── prisma/                  # Database schema and SQLite DB
├── src/app/                 # App routes (UI screens)
│   └── api/                 # API logic (Nearby, Emergency, Details)
├── src/lib/                 # Core logic (DB client, Import Service)
├── scripts/                 # CSV import automation script
├── data/                    # CSV data source (petshop_detailes.csv)
└── README.md
```

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/petrescue.git
cd petrescue
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup database
```bash
npx prisma generate
npx prisma db push
```

### 4️⃣ Import initial data
```bash
npx tsx scripts/import-csv.ts
```
*Or use the admin dashboard at:* `/admin/import`

### 5️⃣ Run development server
```bash
npm run dev
```
App runs at: [http://localhost:3000](http://localhost:3000)

## 🧠 How Emergency Mode Works
The emergency endpoint prioritizes locations in the following order:
1. **Open 24 Hours**
2. **Currently Open**
3. **Unknown Status**
4. **Closed**

Within each group, they are sorted by:
- **Distance** (Calculated via Haversine formula)
- **Rating** (Higher ratings first)

## ⚠️ Limitations (Current Version)
- Some listings may lack latitude/longitude
- Open/Closed status is based on scraped text
- Data freshness depends on CSV updates
- No authentication system yet

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
