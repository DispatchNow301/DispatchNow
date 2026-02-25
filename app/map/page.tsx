// File path: app/map/page.tsx
// Purpose: Map page (server) - compute user tier from Supabase cookie session, then render client map wrapper

import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import MapClient from "./MapClient";

export default async function MapPage() {
    const supabase = await createSupabaseServerClient();

    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes?.user?.id ?? null;

    let isTier3 = false;

    if (userId) {
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("tier")
            .eq("id", userId)
            .single();

        if (!error && profile?.tier === 3) {
            isTier3 = true;
        }
    }

    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

    return <MapClient googleMapsApiKey={googleMapsApiKey} isTier3={isTier3} />;
}