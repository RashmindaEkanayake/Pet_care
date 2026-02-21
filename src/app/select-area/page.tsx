"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SRI_LANKA_DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
    "Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

export default function SelectAreaPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState("");

    const filteredDistricts = SRI_LANKA_DISTRICTS.filter(d =>
        d.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContinue = () => {
        if (!selected) return;
        localStorage.locationMode = "district";
        localStorage.selectedDistrict = selected.trim();
        localStorage.removeItem("userLat");
        localStorage.removeItem("userLng");
        router.push("/home");
    };

    return (
        <div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col antialiased">
            <header className="bg-white px-4 pt-12 pb-6 border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-md mx-auto w-full">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/" className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <h1 className="text-2xl font-black tracking-tight">Select your district</h1>
                    </div>
                    <p className="text-gray-500 font-medium mb-6">We’ll show clinics and pet shops in your selected area.</p>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-orange-500 transition-colors">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search district..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-11 pr-4 py-4 bg-gray-100 border-2 border-transparent focus:border-orange-500/20 focus:bg-white focus:ring-0 rounded-2xl text-gray-900 placeholder-gray-400 transition-all font-medium"
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-md mx-auto w-full space-y-2">
                    {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((district) => (
                            <button
                                key={district}
                                onClick={() => setSelected(district)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border-2 ${selected === district
                                    ? "bg-orange-50 border-orange-500 shadow-sm"
                                    : "bg-white border-transparent hover:border-gray-200"
                                    }`}
                            >
                                <span className={`font-bold text-lg ${selected === district ? "text-orange-600" : "text-gray-800"}`}>
                                    {district}
                                </span>
                                {selected === district && (
                                    <span className="material-symbols-outlined text-orange-500 font-bold">check_circle</span>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-gray-400 font-medium">No districts found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-white px-4 py-8 border-t border-gray-100 sticky bottom-0 z-50">
                <div className="max-w-md mx-auto w-full flex flex-col gap-4">
                    <button
                        onClick={handleContinue}
                        disabled={!selected}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg ${selected
                            ? "bg-orange-500 text-white shadow-orange-200 active:scale-95"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                            }`}
                    >
                        Continue
                    </button>
                    <Link href="/" className="text-center text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase tracking-widest text-xs">
                        Use GPS instead
                    </Link>
                </div>
            </footer>
        </div>
    );
}
