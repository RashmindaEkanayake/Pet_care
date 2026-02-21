"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SplashPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGPSMode = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.locationMode = "gps";
        localStorage.userLat = position.coords.latitude.toString();
        localStorage.userLng = position.coords.longitude.toString();
        localStorage.removeItem("selectedDistrict");
        router.push("/home");
      },
      (err) => {
        setError("Permission denied or location unavailable. Please try again or select district manually.");
        setLoading(false);
      }
    );
  };

  const handleDistrictMode = () => {
    router.push("/select-area");
  };

  return (
    <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-200 mb-8 transform rotate-3">
          <span className="material-symbols-outlined text-white text-5xl">pets</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Pet Rescue
        </h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed px-4">
          Helping pets get the help they need — fast.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="w-full space-y-4">
          <button
            onClick={handleGPSMode}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                <span className="material-symbols-outlined">my_location</span>
                Allow Location Access
              </>
            )}
          </button>

          <button
            onClick={handleDistrictMode}
            className="w-full bg-white hover:bg-gray-50 active:scale-95 text-gray-700 py-4 rounded-2xl font-bold text-lg border-2 border-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">map</span>
            Skip GPS – Select District
          </button>
        </div>

        <p className="mt-8 text-gray-400 text-sm px-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
