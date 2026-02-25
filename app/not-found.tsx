// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-40 left-1/3 h-[420px] w-[420px] rounded-full bg-red-700/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[420px] w-[420px] rounded-full bg-white/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6">
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-widest text-white/60">
                DispatchNow
              </p>
              <h1 className="text-4xl font-semibold">
                404 — Page not found
              </h1>
              <p className="max-w-xl text-white/70">
                The page you’re trying to reach doesn’t exist, or you don’t have
                access. Use the shortcuts below to get back on track.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-red-700 px-5 py-3 font-medium text-white shadow-lg shadow-red-700/20 hover:bg-red-600"
              >
                Go Home
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white/90 hover:bg-white/10"
              >
                Restart
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <QuickCard title="Resource Catalogue" desc="Browse resources and availability." href="/resource-catalog" />
            <QuickCard title="Reports Catalogue" desc="See submitted reports and details." href="/reports-catalog" />
            <QuickCard title="Submit Incident" desc="Create an incident from a report." href="/report" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="mt-1 text-sm text-white/65">{desc}</p>
        </div>
        <span className="text-white/40 group-hover:text-white/70">→</span>
      </div>
    </Link>
  );
}