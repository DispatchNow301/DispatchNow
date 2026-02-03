import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

// creates the POST functionality
export async function POST(request: Request) {
    // read the request sent by the client
    const body = await request.json();
    // extracts the title and description
    const title = body.title;
    const type = body.type;
    const location = body.location;
    const description = body.description;

    // checks to see the title is provided, as a string and non-empty
    if (!title || typeof title !== "string" || title.trim() === "") {
        return NextResponse.json(
            { error: "Title is required" },
            { status: 400 }
        );
    }
    // checks to see the type is provided, as a string and non-empty
    if (!type || typeof type !== "string" || type.trim() === "") {
        return NextResponse.json(
            { error: "Type is required" },
            { status: 400 }
        );
    }
    // checks to see the location is provided, as a string and non-empty
    if (!location || typeof location !== "string" || location.trim() === "") {
        return NextResponse.json(
            { error: "Location is required" },
            { status: 400 }
        );
    }

    // connects to the Supabase server
    const supabase = await createSupabaseServerClient();
    // Inputs title, type, location, and description in the Supabase "reports" table
    const { data, error } = await supabase
        .from("reports")
        .insert({
            title,
            type,
            location,
            description,
            status: "UNVERIFIED",
        })
        // returns to either data or error
        .select()
        .single();

    // error if data failed to be recorded in the table
    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
    // if data was recorded successfully, returns the data
    return NextResponse.json(
        { report: data },
        { status: 201 }
    );
}
