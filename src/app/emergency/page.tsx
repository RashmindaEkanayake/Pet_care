"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LocationIndicator from '@/components/LocationIndicator';

export default function EmergencyPage() {
    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationMode, setLocationMode] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmergency = async () => {
            setLoading(true);
            try {
                const mode = localStorage.getItem("locationMode");
                setLocationMode(mode);

                let url = "";
                if (mode === "gps") {
                    const lat = localStorage.getItem("userLat");
                    const lng = localStorage.getItem("userLng");
                    url = `/api/places/emergency?lat=${lat}&lng=${lng}&radius_km=20`;
                } else if (mode === "district") {
                    const district = localStorage.getItem("selectedDistrict");
                    url = `/api/emergency/by-district?district=${district}`;
                }

                if (url) {
                    const res = await fetch(url);
                    const data = await res.json();
                    setPlaces(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to fetch emergency places", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmergency();
    }, []);

    const handleCall = (phone: string) => {
        if (!phone) return;
        window.location.href = `tel:${phone.replace(/\s/g, '')}`;
    };

    const handleDirections = (place: any) => {
        if (place.mapsUrl) {
            window.open(place.mapsUrl, '_blank');
        } else {
            const query = encodeURIComponent(`${place.name}, ${place.address}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-brownie-900 dark:text-brownie-100 font-display antialiased flex flex-col min-h-screen">
            <LocationIndicator />
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-brownie-200 dark:border-brownie-800">
                <div className="flex items-center justify-between p-4 h-16">
                    <Link href="/home" className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-brownie-100 dark:hover:bg-brownie-800 transition-colors text-brownie-800 dark:text-brownie-100">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-center flex-1 pr-10 truncate text-brownie-900 dark:text-brownie-50">Emergency Help Nearby</h1>
                    <div className="w-2"></div>
                </div>
                <div className="px-4 pb-3 pt-1 flex items-center justify-between border-t border-brownie-50 dark:border-brownie-900/50">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brownie-400">
                        <span className="material-symbols-outlined text-sm">sort</span>
                        <span>Sorted by: Open status & proximity</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-32">
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-800/50 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="bg-red-500 p-2.5 rounded-xl text-white shadow-lg shadow-red-200 shrink-0">
                        <span className="material-symbols-outlined text-2xl">emergency</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-red-800 dark:text-red-200 uppercase tracking-tight">Critical condition?</h3>
                        <p className="text-xs text-red-700/80 dark:text-red-300/70 mt-1 font-medium leading-relaxed">Find the nearest clinic immediately or call an ambulance if your pet is in danger.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-red-500 font-black animate-pulse uppercase tracking-widest text-xs">Scanning for help...</p>
                    </div>
                ) : places.length > 0 ? (
                    places.map((place) => (
                        <div key={place.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-warm dark:border-brownie-700 overflow-hidden flex flex-col group active:scale-[0.99] transition-all">
                            <Link href={`/clinic/${place.id}`} className="relative h-44 w-full bg-brownie-100">
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${place.imageUrl || "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&q=80"}')` }}></div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-600/90 text-white text-[10px] font-black shadow-lg backdrop-blur-sm uppercase tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                        {place.openingStatus || "Open Now"}
                                    </span>
                                    {place.distance && place.distance !== Infinity && (
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-brownie-900/80 text-brownie-50 text-[10px] font-black backdrop-blur-md shadow-lg uppercase tracking-wider">
                                            {place.distance.toFixed(1)} km
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-black text-brownie-900 dark:text-brownie-50 leading-tight">{place.name}</h2>
                                        <p className="text-xs text-brownie-500 dark:text-brownie-400 mt-2 line-clamp-1 font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            {place.address}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0 ml-4">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <span className="text-base font-black">{place.rating || "N/A"}</span>
                                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" } as any}>star</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-brownie-400 uppercase tracking-widest">({place.reviewCount || 0} reviews)</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleCall(place.phone)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-red-100"
                                    >
                                        <span className="material-symbols-outlined text-xl">call</span>
                                        Call Store
                                    </button>
                                    <button
                                        onClick={() => handleDirections(place)}
                                        className="flex-1 bg-brownie-800 hover:bg-brownie-900 active:scale-95 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-brownie-200"
                                    >
                                        <span className="material-symbols-outlined text-xl">directions</span>
                                        Directions
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                        <span className="material-symbols-outlined text-6xl text-brownie-100 dark:text-brownie-800 mb-4">medical_services</span>
                        <p className="text-brownie-500 font-bold mb-2 uppercase tracking-widest text-sm">No emergency help found.</p>
                        {locationMode === "district" ? (
                            <p className="text-xs text-brownie-400">
                                No clinics found for district '{localStorage.getItem("selectedDistrict")}'. <br />
                                Try importing data with 'Force District' for this area.
                            </p>
                        ) : (
                            <p className="text-xs text-brownie-400">Try adjusting your location or checking regular clinics.</p>
                        )}
                    </div>
                )}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 border-t border-brownie-200 dark:border-brownie-800 bg-surface-light dark:bg-surface-dark px-4 pb-6 pt-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-end h-14 pb-2">
                    <Link href="/home" className="flex flex-1 flex-col items-center justify-end gap-1 text-brownie-400 dark:text-brownie-500 hover:text-brownie-800 dark:hover:text-brownie-300 transition-colors group">
                        <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">home</span>
                        <span className="text-[10px] font-medium tracking-wide">Home</span>
                    </Link>
                    <Link href="/emergency" className="flex flex-1 flex-col items-center justify-end gap-1 text-brownie-800 dark:text-brownie-200">
                        <div className="bg-brownie-100 dark:bg-brownie-800/40 px-4 py-0.5 rounded-full mb-0.5 border border-brownie-200 dark:border-brownie-700">
                            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" } as any}>medical_services</span>
                        </div>
                        <span className="text-[10px] font-bold tracking-wide">Emergency</span>
                    </Link>
                    <Link href="/browse" className="flex flex-1 flex-col items-center justify-end gap-1 text-brownie-400 dark:text-brownie-500 hover:text-brownie-800 dark:hover:text-brownie-300 transition-colors group">
                        <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">storefront</span>
                        <span className="text-[10px] font-medium tracking-wide">Clinics</span>
                    </Link>
                    <button className="flex flex-1 flex-col items-center justify-end gap-1 text-brownie-400 dark:text-brownie-500 hover:text-brownie-800 dark:hover:text-brownie-300 transition-colors group">
                        <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">person</span>
                        <span className="text-[10px] font-medium tracking-wide">Profile</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
