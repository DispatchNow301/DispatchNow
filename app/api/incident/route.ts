// File path: app/api/incident/route.ts
// Purpose: Incidents API (GET list incidents; POST create incident). POST is restricted to Tier3 (Authority).

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/**
 * Enforce Tier3 (Authority) at the API layer.
 */
async function requireTier3Local(supabase: any, userId: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", userId)
        .single();

    if (error) {
        return {
            ok: false as const,
            status: 500 as const,
            error: "PROFILE_LOOKUP_FAILED",
            message: error.message,
        };
    }

    const tierRaw = (data as any)?.tier;

    // Handle numeric tiers: 1/2/3
    const tierNum =
        typeof tierRaw === "number" ? tierRaw : Number(String(tierRaw ?? "").trim());

    // Handle string tiers: "authority" / "tier3" / "3"
    const tierStr =
        typeof tierRaw === "string" ? tierRaw.trim().toLowerCase() : "";

    const isTier3 =
        (Number.isFinite(tierNum) && tierNum === 3) ||
        tierStr === "authority" ||
        tierStr === "tier3" ||
        tierStr === "3";

    if (!isTier3) {
        return { ok: false as const, status: 403 as const, error: "FORBIDDEN_TIER3_ONLY" };
    }

    return { ok: true as const };
}

export async function GET() {
    const supabase = await createSupabaseServerClient();

    // Auth check: require a logged-in user (GET is allowed for any logged-in tier)
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // Fetch incidents with optional joined report fields (fallback lat/lng if needed)
    const { data, error } = await supabase
        .from("incidents")
        .select(
            "id,title,description,type,status,priority,report_id,latitude,longitude,created_at,updated_at,closed_at,reports(latitude,longitude,type,description)"
        )
        .order("updated_at", { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: "DB_ERROR", message: error.message },
            { status: 500 }
        );
    }

    // Normalize output and ensure lat/lng are valid numbers (or null)
    const items =
        (data ?? []).map((row: any) => {
            const rep = Array.isArray(row.reports) ? row.reports[0] : row.reports;

            const latRaw = row?.latitude ?? rep?.latitude ?? null;
            const lngRaw = row?.longitude ?? rep?.longitude ?? null;

            const latNum = latRaw == null ? NaN : Number(latRaw);
            const lngNum = lngRaw == null ? NaN : Number(lngRaw);

            const lat = Number.isFinite(latNum) ? latNum : null;
            const lng = Number.isFinite(lngNum) ? lngNum : null;

            return {
                id: row.id,
                title: row.title,
                description: row.description,
                status: row.status,
                priority: row.priority,
                reportId: row.report_id,
                lat,
                lng,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                type: row.type,
                closedAt: row.closed_at,
            };
        }) ?? [];

    return NextResponse.json({ data: items }, { status: 200 });
}

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();

    // Auth check: require a logged-in user
    const { data: userRes, error: userErr } = await supabase.auth.getUser();

    // Debug note: you can remove this once verified
    // console.log(userRes);

    if (userErr || !userRes?.user) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // Authorization check: only Tier3 (Authority) can create incidents
    const gate = await requireTier3Local(supabase, userRes.user.id);
    if (!gate.ok) {
        return NextResponse.json(
            { error: gate.error, ...(gate.message ? { message: gate.message } : {}) },
            { status: gate.status }
        );
    }

    // Safely parse JSON body
    const body = await req.json().catch(() => ({}));

    // Allowed incident types (normalize unknown types to "others")
    const ALLOWED_TYPES = new Set([
        "fire",
        "flood",
        "severe_weather",
        "road_closure",
        "hazmat",
        "others",
    ]);

    const type =
        typeof body?.type === "string" && ALLOWED_TYPES.has(body.type)
            ? body.type
            : "others";

    // Allowed status values
    const ALLOWED_STATUS = new Set(["active", "paused", "closed"]);

    const statusRaw =
        typeof body?.status === "string" ? body.status.trim().toLowerCase() : "";

    const status = ALLOWED_STATUS.has(statusRaw) ? statusRaw : "active";

    // Accept either latitude/longitude or lat/lng from client
    const latRaw = body?.latitude ?? body?.lat ?? null;
    const lngRaw = body?.longitude ?? body?.lng ?? null;

    const latNum = latRaw == null ? NaN : Number(latRaw);
    const lngNum = lngRaw == null ? NaN : Number(lngRaw);

    const latitude = Number.isFinite(latNum) ? latNum : null;
    const longitude = Number.isFinite(lngNum) ? lngNum : null;

    // Minimal required fields
    const title =
        typeof body?.title === "string" && body.title.trim().length > 0
            ? body.title.trim()
            : "Untitled Incident";

    const description = typeof body?.description === "string" ? body.description : null;

    const priority =
        typeof body?.priority === "string" && body.priority.trim().length > 0
            ? body.priority.trim()
            : undefined;

    const reportId =
        typeof body?.reportId === "string" && body.reportId.trim().length > 0
            ? body.reportId.trim()
            : undefined;

    // Insert incident
    const { data: incident, error } = await supabase
        .from("incidents")
        .insert({
            title,
            description,
            type,
            status,
            ...(priority ? { priority } : {}),
            ...(reportId ? { report_id: reportId } : {}),
            created_by: userRes.user.id,
            latitude,
            longitude,
            closed_at: status === "closed" ? new Date().toISOString() : null,
        })
        .select("*")
        .single();

    if (error) {
        return NextResponse.json(
            { error: "DB_ERROR", message: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ incident }, { status: 201 });
}