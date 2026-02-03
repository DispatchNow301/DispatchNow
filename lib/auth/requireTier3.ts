import type { createSupabaseServerClient } from "@/lib/supabase/server-client";

type SupabaseServer = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export async function requireTier3(
  supabase: SupabaseServer,
  userId: string
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .single();

  if (error || !data) return { ok: false, status: 403, error: "FORBIDDEN" };

  // tier is int4: 1/2/3
  if (data.tier !== 3) return { ok: false, status: 403, error: "TIER3_REQUIRED" };

  return { ok: true };
}