import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { IncidentStatus, Tier } from "@/lib/types";
import { getById, updateById } from "@/lib/supabase/utils";

interface Incident {
    id: string;
    title: string;
    description?: string | null;
    status: IncidentStatus | string;
    priority: string;
    report_id?: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at?: string | null;
}

interface Profile {
    id: string;
    tier: Tier;
}

async function checkAuthority(userId: string): Promise<boolean> {
    const profile = await getById<Profile>("profiles", userId);
    return profile?.tier === Tier.Authority;
}

// usage: POST /api/incident/[id]/close  (or your actual route path)
// body: { description?: string }
// only tier 3 (Authority) can close incidents
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const incidentId = params.id;

        const body = await req.json().catch(() => ({}));
        const description = (body as any)?.description;

        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(ApiErrors.UNAUTHORIZED, {
                status: ApiErrors.UNAUTHORIZED.code,
            });
        }

        // Check if user is Authority (tier 3)
        const isAuthority = await checkAuthority(user.id);
        if (!isAuthority) {
            return NextResponse.json(ApiErrors.UNAUTHORIZED, {
                status: ApiErrors.UNAUTHORIZED.code,
            });
        }

        // Verify incident exists (keep master behavior)
        const existing = await getById<Incident>("incidents", incidentId);
        if (!existing) {
            return NextResponse.json({ error: "Incident not found" }, { status: 404 });
        }

        // Cannot close a closed incident (support both string "CLOSED" + enum)
        const existingStatusUpper = String((existing as any)?.status ?? "").toUpperCase();
        const closedEnumUpper = String((IncidentStatus as any).Closed ?? "CLOSED").toUpperCase();
        if (existingStatusUpper === "CLOSED" || existingStatusUpper === closedEnumUpper) {
            return NextResponse.json({ error: "Incident is already closed" }, { status: 400 });
        }

        const nextStatus = (IncidentStatus as any).Closed ?? "CLOSED";

        // Build update object (merged)
        const updates: Partial<Incident> = {
            status: nextStatus,
            closed_at: new Date().toISOString(),
        };

        if (description !== undefined) {
            updates.description = typeof description === "string" ? description : null;
        }

        // Update incident (preferred helper)
        const updated = await updateById<Incident>("incidents", incidentId, updates);

        if (!updated) {
            return NextResponse.json(ApiErrors.SERVER_ERROR, {
                status: ApiErrors.SERVER_ERROR.code,
            });
        }

        // Return both shapes to avoid breaking either caller
        return NextResponse.json({ data: updated, incident: updated }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(ApiErrors.SERVER_ERROR, {
            status: ApiErrors.SERVER_ERROR.code,
        });
    }
}