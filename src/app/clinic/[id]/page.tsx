"use client";

import Link from 'next/link';
import { useEffect, useState, use } from 'react';

export default function ClinicDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const { id } = params;
    const [place, setPlace] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const res = await fetch(`/api/places/${id}`);
                const data = await res.json();
                setPlace(data);
            } catch (error) {
                console.error("Failed to fetch place", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [id]);

    const handleCall = () => {
        if (place?.phone) {
            window.location.href = `tel:${place.phone.replace(/\s/g, '')}`;
        }
    };

    const handleDirections = () => {
        if (place?.mapsUrl) {
            window.open(place.mapsUrl, '_blank');
        } else if (place) {
            const query = encodeURIComponent(`${place.name}, ${place.address}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="bg-background-light-details dark:bg-background-dark-details min-h-screen flex items-center justify-center text-text-main-details italic">
                Loading details...
            </div>
        );
    }

    if (!place) {
        return (
            <div className="bg-background-light-details dark:bg-background-dark-details min-h-screen flex flex-col items-center justify-center text-text-main-details gap-4">
                <span className="text-xl font-bold">Clinic Not Found</span>
                <Link href="/browse" className="text-primary-details underline font-medium">Back to Browse</Link>
            </div>
        );
    }

    return (
        <div className="bg-background-light-details dark:bg-background-dark-details font-display text-text-main-details antialiased pb-28 min-h-screen">
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-background-dark-details/90 backdrop-blur-md border-b border-[#eaddcf] dark:border-white/10">
                <Link href="/browse" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm border border-[#f0e6dc] dark:border-transparent text-text-main-details dark:text-white hover:bg-[#fdf8f3] transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm border border-[#f0e6dc] dark:border-transparent text-text-main-details dark:text-white hover:bg-[#fdf8f3] transition-colors">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm border border-[#f0e6dc] dark:border-transparent text-text-main-details dark:text-white hover:bg-[#fdf8f3] transition-colors">
                        <span className="material-symbols-outlined">favorite_border</span>
                    </button>
                </div>
            </div>

            <div className="relative w-full h-72 md:h-96 overflow-hidden">
                <img alt={place.name} className="w-full h-full object-cover" src={place.imageUrl || "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&q=80"} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/60 to-transparent"></div>
            </div>

            <main className="px-4 -mt-6 relative z-10 flex flex-col gap-6">
                <div className="bg-white dark:bg-[#3d251e] rounded-2xl p-5 shadow-lg shadow-[#8B5A2B]/5 border border-[#f0e6dc] dark:border-white/5">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-bold text-text-main-details dark:text-[#f3e5d8] leading-tight">{place.name}</h1>
                        <span className="bg-[#e6f4ea] text-[#137333] dark:bg-[#137333]/20 dark:text-[#8ab4f8] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                            {place.openingStatus || "Check Status"}
                        </span>
                    </div>
                    <p className="text-text-secondary-details dark:text-[#d4c5b5] text-sm mb-4 capitalize">{place.category.replace('_', ' ')}</p>
                    <div className="flex items-center gap-3 pb-4 border-b border-[#f0e6dc] dark:border-white/10">
                        <div className="flex items-center gap-1">
                            <span className="text-text-main-details dark:text-white text-lg font-black">{place.rating || "N/A"}</span>
                            <div className="flex text-[#D4A373]">
                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" } as any}>star</span>
                            </div>
                        </div>
                        <span className="text-text-secondary-details text-sm dark:text-[#a8988a] underline decoration-dotted decoration-text-secondary-details/50 underline-offset-4 cursor-pointer">{place.reviewCount || 0} reviews</span>
                    </div>
                    <div className="flex justify-between pt-4">
                        <button className="flex flex-col items-center gap-1 group w-1/4">
                            <div className="w-12 h-12 rounded-full bg-[#fdf8f3] dark:bg-white/5 border border-[#eaddcf] dark:border-transparent flex items-center justify-center text-primary-details dark:text-[#D4A373] group-hover:bg-primary-details group-hover:text-white group-hover:border-primary transition-all">
                                <span className="material-symbols-outlined">language</span>
                            </div>
                            <span className="text-xs font-medium text-text-secondary-details dark:text-[#d4c5b5]">Website</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group w-1/4">
                            <div className="w-12 h-12 rounded-full bg-[#fdf8f3] dark:bg-white/5 border border-[#eaddcf] dark:border-transparent flex items-center justify-center text-primary-details dark:text-[#D4A373] group-hover:bg-primary-details group-hover:text-white group-hover:border-primary transition-all">
                                <span className="material-symbols-outlined">chat</span>
                            </div>
                            <span className="text-xs font-medium text-text-secondary-details dark:text-[#d4c5b5]">Message</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group w-1/4">
                            <div className="w-12 h-12 rounded-full bg-[#fdf8f3] dark:bg-white/5 border border-[#eaddcf] dark:border-transparent flex items-center justify-center text-primary-details dark:text-[#D4A373] group-hover:bg-primary-details group-hover:text-white group-hover:border-primary transition-all">
                                <span className="material-symbols-outlined">add_a_photo</span>
                            </div>
                            <span className="text-xs font-medium text-text-secondary-details dark:text-[#d4c5b5]">Add Photo</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group w-1/4">
                            <div className="w-12 h-12 rounded-full bg-[#fdf8f3] dark:bg-white/5 border border-[#eaddcf] dark:border-transparent flex items-center justify-center text-primary-details dark:text-[#D4A373] group-hover:bg-primary-details group-hover:text-white group-hover:border-primary transition-all">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </div>
                            <span className="text-xs font-medium text-text-secondary-details dark:text-[#d4c5b5]">More</span>
                        </button>
                    </div>
                </div>

                {place.reviewSnippet && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 shadow-sm border border-amber-100 dark:border-amber-800/30">
                        <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-600">verified</span>
                            Why Choose This Place
                        </h2>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute -top-1 -left-1 text-amber-200 dark:text-amber-800/50 text-4xl -z-10 rotate-180">format_quote</span>
                            <p className="text-amber-800 dark:text-amber-200 text-sm italic leading-relaxed pl-4 font-medium">
                                "{place.reviewSnippet}"
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-[#3d251e] rounded-2xl p-5 shadow-sm border border-[#f0e6dc] dark:border-white/5">
                    <h2 className="text-lg font-bold text-text-main-details dark:text-[#f3e5d8] mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-details">location_on</span>
                        Location
                    </h2>
                    <p className="text-text-main-details dark:text-[#d4c5b5] text-sm mb-4">{place.address}</p>
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[#f3e5d8] border border-[#eaddcf] dark:border-white/10">
                        <div className="absolute inset-0 bg-[#f3e5d8]"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full mb-1">
                            <span className="material-symbols-outlined text-4xl text-[#8B5A2B] drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" } as any}>location_on</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#3d251e] rounded-2xl p-5 shadow-sm border border-[#f0e6dc] dark:border-white/5">
                    <h2 className="text-lg font-bold text-text-main-details dark:text-[#f3e5d8] mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-details">schedule</span>
                        Information
                    </h2>
                    <div className="space-y-3">
                        {place.closingInfo && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-text-main-details dark:text-[#f3e5d8] w-24">Status</span>
                                <span className="text-text-secondary-details dark:text-[#a8988a]">{place.closingInfo}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-text-main-details dark:text-[#f3e5d8] w-24">Phone</span>
                            <span className="text-text-secondary-details dark:text-[#a8988a]">{place.phone || "Not available"}</span>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2C1810] border-t border-[#f0e6dc] dark:border-white/10 px-4 py-4 z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(44,24,16,0.08)]">
                <div className="flex gap-3 max-w-lg mx-auto">
                    <button
                        onClick={handleDirections}
                        className="flex-1 bg-white dark:bg-transparent border-2 border-primary-details text-primary-details dark:text-[#D4A373] dark:border-[#D4A373] hover:bg-[#fdf8f3] h-12 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">directions</span>
                        Get Directions
                    </button>
                    <button
                        onClick={handleCall}
                        className="flex-[1.5] bg-primary-details hover:bg-[#724a23] text-white h-12 rounded-xl font-bold text-base shadow-lg shadow-[#8B5A2B]/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" } as any}>call</span>
                        Call Now
                    </button>
                </div>
            </div>
        </div>
    );
}
