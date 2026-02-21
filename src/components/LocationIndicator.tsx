"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LocationIndicator() {
    const [mode, setMode] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setMode(localStorage.getItem("locationMode"));
        setDistrict(localStorage.getItem("selectedDistrict"));
        setHydrated(true);
    }, []);

    if (!hydrated) return null;

    if (!mode) {
        return (
            <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex flex-col gap-2">
                <p className="text-orange-800 text-xs font-bold uppercase tracking-wider">Location not set</p>
                <div className="flex gap-2">
                    <Link href="/" className="flex-1 bg-white border border-orange-200 text-orange-600 text-center py-2 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors">
                        Allow GPS
                    </Link>
                    <Link href="/select-area" className="flex-1 bg-white border border-orange-200 text-orange-600 text-center py-2 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors">
                        Select District
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-2 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-sm">
                    {mode === "gps" ? "my_location" : "map"}
                </span>
                <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                    {mode === "gps" ? "Using GPS location" : `District: ${district}`}
                </span>
            </div>
            <Link
                href={mode === "gps" ? "/" : "/select-area"}
                className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline"
            >
                Change
            </Link>
        </div>
    );
}
