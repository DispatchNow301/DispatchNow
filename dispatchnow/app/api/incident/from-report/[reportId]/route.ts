import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { requireTier3 } from "@/lib/auth/requireTier3";

const VERIFIED_STATUS = "VERIFIED";

export async function POST(
  _req: Request,
  { params }: { params: { reportId: string } }
) {
  const supabase = await createSupabaseServerClient();

  // Must be logged in
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // Must be Tier 3
  const gate = await requireTier3(supabase, userRes.user.id);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const reportId = params.reportId;

  // Pull the report and verify it's VERIFIED
  const { data: report, error: repErr } = await supabase
    .from("reports")
    .select("id,type,description,latitude,longitude,status,user_id,created_at")
    .eq("id", reportId)
    .single();

  if (repErr || !report) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Report not found" },
      { status: 404 }
    );
  }

  if (report.status !== VERIFIED_STATUS) {
    return NextResponse.json(
      {
        error: "REPORT_NOT_VERIFIED",
        message: `Report status must be ${VERIFIED_STATUS}`,
        status: report.status,
      },
      { status: 409 }
    );
  }

  // Create incident (minimal incidents schema: status, closed_at)
  const { data: incident, error: insErr } = await supabase
    .from("incidents")
    .insert({
      status: "ACTIVE",
      closed_at: null,
    })
    .select("*")
    .single();

  if (insErr) {
    return NextResponse.json(
      { error: "DB_ERROR", message: insErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      incident,
      createdFrom: {
        reportId: report.id,
        title: report.title ?? null,
        type: report.type ?? null,
        location: report.location ?? null,
        endorsements: typeof report.endorsements === "number" ? report.endorsements : null,
        reportCreatedAt: report.created_at ?? null,
      },
      note:
        "Incidents table currently does not store report_id; add a report_id column so we can enforce uniqueness.",
    },
    { status: 201 }
  );
}