// usage:
// - My reports (default): GET /api/reports?status=unverified
// - Global query (search/pagination): GET /api/reports?search=&status=&type=&limit=&offset=
// - Create report: POST /api/reports

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ReportType, ReportStatus } from "@/lib/types";

function isTruthy(v: string | null) {
    if (!v) return false;
    const s = v.trim().toLowerCase();
    return s === "1" || s === "true" || s === "yes" || s === "y";
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // If any of these exist, we treat it as "global query" mode
        const hasGlobalQuerySignals =
            searchParams.has("search") ||
            searchParams.has("limit") ||
            searchParams.has("offset") ||
            searchParams.has("type");

        // Optional manual override: /api/reports?mine=true
        const mine = isTruthy(searchParams.get("mine"));

        // -----------------------------
        // Mode A: "My reports" (SCRUM-39 behavior)
        // Default unless global signals are present
        // -----------------------------
        if (mine || !hasGlobalQuerySignals) {
            const status = (searchParams.get("status") ?? "").trim();

            const supabase = await createSupabaseServerClient();

            // Require login because reports.user_id is NOT NULL
            const { data: authData, error: authError } = await supabase.auth.getUser();
            const user = authData?.user;

            if (authError || !user) {
                return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
            }

            let query = supabase
                .from("reports")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (status) {
                query = query.eq("status", status);
            }

            const { data, error } = await query;

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            // Return both shapes so old/new callers both work
            return NextResponse.json(
                {
                    reports: data ?? [],
                    data: data ?? [],
                },
                { status: 200 }
            );
        }

        // -----------------------------
        // Mode B: Global query (master behavior)
        // -----------------------------
        const search = searchParams.get("search") ?? "";
        const status = searchParams.get("status") as ReportStatus | null;
        const type = searchParams.get("type") as ReportType | null;

        const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
        const offset = parseInt(searchParams.get("offset") ?? "0");

        const supabase = await createSupabaseServerClient();

        let query = supabase
            .from("reports")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (search.trim()) {
            query = query.ilike("description", `%${search.trim()}%`);
        }

        if (status && Object.values(ReportStatus).includes(status)) {
            query = query.eq("status", status);
        }

        if (type && Object.values(ReportType).includes(type)) {
            query = query.eq("type", type);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error(error);
            return NextResponse.json(ApiErrors.SERVER_ERROR, {
                status: ApiErrors.SERVER_ERROR.code,
            });
        }

        // Return both shapes so old/new callers both work
        return NextResponse.json(
            {
                data: data ?? [],
                reports: data ?? [],
                meta: {
                    total: count ?? 0,
                    limit,
                    offset,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(ApiErrors.SERVER_ERROR, {
            status: ApiErrors.SERVER_ERROR.code,
        });
    }
}

// creates the POST functionality
export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));

        const type = (body as any)?.type;
        const description = (body as any)?.description;

        const latitude = (body as any)?.latitude;
        const longitude = (body as any)?.longitude;

        // Validate required fields (reports.type is NOT NULL in schema)
        if (!type || typeof type !== "string" || type.trim() === "") {
            return NextResponse.json({ error: "Type is required" }, { status: 400 });
        }

        const supabase = await createSupabaseServerClient();

        // Require login because reports.user_id is NOT NULL and references profiles(id)
        const { data: authData, error: authError } = await supabase.auth.getUser();
        const user = authData?.user;

        if (authError || !user) {
            return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        }

        // Inputs type, location, and description in the Supabase "reports" table
        const { data, error } = await supabase
            .from("reports")
            .insert({
                type: type.trim(),
                description: typeof description === "string" ? description : null,
                latitude: Number.isFinite(Number(latitude)) ? Number(latitude) : null,
                longitude: Number.isFinite(Number(longitude)) ? Number(longitude) : null,
                status: "unverified",
                user_id: user.id,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Return both shapes so callers won't break
        return NextResponse.json({ report: data, data }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(ApiErrors.SERVER_ERROR, {
            status: ApiErrors.SERVER_ERROR.code,
        });
    }
}