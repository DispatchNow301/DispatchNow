"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchResult = {
  id: string;
  type: "user" | "report" | "incident" | "request";
  title: string;
  description?: string | null;
  url: string;
};

type Suggestion = {
  key: "from:" | "type:" | "status:";
  title: string;
  subtitle: string;
  example: string;
  icon: React.ReactNode;
};

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, onOutside]);
}

function IconUser() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconHash() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 9h16M3 15h16" />
      <path d="M10 3 8 21M16 3l-2 18" />
    </svg>
  );
}
function IconSliders() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M2 14h4M10 8h4M18 16h4" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7.5" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function TypeBadge({ t }: { t: SearchResult["type"] }) {
  const base =
    "rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider";
  if (t === "user") return <span className={`${base} bg-white/[0.04] text-[#34D399]`}>User</span>;
  if (t === "report") return <span className={`${base} bg-white/[0.04] text-[#D9D9D9]`}>Report</span>;
  if (t === "incident") return <span className={`${base} bg-white/[0.04] text-[#FF9F1A]`}>Incident</span>;
  return <span className={`${base} bg-white/[0.04] text-[#9CA3AF]`}>Request</span>;
}

const SUGGESTIONS: Suggestion[] = [
  {
    key: "from:",
    title: "From a specific user",
    subtitle: "Filter results created by a user",
    example: "from:arshin",
    icon: <IconUser />,
  },
  {
    key: "type:",
    title: "In a specific category",
    subtitle: "Limit results to one type",
    example: "type:report",
    icon: <IconHash />,
  },
  {
    key: "status:",
    title: "With a status",
    subtitle: "Filter by status field",
    example: "status:open",
    icon: <IconSliders />,
  },
];

function parseInsert(key: string) {
  // Discord style: insert the key, and if it's type: or status:, also add a trailing : so user can immediately type the value
  return `${key}`;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useOutsideClick(boxRef, () => setOpen(false));

  const showSuggestions = useMemo(() => q.trim().length === 0, [q]);

  // debounce search
  useEffect(() => {
    const query = q.trim();
    if (!open) return;

    if (query.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = (await res.json().catch(() => null)) as { results?: SearchResult[] } | null;
        if (!res.ok) {
          setResults([]);
          return;
        }
        setResults(data?.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(t);
  }, [q, open]);

  const onPickSuggestion = (key: Suggestion["key"]) => {
    setQ(parseInsert(key));
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
      // setTimeout to ensure the input is focused after the dropdown opens and state updates, allowing the user to immediately type the filter value without an extra click
    setTimeout(() => {
      if (inputRef.current) {
        const len = inputRef.current.value.length;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(len, len);
      }
    }, 0);
  };

  return (
    <div ref={boxRef} className="relative">
      {/* Search bar (compact, Discord-ish) */}
      <div
        className="flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <span className="mr-2 text-[#D9D9D9]/60">
          <IconSearch />
        </span>

        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search..."
          className="w-32 bg-transparent text-xs text-[#D9D9D9] placeholder:text-[#D9D9D9]/40 outline-none"
        />

        {q.length > 0 && (
          <button
            type="button"
            className="ml-2 text-[#D9D9D9]/45 hover:text-[#D9D9D9]/80 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setQ("");
              setResults([]);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-[400px] overflow-hidden rounded-xl border border-white/10 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
          style={{ backgroundColor: "#2b2d31" }} // Discord-ish dark gray
        >
          {/* header */}
          <div className="px-3 pt-3 pb-2">
            <p className="text-[11px] font-semibold tracking-wide text-white/70">
              {showSuggestions ? "FILTERS" : "RESULTS"}
            </p>
          </div>

          <div className="h-px bg-white/10" />

          {showSuggestions ? (
            <div className="p-1">
                {SUGGESTIONS.map((s) => (
                <button
                    key={s.key}
                    type="button"
                    onClick={() => onPickSuggestion(s.key)}
                    className="w-full rounded-xl px-3 py-2 text-left transition border border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.07] active:scale-[0.99]"
                >
                    <div className="flex items-center justify-between gap-3">
                    {/* left: keyword pill */}
                    <span className="shrink-0 rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-semibold text-white/85">
                        {s.key}
                    </span>

                    {/* right: example */}
                    <span className="min-w-0 flex-1 text-right font-mono text-[11px] text-white/70 truncate">
                        {s.example}
                    </span>
                    </div>
                </button>
                ))}

              <div className="px-3 pt-3 pb-4 text-xs text-[#D9D9D9]/45">
              Tip: start typing to search, or click a filter to insert it.
              </div>
            </div>
          ) : (
            <div className="p-1">
              <div className="flex items-center justify-between px-2 pt-1 pb-2">
                <p className="text-[11px] text-white/50">Matching items</p>
                {loading && <p className="text-[11px] text-white/55">Loading...</p>}
              </div>

              {!loading && results.length === 0 ? (
                <div className="px-2 pb-3 text-[12px] text-white/55">No results found.</div>
              ) : (
                <div className="max-h-[320px] overflow-y-auto">
                  {results.map((r) => (
                    <Link
                      key={`${r.type}:${r.id}`}
                      href={r.url}
                      className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.06] transition"
                      onClick={() => setOpen(false)}
                    >
                      <div className="mt-0.5">
                        <TypeBadge t={r.type} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white/90">{r.title}</p>
                        {r.description ? (
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-white/55">
                            {r.description}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}