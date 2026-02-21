"use client";

import { useState } from "react";

const SRI_LANKA_DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
    "Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

export default function DistrictFixPage() {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus("Applying district fixes...");

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch("/api/admin/district-fix", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setStatus("Fix complete!");
                setStats(result.stats);
            } else {
                setStatus(`Error: ${result.error}`);
            }
        } catch (error) {
            setStatus("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
            <h1 className="text-3xl font-bold mb-2">Bulk District Fix</h1>
            <p className="text-gray-500 mb-8 text-sm">Update existing records to match a specific district using a CSV for identification.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Target District</label>
                    <select name="district" required className="w-full p-3 border border-gray-300 rounded-lg">
                        <option value="">-- Choose District --</option>
                        {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input type="file" name="csvFile" accept=".csv" required className="w-full" />
                    <p className="mt-2 text-xs text-gray-400">Upload the CSV containing these records</p>
                </div>

                <button
                    disabled={loading}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                    {loading ? "Processing..." : "Apply District to Matching Records"}
                </button>
            </form>

            {status && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold">{status}</p>
                    {stats && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded shadow-sm">
                                <p className="text-xs uppercase font-bold text-gray-400">Updated</p>
                                <p className="text-2xl font-bold text-green-600">{stats.updated_count}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm">
                                <p className="text-xs uppercase font-bold text-gray-400">Not Found</p>
                                <p className="text-2xl font-bold text-red-600">{stats.not_found_count}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
