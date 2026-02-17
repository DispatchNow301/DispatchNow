// app/profile/[username]/page.tsx
import type { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { username: string };
}): Metadata {
  return { title: `@${params.username} • DispatchNow` };
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="min-w-[92px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
      <div className="text-lg font-extrabold text-[#D9D9D9]">{value}</div>
      <div className="mt-1 text-xs text-[#D9D9D9]/60">{label}</div>
    </div>
  );
}

function ItemCard({
  title,
  location,
  time,
  right,
  bottomLeft,
}: {
  title: string;
  location: string;
  time: string;
  right: React.ReactNode;
  bottomLeft?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-[#D9D9D9]">{title}</div>
          <div className="text-xs text-[#D9D9D9]/60">{location}</div>
        </div>
        <div className="shrink-0">{right}</div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#D9D9D9]/70">
        <div className="flex items-center gap-2">
          {bottomLeft ?? <span className="text-[#D9D9D9]/60">@user</span>}
        </div>
        <span className="text-[#D9D9D9]/65">{time}</span>
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
  const tierText = tier === 1 ? "Citizen" : tier === 2 ? "Volunteer" : "Authority";

  const citizenText = "#34D399";
  const volunteerText = "#FF9F1A";

  const isAuthority = tier === 3;

  return (
    <span
      className="rounded-full border border-white/10 px-3 py-1 text-xs"
      style={{
        color: tier === 1 ? citizenText : tier === 2 ? volunteerText : "#D9D9D9",
        background: isAuthority ? "#8B000D" : "rgba(255,255,255,0.06)",
      }}
    >
      {tierText}
    </span>
  );
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  // editable
  const tier: 1 | 2 | 3 = 3;

  const username = (params?.username ?? "user").toString();
  const displayName = "User";

  const VOLUNTEER_BLOB = "#FF7A18"; 
  const AUTH_BLOB = "#8B000D";
  const CITIZEN_BLOB = "#34D399";

  const blobColor = tier === 1 ? CITIZEN_BLOB : tier === 2 ? VOLUNTEER_BLOB : AUTH_BLOB;

  const reports = [
    { id: "r1", type: "Report Type", location: "Location", time: "DD/MM/YYYY ~ 00:00" },
    { id: "r2", type: "Report Type", location: "Location", time: "DD/MM/YYYY ~ 00:00" },
  ];

  const incidents = [
    { id: "i1", type: "Incident Type", location: "Location", time: "DD/MM/YYYY ~ 00:00", status: "active" },
  ];

  return (
    <main className="relative h-screen overflow-hidden bg-[#0b0b0c] text-[#D9D9D9]">
      {/* ONLY bottom glow (no other gradients) */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[-220px] h-[560px] w-[560px] rounded-full blur-[90px] opacity-[0.55]"
        style={{ background: blobColor }}
      />

      <div className="relative h-full px-6 py-8">
        <div className="mx-auto h-full max-w-5xl">
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5 mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/5">
                <span className="font-bold tracking-wide text-[#D9D9D9]">
                  {(username.slice(0, 2) || "US").toUpperCase()}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <div className="text-2xl font-bold text-[#D9D9D9]">@{username}</div>
                  <div className="text-lg text-[#D9D9D9]/65">{displayName}</div>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <TierBadge tier={tier} />
                  <span className="text-xs text-[#D9D9D9]/55">Public profile</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Stat label="Reports" value={reports.length} />
              <Stat label="Incidents" value={incidents.length} />
              <Stat label="Endorsements" value={3} />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-wide text-[#D9D9D9]">Reports</h2>
                <a href="/reports-catalog" className="text-xs text-[#D9D9D9]/60 hover:text-[#D9D9D9]/80">
                  See more…
                </a>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="space-y-3">
                {reports.slice(0, 3).map((r) => (
                  <ItemCard
                    key={r.id}
                    title={r.type}
                    location={r.location}
                    time={r.time}
                    bottomLeft={<span className="text-[#D9D9D9]/60">@{username}</span>}
                    right={
                      <a
                        href={`/report/${r.id}`}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/85 hover:bg-white/10 transition"
                      >
                        View
                      </a>
                    }
                  />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-wide text-[#D9D9D9]">Incidents</h2>
                <a href="/incidents-catalog" className="text-xs text-[#D9D9D9]/60 hover:text-[#D9D9D9]/80">
                  See more…
                </a>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="space-y-3">
                {incidents.slice(0, 3).map((i) => (
                  <ItemCard
                    key={i.id}
                    title={i.type}
                    location={i.location}
                    time={i.time}
                    bottomLeft={
                      <div className="flex items-center gap-2">
                        <span className="text-[#D9D9D9]/55">status</span>
                        <span className="font-semibold text-[#34D399]">{i.status}</span>
                      </div>
                    }
                    right={
                      <a
                        href={`/incident/${i.id}`}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/85 hover:bg-white/10 transition"
                      >
                        View
                      </a>
                    }
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="mt-4 flex justify-center">              {/*tweak: what we do for this?*/}
            <span className="text-xs text-[#D9D9D9]/45">DispatchNow • Contact Us </span>
          </div>
        </div>
      </div>
    </main>
  );
}