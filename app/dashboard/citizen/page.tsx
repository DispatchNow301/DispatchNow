// app/dashboard/citizen/page.tsx
import Link from "next/link";
import Sidebar from "@/util/sidebar";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type ReportRow = {
  id: string;
  description: string | null;
  type: string | null;
  status: string | null;
  created_at: string;
};

type IncidentRow = {
  id: string;
  title: string | null;
  status: string | null;
  priority: string | null;
  report_id: string | null;
  created_at: string;
};

function fmt(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function Pill({
  text,
  kind,
}: {
  text: string;
  kind: "soft" | "red" | "green" | "orange";
}) {
  const base =
    "inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs";
  const map: Record<typeof kind, string> = {
    soft: "bg-white/5 text-white/80",
    red: "bg-[#8B000D] text-white",
    green: "bg-white/5 text-[#34D399]",
    orange: "bg-white/5 text-[#FF9F1A]",
  };
  return <span className={`${base} ${map[kind]}`}>{text}</span>;
}

function GhostBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );
}

function RedBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition"
    >
      {children}
    </Link>
  );
}

function FeedItem({
  title,
  metaLeft,
  metaRight,
  right,
}: {
  title: string;
  metaLeft: React.ReactNode;
  metaRight: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#D9D9D9] truncate">
            {title}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {metaLeft}
          </div>
        </div>
        <div className="shrink-0">{right}</div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#D9D9D9]/60">
        <div>{metaRight}</div>
      </div>
    </div>
  );
}

export default async function CitizenDashboard() {
  const sidebarWidth = 84;

  const supabase = await createSupabaseServerClient();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  if (!user) redirect("/");

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("tier,username")
    .eq("id", user.id)
    .maybeSingle();

  if (profErr) throw new Error(profErr.message);

  const tier = (profile?.tier ?? 1) as 1 | 2 | 3;
  if (tier === 3) redirect("/dashboard/authority");

  const username = (profile?.username ?? "user").toString();

  const { data: reports, error: repErr } = await supabase
    .from("reports")
    .select("id,description,type,status,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)
    .returns<ReportRow[]>();

  if (repErr) throw new Error(repErr.message);

  const { data: incidents, error: incErr } = await supabase
    .from("incidents")
    .select("id,title,status,priority,report_id,created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .limit(3)
    .returns<IncidentRow[]>();

  if (incErr) throw new Error(incErr.message);

  const activity = [
    ...(reports ?? []).map((r) => ({
      kind: "report" as const,
      ts: r.created_at,
      id: r.id,
      title: r.type ? `Report: ${r.type}` : "Report",
      status: r.status ?? "unknown",
      desc: r.description ?? "",
    })),
    ...(incidents ?? []).map((i) => ({
      kind: "incident" as const,
      ts: i.created_at,
      id: i.id,
      title: i.title ? `Incident: ${i.title}` : "Incident",
      status: i.status ?? "unknown",
      priority: i.priority ?? "unspecified",
      report_id: i.report_id,
    })),
  ].sort((a, b) => +new Date(b.ts) - +new Date(a.ts)).slice(0, 6);

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-[#D9D9D9]">
      <Sidebar activeHref="/dashboard" />

      <div
        className="px-6 py-8"
        style={{ paddingLeft: `calc(${sidebarWidth}px + 24px)` }}
      >
        <div className="mx-auto max-w-6xl">
          <section className="mb-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-bold">My Activity</div>
                <div className="mt-1 text-sm text-[#D9D9D9]/60">
                  Recent actions for <span className="text-white">@{username}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Pill text="Citizen" kind="green" />
                  <Pill text="Dashboard" kind="soft" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <RedBtn href="/report/new">Create report</RedBtn>
                <GhostBtn href={`/profile/${username}`}>View profile</GhostBtn>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-wide">Activity feed</h2>
                <span className="text-xs text-[#D9D9D9]/55">latest 6</span>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="space-y-3">
                {activity.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-[#D9D9D9]/70">
                    No activity yet. Create your first report to get started.
                  </div>
                ) : (
                  activity.map((a) => (
                    <FeedItem
                      key={`${a.kind}-${a.id}`}
                      title={a.title}
                      metaLeft={
                        a.kind === "report" ? (
                          <>
                            <Pill text="report" kind="soft" />
                            <Pill text={a.status} kind="soft" />
                          </>
                        ) : (
                          <>
                            <Pill text="incident" kind="soft" />
                            <Pill text={a.status} kind="soft" />
                            <Pill text={a.priority} kind="orange" />
                          </>
                        )
                      }
                      metaRight={<span>{fmt(a.ts)}</span>}
                      right={
                        a.kind === "report" ? (
                          <GhostBtn href={`/report/${a.id}`}>View</GhostBtn>
                        ) : (
                          <GhostBtn href={`/incident/${a.id}`}>View</GhostBtn>
                        )
                      }
                    />
                  ))
                )}
              </div>
            </section>

            <div className="flex flex-col gap-4">
              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-wide">Quick actions</h2>
                  <span className="text-xs text-[#D9D9D9]/55">citizen</span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="grid grid-cols-1 gap-3">
                  <RedBtn href="/report/new">Create a new report</RedBtn>
                  <GhostBtn href="/reports-catalog">Browse reports</GhostBtn>
                  <GhostBtn href="/incidents-catalog">Browse incidents</GhostBtn>
                  <GhostBtn href="/resource-catalog">Browse resources</GhostBtn>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-wide">Counts</h2>
                  <span className="text-xs text-[#D9D9D9]/55">top 3 each</span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <div className="text-2xl font-extrabold text-white">
                      {(reports ?? []).length}
                    </div>
                    <div className="mt-1 text-xs text-[#D9D9D9]/60">Reports shown</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <div className="text-2xl font-extrabold text-white">
                      {(incidents ?? []).length}
                    </div>
                    <div className="mt-1 text-xs text-[#D9D9D9]/60">Incidents shown</div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <span className="text-xs text-[#D9D9D9]/45">
              DispatchNow • dashboard (citizen)
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}