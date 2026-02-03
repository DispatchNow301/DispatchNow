import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

// creates the POST functionality
export async function POST(request: Request) {
    // read the request sent by the client
    const body = await request.json();
    // extracts data (necessary fields)
    const requesterId = body.requester_id;
    const incidentId = body.incident_id;
    const resourceName = body.resource_name;
    const quantity = body.quantity;
    const location = body.location;
    const notes = body.notes;

    // following if statements check that all fields (except notes)
    // are provided in a valid format
    if (!requesterId) {
        return NextResponse.json(
            { error: "Requester ID is required" },
            { status: 400 }
        );
    }
    if (!incidentId) {
        return NextResponse.json(
            { error: "Incident ID is required" },
            { status: 400 }
        );
    }
    if (!resourceName || typeof resourceName !== "string" || resourceName.trim() === "") {
        return NextResponse.json(
            { error: "Resource name is required" },
            { status: 400 }
        );
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json(
            { error: "Quantity must be greater than 0" },
            { status: 400 }
        );
    }
    if (!location || typeof location !== "string" || location.trim() === "") {
        return NextResponse.json(
            { error: "Location is required" },
            { status: 400 }
        );
    }
    // connects to the Supabase server
    const supabase = await createSupabaseServerClient();
    // checks to see that the provided incident id exists within Supabase
    const {data: incident, error: incidentError} = await supabase
        .from("incidents")
        .select("status")
        .eq("id", incidentId)
        .single();
    // error if incident does not exist
    if (incidentError || !incident) {
        return NextResponse.json(
            { error: "Incident not found" },
            { status: 404 }
        );
    }
    // cannot submit resource request for a closed incident, error
    if (incident.status === "CLOSED") {
        return NextResponse.json(
            { error: "Cannot create requests for a closed incident" },
            { status: 400 }
        );
    }
    // records data of resource request as a new row in the "requests" table
    const {data, error} = await supabase
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
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
    // if recording data was successful, return the data
    return NextResponse.json(
        { request: data },
        { status: 201 }
    );
}
