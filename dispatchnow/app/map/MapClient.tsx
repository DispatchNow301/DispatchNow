"use client";
// File path: app/map/MapClient.tsx
// Purpose: Client wrapper to load Google Maps script + handle responsive layout, then pass isTier3 to pages

import { useEffect, useState } from "react";
import Script from "next/script";
import DesktopMapPage from "./DesktopMapPage";
import MobileMapPage from "./MobileMapPage";

export default function MapClient({
    googleMapsApiKey,
    isTier3,
}: {
    googleMapsApiKey: string;
    isTier3: boolean;
}) {
    const [isMobile, setIsMobile] = useState(false);
    const [mapsReady, setMapsReady] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        if (w.google?.maps) setMapsReady(true);
    }, []);

    if (!googleMapsApiKey) {
        return (
            <div className="min-h-screen p-6">
                <h1 className="text-xl font-semibold">Map</h1>
                <p className="mt-3 text-sm">
                    Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
                    googleMapsApiKey
                )}&v=weekly`}
                strategy="afterInteractive"
                onLoad={() => setMapsReady(true)}
            />

            {isMobile ? (
                <MobileMapPage mapsReady={mapsReady} isTier3={isTier3} />
            ) : (
                <DesktopMapPage mapsReady={mapsReady} isTier3={isTier3} />
            )}
        </div>
    );
}