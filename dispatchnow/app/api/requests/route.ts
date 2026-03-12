// usage:
// - GET /api/requests?search=&status=&resource_type=&limit=&offset=
// - POST /api/requests

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ApiErrors } from "@/lib/api-errors";
import { ResourceType } from "@/lib/types";

// -----------------------------
// GET: list/search/filter/paginate requests (master behavior)
// -----------------------------
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") ?? "";
        const status = searchParams.get("status") ?? "";
        const resourceType = searchParams.get("resource_type") as ResourceType | null;

        const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
        const offset = parseInt(searchParams.get("offset") ?? "0");

        const supabase = await createSupabaseServerClient();

        let query = supabase
            .from("requests")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (search.trim()) {
            query = query.ilike("description", `%${search.trim()}%`);
        }

        if (status.trim()) {
            query = query.eq("status", status.trim());
        }

        if (resourceType && Object.values(ResourceType).includes(resourceType)) {
            query = query.eq("resource_type", resourceType);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error(error);
            return NextResponse.json(ApiErrors.SERVER_ERROR, {
                status: ApiErrors.SERVER_ERROR.code,
            });
        }

        return NextResponse.json({
            data,
            meta: { total: count ?? 0, limit, offset },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(ApiErrors.SERVER_ERROR, {
            status: ApiErrors.SERVER_ERROR.code,
        });
    }
}

// -----------------------------
// POST: create a request (SCRUM-39 behavior)
// -----------------------------
export async function POST(req: NextRequest) {
    // read the request sent by the client
    const body = await req.json().catch(() => ({}));

    // extracts data (necessary fields)
    let requesterId = (body as any).requester_id;
    const incidentId = (body as any).incident_id;
    const resourceName = (body as any).resource_name;
    const quantityRaw = (body as any).quantity;
    const location = (body as any).location;
    const notes = (body as any).notes;

    // connects to the Supabase server
    const supabase = await createSupabaseServerClient();

    // optional: if requester_id not provided, try current auth user
    if (!requesterId) {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.id) requesterId = authData.user.id;
    }

    const quantity = Number(quantityRaw);

    // following if statements check that all fields (except notes)
    // are provided in a valid format
    if (!requesterId) {
        return NextResponse.json({ error: "Requester ID is required" }, { status: 400 });
    }
    if (!incidentId) {
        return NextResponse.json({ error: "Incident ID is required" }, { status: 400 });
    }
    if (!resourceName || typeof resourceName !== "string" || resourceName.trim() === "") {
        return NextResponse.json({ error: "Resource name is required" }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
    }
    if (!location || typeof location !== "string" || location.trim() === "") {
        return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    // checks to see that the provided incident id exists within Supabase
    const { data: incident, error: incidentError } = await supabase
        .from("incidents")
        .select("status")
        .eq("id", incidentId)
        .single();

    // error if incident does not exist
    if (incidentError || !incident) {
        return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    // cannot submit resource request for a closed incident, error
    if ((incident as any).status === "CLOSED") {
        return NextResponse.json(
            { error: "Cannot create requests for a closed incident" },
            { status: 400 }
        );
    }

    // records data of resource request as a new row in the "requests" table
    const { data, error } = await supabase
        .from("requests")
        .insert({
            requester_id: requesterId,
            incident_id: incidentId,
            resource_name: resourceName,
            quantity,
            location,
            notes,
            status: "PENDING",
        })
        .select()
        .single();

    // error if failed to record data
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // if recording data was successful, return the data
    return NextResponse.json({ request: data }, { status: 201 });
}