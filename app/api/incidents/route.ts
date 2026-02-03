import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { requireTier3 } from "@/lib/auth/requireTier3";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const gate = await requireTier3(supabase, userRes.user.id);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const body = await req.json().catch(() => ({}));
  const status =
    typeof body?.status === "string" && body.status.trim().length > 0
      ? body.status.trim()
      : "ACTIVE";

  const { data: incident, error } = await supabase
    .from("incidents")
    .insert({ status, closed_at: null })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "DB_ERROR", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ incident }, { status: 201 });
}