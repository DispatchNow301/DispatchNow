import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { requireTier3 } from "@/lib/auth/requireTier3";

const MIN_ENDORSEMENTS = 3;

export async function POST(
  _req: Request,
  { params }: { params: { reportId: string } }
) {
  const supabase = await createSupabaseServerClient();

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const gate = await requireTier3(supabase, userRes.user.id);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const reportId = params.reportId;

  const { data: report, error: repErr } = await supabase
    .from("reports")
    .select("id, title, endorsements")
    .eq("id", reportId)
    .single();

  if (repErr || !report) {
    return NextResponse.json({ error: "NOT_FOUND", message: "Report not found" }, { status: 404 });
  }

  const endorsements = typeof report.endorsements === "number" ? report.endorsements : 0;
  if (endorsements < MIN_ENDORSEMENTS) {
    return NextResponse.json(
      {
        error: "REPORT_NOT_VERIFIED",
        message: `Report needs at least ${MIN_ENDORSEMENTS} endorsements`,
        endorsements,
      },
      { status: 409 }
    );
  }

  const { data: incident, error: insErr } = await supabase
    .from("incidents")
    .insert({ status: "ACTIVE", closed_at: null })
    .select("*")
    .single();

  if (insErr) {
    return NextResponse.json({ error: "DB_ERROR", message: insErr.message }, { status: 500 });
  }

  return NextResponse.json(
    { incident, createdFrom: { reportId: report.id, title: report.title } },
    { status: 201 }
  );
}