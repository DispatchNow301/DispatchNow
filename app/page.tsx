"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// app/components/...
import AuthPanel from "./components/AuthPanel";
import EndorseButton from "./components/EndorseButton";

// use lib/supabase/client.ts
import { supabase } from "../lib/supabase/client";

type ReportRow = {
  id: string;
  title: string | null;
  description: string | null;
  endorsements_count: number | null;
  created_at: string;
};

export default function Home() {
  const [view, setView] = useState<"home" | "reports">("home");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {view === "home" ? (
          <HomeView onOpenReports={() => setView("reports")} />
        ) : (
          <ReportsView onBack={() => setView("home")} />
        )}
      </main>
    </div>
  );
}

function HomeView({ onOpenReports }: { onOpenReports: () => void }) {
  return (
    <>
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />

      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          DispatchNow
        </h1>

        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Click{" "}
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            Reports
          </span>{" "}
          to view and endorse reports.
        </p>
      </div>

      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <button
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          onClick={onOpenReports}
          type="button"
        >
          Reports
        </button>

        <a
          className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
      </div>
    </>
  );
}

function ReportsView({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("reports")
        .select("id,title,description,endorsements_count,created_at")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setReports([]);
      } else {
        setReports((data as ReportRow[]) ?? []);
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Reports
        </h1>

        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            onClick={() => setRefreshKey((k) => k + 1)}
            type="button"
            title="Reload reports"
          >
            Refresh
          </button>

          <button
            className="rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            onClick={onBack}
            type="button"
          >
            Back
          </button>
        </div>
      </div>

      {/* test only*/}
      <div className="mb-6">
        <AuthPanel />
      </div>

      {loading ? (
        <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : reports.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No reports yet. Add some rows in <code>public.reports</code> to test.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-white/10 bg-black/10 p-4 dark:bg-white/5"
            >
              <div className="text-lg font-medium text-black dark:text-zinc-50">
                {r.title ?? "(untitled)"}
              </div>

              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Endorsements: {r.endorsements_count ?? 0}
              </div>

              {r.description ? (
                <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {r.description}
                </div>
              ) : null}

              {/* make EndorseButton */}
              <div className="mt-3">
                <EndorseButton reportId={r.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
