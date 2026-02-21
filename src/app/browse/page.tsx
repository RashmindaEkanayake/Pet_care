"use client";

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LocationIndicator from '@/components/LocationIndicator';

function BrowseContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "all";

    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState(initialCategory);
    const [locationMode, setLocationMode] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            try {
                const mode = localStorage.getItem("locationMode");
                setLocationMode(mode);

                let url = "";
                if (mode === "gps") {
                    const lat = localStorage.getItem("userLat");
                    const lng = localStorage.getItem("userLng");
                    const query = new URLSearchParams();
                    query.set("lat", lat || "");
                    query.set("lng", lng || "");
                    if (category && category !== "all") query.set("category", category);
                    if (searchQuery) query.set("q", searchQuery);
                    url = `/api/places/nearby?${query.toString()}`;
                } else if (mode === "district") {
                    const district = localStorage.getItem("selectedDistrict");
                    const query = new URLSearchParams();
                    query.set("district", district || "");
                    if (category && category !== "all") query.set("category", category);
                    if (searchQuery) query.set("q", searchQuery);
                    url = `/api/places/by-district?${query.toString()}`;
                }

                if (url) {
                    const res = await fetch(url);
                    const data = await res.json();
                    setPlaces(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to fetch places", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchPlaces, 300);
        return () => clearTimeout(timeoutId);
    }, [category, searchQuery]);

    return (
        <div className="bg-background-light-browse dark:bg-background-dark-browse font-display text-text-chocolate dark:text-tan-100 antialiased min-h-screen flex flex-col">
            <LocationIndicator />
            <header className="sticky top-0 z-50 bg-background-light-browse/95 dark:bg-background-dark-browse/95 backdrop-blur-md px-4 py-2 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-secondary-browse dark:text-secondary-light font-black tracking-widest uppercase">Browse Services</span>
                        <h1 className="text-xl font-black text-text-chocolate dark:text-tan-100">Nearby You</h1>
                    </div>
                </div>
                <div className="relative w-full mb-4 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-secondary-browse group-focus-within:text-primary-browse transition-colors">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-4 py-3 bg-tan-200 dark:bg-surface-dark-browse border-none rounded-xl text-text-chocolate dark:text-tan-100 placeholder-secondary-browse focus:ring-2 focus:ring-primary-browse/50 shadow-sm text-sm"
                        placeholder="Search clinics, vets, shops..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 snap-x">
                    {[
                        { id: "all", label: "All", icon: "grid_view" },
                        { id: "clinic", label: "Clinics", icon: "local_hospital" },
                        { id: "veterinarian", label: "Vets", icon: "health_and_safety" },
                        { id: "pet_shop", label: "Shops", icon: "storefront" }
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`snap-start shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${category === cat.id
                                ? "bg-primary-browse text-white shadow-primary-browse/20 scale-105"
                                : "bg-white dark:bg-surface-dark-browse border border-tan-200 text-text-chocolate dark:text-tan-100 hover:border-primary-browse/50"
                                }`}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 px-4 py-4 overflow-y-auto pb-32">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black text-text-chocolate dark:text-tan-100 uppercase tracking-tight">
                        {category === "all" ? "All Results" : category.replace('_', ' ')}
                        <span className="text-xs font-bold text-secondary-browse ml-2 bg-tan-200 dark:bg-stone-800 px-2 py-1 rounded-md">
                            {places.length} found
                        </span>
                    </h2>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-primary-browse border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-secondary-browse font-bold animate-pulse uppercase tracking-widest text-xs">Finding services...</p>
                        </div>
                    ) : places.length > 0 ? (
                        places.map((place) => (
                            <Link key={place.id} href={`/clinic/${place.id}`} className="block bg-white dark:bg-surface-dark-browse rounded-2xl overflow-hidden shadow-sm border border-tan-200 dark:border-stone-800 group active:scale-[0.98] transition-all">
                                <div className="relative h-44 w-full bg-stone-100">
                                    <img alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={place.imageUrl || "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&q=80"} />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {place.openingStatus && (
                                            <span className="bg-green-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                                                {place.openingStatus}
                                            </span>
                                        )}
                                        {place.distance && place.distance !== Infinity && (
                                            <span className="bg-black/60 backdrop-blur text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                                                {place.distance.toFixed(1)} km
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-black text-text-chocolate dark:text-tan-100 leading-tight">{place.name}</h3>
                                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                                            <span className="material-symbols-outlined text-amber-500" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" } as any}>star</span>
                                            <span className="text-sm font-black text-amber-600">{place.rating || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-mocha dark:text-secondary-light mb-4">
                                        <span className="material-symbols-outlined text-primary-browse text-base">location_on</span>
                                        <span className="font-medium line-clamp-1">{place.address}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-tan-100 dark:border-stone-800">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary-browse">
                                            {place.category.replace('_', ' ')}
                                        </span>
                                        <button className="flex items-center gap-2 text-primary-browse font-black text-xs uppercase tracking-widest">
                                            Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                            <span className="material-symbols-outlined text-6xl text-tan-200 dark:text-stone-800 mb-4">search_off</span>
                            <p className="text-secondary-browse font-bold mb-2">No results found.</p>
                            {locationMode === "district" ? (
                                <p className="text-xs text-gray-400">
                                    No places found for district '{localStorage.getItem("selectedDistrict")}'. <br />
                                    Ask admin to import data with 'Force District' enabled.
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400">Try changing your search keywords or location mode.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <nav className="fixed bottom-0 w-full bg-white dark:bg-surface-dark-browse border-t border-tan-200 dark:border-stone-800 z-50">
                <div className="flex items-center justify-around pb-6 pt-3 px-2">
                    <Link href="/home" className="flex flex-1 flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-secondary-browse group-hover:text-primary-browse transition-colors text-2xl">home</span>
                        <span className="text-[10px] font-medium text-secondary-browse group-hover:text-primary-browse transition-colors">Home</span>
                    </Link>
                    <Link href="/browse" className="flex flex-1 flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-primary-browse text-2xl" style={{ fontVariationSettings: "'FILL' 1" } as any}>search</span>
                        <span className="text-[10px] font-bold text-primary-browse">Browse</span>
                    </Link>
                    <button className="flex flex-1 flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-secondary-browse group-hover:text-primary-browse transition-colors text-2xl">calendar_month</span>
                        <span className="text-[10px] font-medium text-secondary-browse group-hover:text-primary-browse transition-colors">Sched</span>
                    </button>
                    <button className="flex flex-1 flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-secondary-browse group-hover:text-primary-browse transition-colors text-2xl">person</span>
                        <span className="text-[10px] font-medium text-secondary-browse group-hover:text-primary-browse transition-colors">Profile</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default function BrowsePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrowseContent />
        </Suspense>
    );
}
