import React from "react";
import { createClient } from "@supabase/supabase-js";

const REPORTS_TABLE = "reports";
const REQUESTS_TABLE = "requests";
const RESOURCES_TABLE = "resources";

const CHART_DAYS = 30; // change to 7/14/30 as you like

type ReportRow = {
  id: string;
  created_at: string;
  type: string | null;
};

type RequestRow = {
  id: string;
  created_at: string;
  resource_type: string | null;
  quantity: number | null;
};

type ResourceRow = {
  id: string;
  name: string | null;
  type: string | null;
  quantity: number | null;
  description: string | null;
  updated_at: string | null;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase env vars. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}

function startOfWeekMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun - 6 Sat
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diffToMonday);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDeltaPct(current: number, previous: number) {
  if (previous === 0 && current === 0) return "0%";
  if (previous === 0) return "∞";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toDateKeyLocal(d: Date) {
  // local date key: YYYY-MM-DD
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfDayLocal(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function stableColorForType(type: string) {
  // deterministic HSL color from string (no external libs)
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = (hash * 31 + type.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue} 70% 50%)`;
}

export default async function AnalyticsPage() {
  const now = new Date();

  // windows for KPIs
  const weekStart = startOfWeekMonday(now);
  const last24hStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // last 7 days vs prev 7 days
  const this7dStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const prev7dStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const prev7dEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // chart range: last N local days
  const chartEndDay = startOfDayLocal(now);
  const chartStartDay = addDays(chartEndDay, -(CHART_DAYS - 1)); // include today
  const chartStartISO = chartStartDay.toISOString();
  const chartEndISO = addDays(chartEndDay, 1).toISOString(); // exclusive end tomorrow 00:00

  let errorMsg: string | null = null;

  // Reports KPIs
  let reportsThisWeek: ReportRow[] = [];
  let reportsLast24hCount = 0;
  let reportsThis7dCount = 0;
  let reportsPrev7dCount = 0;
  let reportsTotalCount = 0;

  // Requests KPIs
  let requestsThisWeek: RequestRow[] = [];
  let requestsLast24hCount = 0;
  let requestsTotalCount = 0;

  // Resources table
  let resourcesAll: ResourceRow[] = [];

  // Charts raw data
  let reportChartRows: { created_at: string }[] = [];
  let requestChartRows: { created_at: string; resource_type: string | null; quantity: number | null }[] = [];

  try {
    const supabase = getSupabase();

    // -------------------------
    // REPORTS KPIs
    // -------------------------
    {
      const { data, error } = await supabase
        .from(REPORTS_TABLE)
        .select("id, created_at, type")
        .gte("created_at", weekStart.toISOString())
        .lte("created_at", now.toISOString());

      if (error) throw new Error(`reports(this week) - ${error.message}`);
      reportsThisWeek = (data ?? []) as ReportRow[];
    }

    {
      const { count, error } = await supabase
        .from(REPORTS_TABLE)
        .select("id", { count: "exact", head: true })
        .gte("created_at", last24hStart.toISOString())
        .lte("created_at", now.toISOString());

      if (error) throw new Error(`reports(last 24h) - ${error.message}`);
      reportsLast24hCount = typeof count === "number" ? count : 0;
    }

    {
      const { count: c1, error: e1 } = await supabase
        .from(REPORTS_TABLE)
        .select("id", { count: "exact", head: true })
        .gte("created_at", this7dStart.toISOString())
        .lte("created_at", now.toISOString());

      if (e1) throw new Error(`reports(this 7d) - ${e1.message}`);
      reportsThis7dCount = typeof c1 === "number" ? c1 : 0;

      const { count: c2, error: e2 } = await supabase
        .from(REPORTS_TABLE)
        .select("id", { count: "exact", head: true })
        .gte("created_at", prev7dStart.toISOString())
        .lt("created_at", prev7dEnd.toISOString());

      if (e2) throw new Error(`reports(prev 7d) - ${e2.message}`);
      reportsPrev7dCount = typeof c2 === "number" ? c2 : 0;
    }

    {
      const { count, error } = await supabase
        .from(REPORTS_TABLE)
        .select("id", { count: "exact", head: true });

      if (error) throw new Error(`reports(total) - ${error.message}`);
      reportsTotalCount = typeof count === "number" ? count : 0;
    }

    // -------------------------
    // REQUESTS KPIs
    // -------------------------
    {
      const { data, error } = await supabase
        .from(REQUESTS_TABLE)
        .select("id, created_at, resource_type, quantity")
        .gte("created_at", weekStart.toISOString())
        .lte("created_at", now.toISOString());

      if (error) throw new Error(`requests(this week) - ${error.message}`);
      requestsThisWeek = (data ?? []) as RequestRow[];
    }

    {
      const { count, error } = await supabase
        .from(REQUESTS_TABLE)
        .select("id", { count: "exact", head: true });

      if (error) throw new Error(`requests(total) - ${error.message}`);
      requestsTotalCount = typeof count === "number" ? count : 0;
    }

    {
      const { count, error } = await supabase
        .from(REQUESTS_TABLE)
        .select("id", { count: "exact", head: true })
        .gte("created_at", last24hStart.toISOString())
        .lte("created_at", now.toISOString());

      if (error) throw new Error(`requests(last 24h) - ${error.message}`);
      requestsLast24hCount = typeof count === "number" ? count : 0;
    }

    // -------------------------
    // RESOURCES
    // -------------------------
    {
      const { data, error } = await supabase
        .from(RESOURCES_TABLE)
        .select("id, name, type, quantity, description, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw new Error(`resources(all) - ${error.message}`);
      resourcesAll = (data ?? []) as ResourceRow[];
    }

    // -------------------------
    // CHART DATA (last N days)
    // -------------------------
    {
      const { data, error } = await supabase
        .from(REPORTS_TABLE)
        .select("created_at")
        .gte("created_at", chartStartISO)
        .lt("created_at", chartEndISO);

      if (error) throw new Error(`reports(chart) - ${error.message}`);
      reportChartRows = (data ?? []) as any[];
    }

    {
      const { data, error } = await supabase
        .from(REQUESTS_TABLE)
        .select("created_at, resource_type, quantity")
        .gte("created_at", chartStartISO)
        .lt("created_at", chartEndISO);

      if (error) throw new Error(`requests(chart) - ${error.message}`);
      requestChartRows = (data ?? []) as any[];
    }
  } catch (e: any) {
    errorMsg = e?.message ?? "Unknown error";
  }

  // -------------------------
  // Derived: Reports top type this week
  // -------------------------
  const reportTypeCounts = new Map<string, number>();
  for (const r of reportsThisWeek) {
    const t = (r.type ?? "unknown").toString();
    reportTypeCounts.set(t, (reportTypeCounts.get(t) ?? 0) + 1);
  }
  const topReportTypeEntry = Array.from(reportTypeCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const topReportType = topReportTypeEntry?.[0] ?? "N/A";
  const topReportTypeCount = topReportTypeEntry?.[1] ?? 0;

  const reportsDelta = reportsThis7dCount - reportsPrev7dCount;
  const reportsDeltaPct = formatDeltaPct(reportsThis7dCount, reportsPrev7dCount);

  // -------------------------
  // Derived: Requests top type + qty sum (this week) + breakdown maps
  // -------------------------
  const requestTypeCounts = new Map<string, number>();
  const requestTypeQtySums = new Map<string, number>();

  for (const r of requestsThisWeek) {
    const t = (r.resource_type ?? "unknown").toString();
    requestTypeCounts.set(t, (requestTypeCounts.get(t) ?? 0) + 1);

    const qty = typeof r.quantity === "number" ? r.quantity : 0;
    requestTypeQtySums.set(t, (requestTypeQtySums.get(t) ?? 0) + qty);
  }

  const topRequestTypeEntry = Array.from(requestTypeCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const topRequestType = topRequestTypeEntry?.[0] ?? "N/A";
  const topRequestTypeCount = topRequestTypeEntry?.[1] ?? 0;
  const topRequestTypeTotalQty = requestTypeQtySums.get(topRequestType) ?? 0;

  // -------------------------
  // Charts: day buckets (local days)
  // -------------------------
  const dayKeys: string[] = [];
  for (let i = 0; i < CHART_DAYS; i++) {
    dayKeys.push(toDateKeyLocal(addDays(chartStartDay, i)));
  }

  // Reports per day (COUNT)
  const reportsPerDay = new Map<string, number>();
  for (const k of dayKeys) reportsPerDay.set(k, 0);
  for (const row of reportChartRows) {
    if (!row.created_at) continue;
    const k = toDateKeyLocal(new Date(row.created_at));
    if (reportsPerDay.has(k)) reportsPerDay.set(k, (reportsPerDay.get(k) ?? 0) + 1);
  }
  const reportSeries = dayKeys.map((k) => ({ day: k, count: reportsPerDay.get(k) ?? 0 }));
  const maxReport = Math.max(1, ...reportSeries.map((x) => x.count));

  // Requests per day by type (SUM OF QUANTITY)
  const requestTypesSet = new Set<string>();
  const reqQtyByDayType = new Map<string, Map<string, number>>(); // day -> (type -> qty sum)
  for (const k of dayKeys) reqQtyByDayType.set(k, new Map());

  for (const row of requestChartRows) {
    const created = row.created_at;
    if (!created) continue;

    const day = toDateKeyLocal(new Date(created));
    if (!reqQtyByDayType.has(day)) continue;

    const t = (row.resource_type ?? "unknown").toString();
    requestTypesSet.add(t);

    const qty = typeof row.quantity === "number" ? row.quantity : 0;

    const inner = reqQtyByDayType.get(day)!;
    inner.set(t, (inner.get(t) ?? 0) + qty);
  }

  const requestTypes = Array.from(requestTypesSet).sort();

  // totals per day (total quantity across all types)
  const requestTotalQtyPerDay = dayKeys.map((day) => {
    const inner = reqQtyByDayType.get(day)!;
    let sum = 0;
    for (const v of inner.values()) sum += v;
    return sum;
  });

  const maxRequest = Math.max(1, ...requestTotalQtyPerDay);

  // UI styles
  const chartCardStyle: React.CSSProperties = {
    marginTop: 16,
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 16,
  };

  const chartAreaStyle: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    height: 180,
    width: "100%",
  };

  const xLabelStyle: React.CSSProperties = {
    marginTop: 8,
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#888",
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Analytics</h1>

      <div style={{ marginTop: 8, color: "#777" }}>
        <div>Week starts (Mon): {weekStart.toLocaleString()}</div>
        <div>Now: {now.toLocaleString()}</div>
      </div>

      {errorMsg ? (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: "1px solid #f99",
            background: "#fff5f5",
            borderRadius: 10,
          }}
        >
          <b>Failed to load analytics from Supabase.</b>
          <div style={{ marginTop: 6 }}>{errorMsg}</div>
        </div>
      ) : null}

      {/* -------------------- REPORTS -------------------- */}
      <h2 style={{ marginTop: 22, fontSize: 18, fontWeight: 700 }}>Reports</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#666" }}>Top report type (this week)</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{topReportType}</div>
          <div style={{ marginTop: 6, color: "#777" }}>
            {topReportTypeCount} report{topReportTypeCount === 1 ? "" : "s"} this week
          </div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#666" }}>Reports (last 24 hours)</div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>{reportsLast24hCount}</div>
          <div style={{ marginTop: 6, color: "#777" }}>
            From {last24hStart.toLocaleString()} → now
          </div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#666" }}>Last 7 days vs previous 7 days</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
            {reportsThis7dCount} vs {reportsPrev7dCount}
          </div>
          <div style={{ marginTop: 6, color: "#777" }}>
            Δ {reportsDelta > 0 ? "+" : ""}
            {reportsDelta} ({reportsDeltaPct})
          </div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#666" }}>Total reports</div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>{reportsTotalCount}</div>
          <div style={{ marginTop: 6, color: "#777" }}>All time</div>
        </div>
      </div>

      {/* Bar chart: reports per day */}
      <div style={chartCardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Daily reports (last {CHART_DAYS} days)</h3>
        <div style={chartAreaStyle}>
          {reportSeries.map((p) => {
            const h = Math.round((p.count / maxReport) * 170);
            return (
              <div key={p.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>{p.count}</div>
                <div
                  style={{
                    width: "100%",
                    height: h,
                    borderRadius: 8,
                    border: "1px solid #333",
                    background: "#999",
                  }}
                  title={`${p.day}: ${p.count}`}
                />
              </div>
            );
          })}
        </div>
        <div style={xLabelStyle}>
          {dayKeys.map((d) => (
            <div key={d} style={{ flex: 1, textAlign: "center" }}>
              {d.slice(5)}
            </div>
          ))}
        </div>
      </div>

      {/* -------------------- REQUESTS -------------------- */}
      <h2 style={{ marginTop: 26, fontSize: 18, fontWeight: 700 }}>Requests</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#666" }}>Requests (this week)</div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>{requestsThisWeek.length}</div>
          <div style={{ marginTop: 6, color: "#777" }}>Total in DB: {requestsTotalCount}</div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#666" }}>Top request type (this week)</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{topRequestType}</div>
          <div style={{ marginTop: 6, color: "#777" }}>
            {topRequestTypeCount} request{topRequestTypeCount === 1 ? "" : "s"} this week
          </div>
          <div style={{ marginTop: 6, color: "#777" }}>(Last 24 hours: {requestsLast24hCount})</div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#666" }}>Total quantity for top type</div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>{topRequestTypeTotalQty}</div>
          <div style={{ marginTop: 6, color: "#777" }}>
            Sum of <code>quantity</code> for <b>{topRequestType}</b> (this week)
          </div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, color: "#777" }}>
          <div style={{ color: "#666" }}>Note</div>
          <div style={{ marginTop: 10, fontSize: 13 }}>
            Daily request chart below is stacked by resource type (quantity sums).
          </div>
        </div>

        {/* Request type breakdown (this week) - full width */}
        <div
          style={{
            marginTop: 20,
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
            gridColumn: "1 / -1",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Request type breakdown (this week)</h3>

          {requestTypeCounts.size === 0 ? (
            <p style={{ marginTop: 10, color: "#666" }}>No requests found for this week.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>Type</th>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #eee", width: 120 }}>Count</th>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #eee", width: 160 }}>
                    Quantity sum
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(requestTypeCounts.entries())
                  .sort((a, b) => b[1] - a[1])
                  .map(([t, cnt]) => (
                    <tr key={t}>
                      <td style={{ padding: "10px 8px", borderBottom: "1px solid #f3f3f3" }}>{t}</td>
                      <td style={{ padding: "10px 8px", borderBottom: "1px solid #f3f3f3" }}>{cnt}</td>
                      <td style={{ padding: "10px 8px", borderBottom: "1px solid #f3f3f3" }}>
                        {requestTypeQtySums.get(t) ?? 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bar chart: requests per day stacked by resource_type (SUM QUANTITY) */}
      <div style={chartCardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>
          Daily requested quantity (last {CHART_DAYS} days) — stacked by resource type
        </h3>

        {/* legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10, color: "#aaa", fontSize: 12 }}>
          {requestTypes.length === 0 ? (
            <span>No request data in this range.</span>
          ) : (
            requestTypes.map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: stableColorForType(t) }} />
                {t}
              </span>
            ))
          )}
        </div>

        <div style={chartAreaStyle}>
          {dayKeys.map((day) => {
            const inner = reqQtyByDayType.get(day)!;

            let totalQty = 0;
            for (const v of inner.values()) totalQty += v;

            const barHeight = Math.round((totalQty / maxRequest) * 170);

            const segments =
              totalQty === 0
                ? []
                : requestTypes
                    .map((t) => ({ t, q: inner.get(t) ?? 0 }))
                    .filter((x) => x.q > 0)
                    .map((x) => ({
                      ...x,
                      h: Math.max(2, Math.round((barHeight * x.q) / totalQty)),
                      color: stableColorForType(x.t),
                    }));

            return (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>{totalQty}</div>

                <div
                  title={`${day}: ${totalQty}`}
                  style={{
                    width: "100%",
                    height: Math.max(0, barHeight),
                    borderRadius: 8,
                    border: "1px solid #333",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column-reverse",
                    background: totalQty === 0 ? "transparent" : undefined,
                  }}
                >
                  {segments.map((s) => (
                    <div
                      key={s.t}
                      title={`${s.t}: ${s.q}`}
                      style={{
                        height: s.h,
                        background: s.color,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={xLabelStyle}>
          {dayKeys.map((d) => (
            <div key={d} style={{ flex: 1, textAlign: "center" }}>
              {d.slice(5)}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, color: "#777", fontSize: 12 }}>
          Note: “Daily requested quantity” sums <code>quantity</code> per day; stacked segments represent each{" "}
          <code>resource_type</code>.
        </div>
      </div>

      {/* -------------------- RESOURCES -------------------- */}
      <h2 style={{ marginTop: 26, fontSize: 18, fontWeight: 700 }}>Resources remaining</h2>
      <div style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        {resourcesAll.length === 0 ? (
          <p style={{ color: "#666" }}>No resources found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>Name</th>
                <th style={{ padding: "10px 8px", borderBottom: "1px solid #eee", width: 140 }}>Type</th>
                <th style={{ padding: "10px 8px", borderBottom: "1px solid #eee", width: 120 }}>Quantity</th>
                <th style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>Description</th>
                <th style={{ padding: "10px 8px", borderBottom: "1px solid #eee", width: 180 }}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {resourcesAll.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid #f3f3f3" }}>
                    {r.name ?? "(no name)"}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid #f3f3f3" }}>
                    {r.type ?? "unknown"}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid #f3f3f3" }}>
                    {r.quantity ?? 0}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid #f3f3f3" }}>
                    {r.description ?? ""}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid #f3f3f3", color: "#777" }}>
                    {r.updated_at ? new Date(r.updated_at).toLocaleString() : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}