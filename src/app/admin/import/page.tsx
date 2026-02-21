"use client";

import { useState } from "react";

const SRI_LANKA_DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
    "Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

export default function AdminImportPage() {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<{ imported_count: number; updated_count: number; skipped_count: number } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus("Uploading and processing CSV...");
        setStats(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch("/api/admin/import", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setStatus("Import successful!");
                setStats(result.stats);
            } else {
                setStatus(`Error: ${result.error || "Unknown error"}`);
            }
        } catch (error) {
            setStatus("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">CSV Import Dashboard</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        Select CSV File
                    </label>
                    <input
                        type="file"
                        name="csvFile"
                        accept=".csv"
                        required
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    />
                    <p className="mt-2 text-xs text-gray-400">petshop_detailes.csv supported</p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Force District (Optional)
                    </label>
                    <select
                        name="district"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    >
                        <option value="">Auto-detect from address</option>
                        {SRI_LANKA_DISTRICTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">If selected, all records in this file will be assigned to this district.</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Processing..." : "Start Import"}
                </button>
            </form>

            {status && (
                <div className={`mt-8 p-4 rounded-lg ${status.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                    <p className="font-semibold">{status}</p>
                    {stats && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded shadow-sm border border-green-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Imported</p>
                                <p className="text-2xl font-bold">{stats.imported_count}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm border border-blue-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Updated</p>
                                <p className="text-2xl font-bold">{stats.updated_count}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm border border-orange-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Skipped</p>
                                <p className="text-2xl font-bold">{stats.skipped_count}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
