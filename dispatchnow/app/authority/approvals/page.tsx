"use client";

/*
// Location: app/authority/approvals/page.tsx
// Purpose: Authority (Tier 3) approve/deny PENDING requests; supports grouping by incident,
//          sorting by incident status/priority/time, and filtering pending approvals.
*/

import { useEffect, useMemo, useState } from "react";

type Incident = {
	id: string;
	priority: string; // HIGH | MEDIUM | LOW
	status: string; // ACTIVE | PAUSED | CLOSED
	created_at: string;
	closed_at: string | null;
};

type RequestRow = {
	id: string;
	requester_id: string;
	status: string; // PENDING | APPROVED | DENIED
	created_at: string;
	incident_id: string | null;

	resource_name: string;
	quantity: number;
	location: string;

	additional_notes: string | null;
	// Note: We do not assume the DB has a denial_reason column. The API will handle fallback.
};

type PendingResp = {
	incidents: Incident[];
	requests: RequestRow[];
};

const statusOrder: Record<string, number> = {
	ACTIVE: 1,
	PAUSED: 2,
	CLOSED: 3,
};

const priorityOrder: Record<string, number> = {
	HIGH: 1,
	MEDIUM: 2,
	LOW: 3,
};

export default function AuthorityApprovalsPage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [onlyPending, setOnlyPending] = useState(true);
	const [query, setQuery] = useState("");

	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [requests, setRequests] = useState<RequestRow[]>([]);

	// Denial reason UI state (per-request)
	const [denyOpen, setDenyOpen] = useState<Record<string, boolean>>({});
	const [denyReasonDraft, setDenyReasonDraft] = useState<Record<string, string>>(
		{},
	);

	// Prevent double-click / concurrent actions
	const [busyId, setBusyId] = useState<string | null>(null);

	const load = async () => {
		setLoading(true);
		setError(null);

		const res = await fetch("/api/requests/pending", {
			method: "GET",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		});

		if (!res.ok) {
			const msg = await res.json().catch(() => ({}));
			setError(
				`${res.status} ${msg?.error ?? "LOAD_FAILED"}${msg?.message ? `: ${msg.message}` : ""
				}`,
			);
			setIncidents([]);
			setRequests([]);
			setLoading(false);
			return;
		}

		const data = (await res.json()) as PendingResp;
		setIncidents(Array.isArray(data.incidents) ? data.incidents : []);
		setRequests(Array.isArray(data.requests) ? data.requests : []);
		setLoading(false);
	};

	useEffect(() => {
		load();
	}, []);

	const incidentsById = useMemo(() => {
		const m = new Map<string, Incident>();
		for (const inc of incidents) m.set(inc.id, inc);
		return m;
	}, [incidents]);

	const filteredRequests = useMemo(() => {
		const q = query.trim().toLowerCase();
		return requests.filter((r) => {
			if (onlyPending && r.status !== "PENDING") return false;
			if (!q) return true;
			return (
				r.id.toLowerCase().includes(q) ||
				(r.resource_name ?? "").toLowerCase().includes(q) ||
				(r.location ?? "").toLowerCase().includes(q) ||
				(r.incident_id ?? "").toLowerCase().includes(q)
			);
		});
	}, [requests, onlyPending, query]);

	const grouped = useMemo(() => {
		// Group key = incident_id, or "__NO_INCIDENT__" if null
		const g = new Map<string, RequestRow[]>();
		for (const r of filteredRequests) {
			const key = r.incident_id ?? "__NO_INCIDENT__";
			const arr = g.get(key) ?? [];
			arr.push(r);
			g.set(key, arr);
		}

		// Sort within each group by request created_at (newest first)
		for (const [k, arr] of g.entries()) {
			arr.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
			g.set(k, arr);
		}

		// Sort groups by incident status -> priority -> incident created_at
		const keys = Array.from(g.keys());
		keys.sort((a, b) => {
			if (a === "__NO_INCIDENT__" && b !== "__NO_INCIDENT__") return 1;
			if (b === "__NO_INCIDENT__" && a !== "__NO_INCIDENT__") return -1;
			if (a === "__NO_INCIDENT__" && b === "__NO_INCIDENT__") return 0;

			const ia = incidentsById.get(a);
			const ib = incidentsById.get(b);

			const sa = statusOrder[ia?.status ?? ""] ?? 99;
			const sb = statusOrder[ib?.status ?? ""] ?? 99;
			if (sa !== sb) return sa - sb;

			const pa = priorityOrder[ia?.priority ?? ""] ?? 99;
			const pb = priorityOrder[ib?.priority ?? ""] ?? 99;
			if (pa !== pb) return pa - pb;

			const ta = ia?.created_at ? new Date(ia.created_at).getTime() : 0;
			const tb = ib?.created_at ? new Date(ib.created_at).getTime() : 0;
			return tb - ta;
		});

		return keys.map((k) => ({
			key: k,
			incident: k === "__NO_INCIDENT__" ? null : incidentsById.get(k) ?? null,
			items: g.get(k) ?? [],
		}));
	}, [filteredRequests, incidentsById]);

	const decide = async (
		requestId: string,
		decision: "APPROVE" | "DENY",
		denialReason?: string,
	) => {
		setBusyId(requestId);
		setError(null);

		const res = await fetch("/api/requests/decision", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				requestId,
				decision,
				denialReason: denialReason ?? null,
			}),
		});

		if (!res.ok) {
			const msg = await res.json().catch(() => ({}));
			setError(
				`${res.status} ${msg?.error ?? "DECISION_FAILED"}${msg?.message ? `: ${msg.message}` : ""
				}`,
			);
			setBusyId(null);
			return;
		}

		// Update local state:
		// - If "only pending", remove the request after a decision.
		// - Otherwise, just update its status.
		setRequests((prev) => {
			if (onlyPending) return prev.filter((r) => r.id !== requestId);
			return prev.map((r) =>
				r.id === requestId
					? {
						...r,
						status: decision === "APPROVE" ? "APPROVED" : "DENIED",
					}
					: r,
			);
		});

		// Close denial UI for this request
		setDenyOpen((p) => ({ ...p, [requestId]: false }));
		setBusyId(null);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6">
				<div className="max-w-5xl mx-auto">Loading approvals...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6">
			<div className="max-w-5xl mx-auto space-y-4">
				<div className="flex items-start justify-between gap-4 flex-wrap">
					<div>
						<h1 className="text-2xl font-semibold">Pending Approvals</h1>
						<p className="text-sm text-slate-300">
							Group by incident; sort incident groups by status/priority/time; sort requests by newest first.
						</p>
					</div>

					<div className="flex gap-2 items-center flex-wrap">
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={onlyPending}
								onChange={(e) => setOnlyPending(e.target.checked)}
							/>
							Show only PENDING
						</label>

						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search: request id / incident id / resource / location"
							className="px-3 py-2 rounded-md bg-slate-800/70 border border-slate-700 text-sm outline-none"
						/>

						<button
							onClick={load}
							className="px-3 py-2 rounded-md bg-slate-100 text-slate-900 text-sm font-medium hover:bg-white"
						>
							Refresh
						</button>
					</div>
				</div>

				{error ? (
					<div className="p-3 rounded-md border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
						{error}
					</div>
				) : null}

				{grouped.length === 0 ? (
					<div className="p-6 rounded-xl border border-slate-700 bg-slate-900/40">
						No requests found.
					</div>
				) : (
					<div className="space-y-4">
						{grouped.map((grp) => {
							const inc = grp.incident;
							return (
								<div
									key={grp.key}
									className="rounded-xl border border-slate-700 bg-slate-900/40 overflow-hidden"
								>
									<div className="p-4 border-b border-slate-700 flex items-start justify-between gap-3 flex-wrap">
										<div className="space-y-1">
											<div className="text-sm text-slate-300">Incident</div>
											<div className="font-mono text-sm break-all">
												{grp.key === "__NO_INCIDENT__" ? "(No incident)" : grp.key}
											</div>

											{inc ? (
												<div className="text-sm text-slate-200 flex gap-3 flex-wrap">
													<span>
														<strong>Priority:</strong> {inc.priority}
													</span>
													<span>
														<strong>Status:</strong> {inc.status}
													</span>
													<span>
														<strong>Created:</strong>{" "}
														{new Date(inc.created_at).toLocaleString()}
													</span>
												</div>
											) : (
												<div className="text-sm text-slate-400">
													This request is not bound to an incident_id (still actionable).
												</div>
											)}
										</div>

										<div className="text-sm text-slate-300">
											Requests:{" "}
											<span className="text-slate-100">{grp.items.length}</span>
										</div>
									</div>

									<div className="p-4 space-y-3">
										{grp.items.map((r) => {
											const denyIsOpen = !!denyOpen[r.id];
											const draft = denyReasonDraft[r.id] ?? "";
											const isBusy = busyId === r.id;

											return (
												<div
													key={r.id}
													className="rounded-lg border border-slate-700 bg-slate-950/40 p-4 space-y-2"
												>
													<div className="flex items-start justify-between gap-3 flex-wrap">
														<div className="space-y-1">
															<div className="text-sm text-slate-300">Request ID</div>
															<div className="font-mono text-sm break-all">{r.id}</div>

															<div className="text-sm text-slate-200 flex gap-3 flex-wrap">
																<span>
																	<strong>Status:</strong> {r.status}
																</span>
																<span>
																	<strong>Resource:</strong> {r.resource_name}
																</span>
																<span>
																	<strong>Qty:</strong> {r.quantity}
																</span>
																<span>
																	<strong>Location:</strong> {r.location}
																</span>
															</div>

															<div className="text-xs text-slate-400">
																Created: {new Date(r.created_at).toLocaleString()}
															</div>
														</div>

														<div className="flex gap-2">
															<button
																disabled={isBusy || r.status !== "PENDING"}
																onClick={() => decide(r.id, "APPROVE")}
																className="px-3 py-2 rounded-md bg-emerald-400 text-slate-950 text-sm font-semibold disabled:opacity-50"
															>
																Approve
															</button>
															<button
																disabled={isBusy || r.status !== "PENDING"}
																onClick={() =>
																	setDenyOpen((p) => ({
																		...p,
																		[r.id]: !p[r.id],
																	}))
																}
																className="px-3 py-2 rounded-md bg-red-400 text-slate-950 text-sm font-semibold disabled:opacity-50"
															>
																Deny
															</button>
														</div>
													</div>

													{denyIsOpen ? (
														<div className="pt-2 space-y-2">
															<div className="text-sm text-slate-300">
																Denial reason (required)
															</div>

															<textarea
																value={draft}
																onChange={(e) =>
																	setDenyReasonDraft((p) => ({
																		...p,
																		[r.id]: e.target.value,
																	}))
																}
																rows={3}
																className="w-full px-3 py-2 rounded-md bg-slate-800/70 border border-slate-700 text-sm outline-none"
																placeholder="e.g., duplicate request / missing verification / cannot dispatch at this time..."
															/>

															<div className="flex gap-2">
																<button
																	disabled={isBusy || draft.trim().length === 0}
																	onClick={() => decide(r.id, "DENY", draft.trim())}
																	className="px-3 py-2 rounded-md bg-red-200 text-slate-950 text-sm font-semibold disabled:opacity-50"
																>
																	Submit denial
																</button>

																<button
																	disabled={isBusy}
																	onClick={() =>
																		setDenyOpen((p) => ({ ...p, [r.id]: false }))
																	}
																	className="px-3 py-2 rounded-md bg-slate-700 text-slate-100 text-sm font-medium"
																>
																	Cancel
																</button>
															</div>
														</div>
													) : null}

													{r.additional_notes ? (
														<div className="text-xs text-slate-400 whitespace-pre-wrap">
															Notes: {r.additional_notes}
														</div>
													) : null}
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
