"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LocationIndicator from '@/components/LocationIndicator';

export default function HomePage() {
    const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationMode, setLocationMode] = useState<string | null>(null);

    useEffect(() => {
        const fetchNearby = async () => {
            setLoading(true);
            try {
                const mode = localStorage.getItem("locationMode");
                setLocationMode(mode);

                let url = "";
                if (mode === "gps") {
                    const lat = localStorage.getItem("userLat");
                    const lng = localStorage.getItem("userLng");
                    url = `/api/places/nearby?lat=${lat}&lng=${lng}&limit=3`;
                } else if (mode === "district") {
                    const district = localStorage.getItem("selectedDistrict");
                    url = `/api/places/by-district?district=${district}&limit=3`;
                }

                if (url) {
                    const res = await fetch(url);
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setNearbyPlaces(data.slice(0, 3));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch nearby places", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNearby();
    }, []);

    return (
        <div className="bg-cream-bg font-display text-text-primary min-h-screen flex flex-col antialiased">
            <LocationIndicator />
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-cream-bg shadow-2xl overflow-hidden relative min-h-screen">
                <header className="pt-8 pb-4 px-6 flex items-center justify-between bg-cream-bg sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-brownie-light bg-cover bg-center border-2 border-caramel/30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAzO8kpd3YW85xcA9K_z7R1FuIYn-VabMlJw_t0w-Z6Dnk5dRGM5S05jJTlbbt_Yz6E0s7mm3FzJYPkLtOGJTP2_C0ks_cQSp2WmH3Xba5E9avw4bdAauIix7275J97Kw1tRNmMuLHx1dROmHl1es4i9blnhfqZthiSJIV1_iTh9-Jj1Cr20Y8AribcZ0VOMKF3aAYWcFaXHsuZrOhUA08rBV3hrBncwN5_tdYgIDKpLbUC5dVg-0uBP2Dc6f7bO63ues4nHBMo-WR3')" }}></div>
                            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-caramel rounded-full border-2 border-cream-bg"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-text-secondary font-medium">Good Morning,</span>
                            <h1 className="text-lg font-bold text-text-primary leading-tight">Sarah 👋</h1>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
                    <div className="mt-4 mb-8">
                        <Link href="/emergency" className="block group relative overflow-hidden rounded-3xl bg-emergency-red shadow-lg shadow-emergency-red/30 transition-all active:scale-[0.98]">
                            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                            <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-black/5 blur-xl"></div>
                            <div className="relative flex flex-col p-6 text-white">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-[28px]">medical_services</span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Emergency Help</h2>
                                <p className="mt-1 mb-6 text-white/90 text-sm font-medium opacity-90 leading-relaxed max-w-[85%]">
                                    Find the nearest open clinic immediately.
                                </p>
                                <div className="w-full rounded-2xl bg-white py-3.5 text-center text-sm font-bold text-emergency-red shadow-sm transition-transform flex items-center justify-center gap-2">
                                    <span>Get Help Now</span>
                                    <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-text-primary font-bold text-lg mb-4">What are you looking for?</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/browse?category=clinic" className="flex flex-col gap-3 rounded-3xl bg-tan-card border border-brownie-light/20 p-5 shadow-sm hover:bg-tan-hover transition-all active:scale-95 group">
                                <div className="h-12 w-12 rounded-full bg-white text-brownie-medium flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[26px]">local_hospital</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary text-[15px]">Pet Clinics</h4>
                                    <p className="text-xs text-text-secondary mt-1">General care</p>
                                </div>
                            </Link>
                            <Link href="/browse?category=veterinarian" className="flex flex-col gap-3 rounded-3xl bg-tan-card border border-brownie-light/20 p-5 shadow-sm hover:bg-tan-hover transition-all active:scale-95 group">
                                <div className="h-12 w-12 rounded-full bg-white text-brownie-medium flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[26px]">stethoscope</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary text-[15px]">Veterinarians</h4>
                                    <p className="text-xs text-text-secondary mt-1">Specialists</p>
                                </div>
                            </Link>
                            <Link href="/browse?category=pet_shop" className="col-span-2 flex items-center gap-4 rounded-3xl bg-tan-card border border-brownie-light/20 p-5 shadow-sm hover:bg-tan-hover transition-all active:scale-95 group">
                                <div className="h-12 w-12 rounded-full bg-white text-brownie-medium flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[26px]">storefront</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text-primary">Pet Shops</h4>
                                    <p className="text-xs text-text-secondary mt-1">Food, toys & accessories</p>
                                </div>
                                <span className="material-symbols-outlined text-brownie-light group-hover:text-brownie-medium transition-colors">chevron_right</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-text-primary font-bold text-lg mb-4">Nearby Services</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="h-32 w-full rounded-3xl bg-brownie-light animate-pulse flex items-center justify-center text-text-secondary text-sm">Finding services...</div>
                            ) : nearbyPlaces.length > 0 ? (
                                nearbyPlaces.map((place) => (
                                    <Link key={place.id} href={`/clinic/${place.id}`} className="block h-32 w-full rounded-3xl bg-brownie-light relative overflow-hidden group border border-brownie-light/30">
                                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url('${place.imageUrl || "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&q=80"}')` }}></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-brownie-dark/60 via-brownie-dark/20 to-transparent group-hover:bg-brownie-dark/10 transition-colors"></div>
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-white/50">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                                                <span className="text-xs font-bold text-text-primary truncate max-w-[150px]">{place.name}</span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 left-3 text-white flex justify-between w-full pr-6">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" } as any}>star</span>
                                                <span className="text-xs font-bold">{place.rating}</span>
                                            </div>
                                            {place.distance && place.distance !== Infinity && (
                                                <span className="text-[10px] uppercase font-black tracking-widest">{place.distance.toFixed(1)} km</span>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="h-32 w-full rounded-3xl bg-brownie-light flex items-center justify-center text-text-secondary text-sm italic">
                                    {locationMode ? "No services found in this area." : "Please set your location to see nearby services."}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <nav className="fixed bottom-0 left-0 right-0 bg-cream-bg/90 backdrop-blur-md border-t border-brownie-light/20 px-6 pb-6 pt-3 flex justify-between items-center z-20">
                    <Link href="/home" className="flex flex-col items-center gap-1 group w-16">
                        <div className="flex h-8 items-center justify-center text-caramel transition-colors">
                            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" } as any}>home</span>
                        </div>
                        <span className="text-[10px] font-bold text-caramel">Home</span>
                    </Link>
                    <Link href="/browse" className="flex flex-col items-center gap-1 group w-16">
                        <div className="flex h-8 items-center justify-center text-brownie-accent group-hover:text-brownie-dark transition-colors">
                            <span className="material-symbols-outlined text-[28px]">search</span>
                        </div>
                        <span className="text-[10px] font-medium text-brownie-accent group-hover:text-brownie-dark">Browse</span>
                    </Link>
                    <button className="flex flex-col items-center gap-1 group w-16">
                        <div className="flex h-8 items-center justify-center text-brownie-accent group-hover:text-brownie-dark transition-colors">
                            <span className="material-symbols-outlined text-[28px]">calendar_month</span>
                        </div>
                        <span className="text-[10px] font-medium text-brownie-accent group-hover:text-brownie-dark">Sched</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group w-16">
                        <div className="flex h-8 items-center justify-center text-brownie-accent group-hover:text-brownie-dark transition-colors">
                            <span className="material-symbols-outlined text-[28px]">account_circle</span>
                        </div>
                        <span className="text-[10px] font-medium text-brownie-accent group-hover:text-brownie-dark">Profile</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
