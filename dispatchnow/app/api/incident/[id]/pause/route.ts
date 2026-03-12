import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

// creates the POST functionality
export async function POST(request: Request, {params}: {params: {id: string}}) {
    // collects from [id] (this is a directory and field name is filled for each incident)
    const incidentId = params.id;
    // connects to Supabase server
    const supabase = await createSupabaseServerClient();

    // selects the row which has incident id matching to [id]
    const {data: incident, error} = await supabase
        .from("incidents")
        .select("*")
        .eq("id", incidentId)
        .single();

    // error if failed to find row or incident does not exist
    if (error || !incident) {
        return NextResponse.json(
            { error: "Incident not found" },
            { status: 404 }
        );
    }
    // cannot pause a closed incident, error
    if (incident.status === "CLOSED") {
        return NextResponse.json(
            { error: "Cannot pause a closed incident" },
            { status: 400 }
        );
    }
    // cannot pause a paused incident, error
    if (incident.status === "PAUSED") {
        return NextResponse.json(
            { error: "Incident is already paused" },
            { status: 400 }
        );
    }
    // if row with matching incident id successfully found, update status to PAUSED
    // returns value to updatedIncident if done successfully
    const {data: updatedIncident, error: updateError} = await supabase
        .from("incidents")
        .update({ status: "PAUSED" })
        .eq("id", incidentId)
        .select()
        .single();

    // error if updating status failed
    if (updateError) {
        return NextResponse.json(
            { error: updateError.message },
            { status: 500 }
        );
    }
    // return the updated incident
    return NextResponse.json(
        { incident: updatedIncident },
        { status: 200 }
    );
}
