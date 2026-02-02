// File: app/requests/requestshortage.tsx
// Purpose: Request form that provides clear shortage feedback (out_of_stock / partial) by calling API routes.

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CatalogRow = {
	resource_name: string | null;
	available_qty: number | null;
	reserved_qty: number | null;
	shelter_name?: string | null;
};

type CatalogResp =
	| { ok: true; tier: number; rows: CatalogRow[] }
	| { ok: false; error: string };

type CreateResp =
	| {
		ok: true;
		outcome: "fulfilled" | "partial" | "out_of_stock";
		message: string;
		requestId: string;
		requestItemId: string;
		resourceName: string;
		qtyRequested: number;
		qtyAllocated: number;
		availableBefore: number;
	}
	| { ok: false; error: string };

export default function RequestShortage() {
	const [loading, setLoading] = useState(true);
	const [tier, setTier] = useState<number | null>(null);
	const [rows, setRows] = useState<CatalogRow[]>([]);
	const [error, setError] = useState("");

	const [resourceName, setResourceName] = useState<string>("");
	const [qty, setQty] = useState<string>("1");

	const [submitStatus, setSubmitStatus] = useState<string>("");
	const [outcome, setOutcome] = useState<null | "fulfilled" | "partial" | "out_of_stock">(null);

	const selected = useMemo(() => {
		return rows.find((r) => (r.resource_name ?? "") === resourceName) ?? null;
	}, [rows, resourceName]);

	async function loadCatalog() {
		setLoading(true);
		setError("");
		setSubmitStatus("");
		setOutcome(null);

		const resp = await fetch("/api/inventory/catalog", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});

		const json = (await resp.json()) as CatalogResp;

		if (!resp.ok || !json.ok) {
			setTier(null);
			setRows([]);
			setError(json.ok ? "Failed to load catalog." : json.error);
			setLoading(false);
			return;
		}

		setTier(json.tier);
		setRows(json.rows);

		const firstName = (json.rows?.[0]?.resource_name ?? "").toString();
		if (!resourceName && firstName) setResourceName(firstName);

		setLoading(false);
	}

	useEffect(() => {
		loadCatalog();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function submitRequest() {
		setSubmitStatus("");
		setOutcome(null);

		const parsed = Number(qty);
		if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
			setSubmitStatus("Quantity must be a positive integer.");
			return;
		}
		if (!resourceName) {
			setSubmitStatus("Please select a resource.");
			return;
		}

		const resp = await fetch("/api/requests/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				resourceName,
				qtyRequested: parsed,
			}),
		});

		const json = (await resp.json()) as CreateResp;

		if (!resp.ok || !json.ok) {
			setSubmitStatus(json.ok ? "Request failed." : json.error);
			return;
		}

		setOutcome(json.outcome);
		setSubmitStatus(json.message);

		// Refresh catalog so the user can immediately see updated availability/reserved.
		await loadCatalog();
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
			<header className="border-b border-white/10 bg-slate-950/40 backdrop-blur">
				<div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
					<div>
						<h1 className="text-2xl font-semibold text-white">
							Create Request
						</h1>
						<p className="mt-1 text-sm text-slate-400">
							Shortage handling returns clear out_of_stock / partial feedback.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={loadCatalog}
							className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.10]"
						>
							Refresh
						</button>
						<Link
							href="/"
							className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
						>
							Back home →
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-5xl px-6 py-10">
				<div className="grid gap-6">
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(2,6,23,0.65)] backdrop-blur">
						{loading ? (
							<div className="text-sm text-slate-300">Loading…</div>
						) : error ? (
							<div className="text-sm text-slate-300">
								<p>{error}</p>
								<div className="mt-4">
									<Link
										href="/signup"
										className="text-emerald-300 hover:text-emerald-200"
									>
										Go to Sign Up / Login →
									</Link>
								</div>
							</div>
						) : (
							<>
								{tier !== null ? (
									<p className="text-sm text-slate-300">Current tier: {tier}</p>
								) : null}

								<div className="mt-5 grid gap-4 sm:grid-cols-2">
									<label className="block text-sm font-medium text-slate-200">
										Resource
										<select
											value={resourceName}
											onChange={(e) => setResourceName(e.target.value)}
											className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1b18] px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
										>
											{rows.map((r, idx) => {
												const name = r.resource_name ?? "";
												return (
													<option key={`${name}-${idx}`} value={name}>
														{name}
													</option>
												);
											})}
										</select>
									</label>

									<label className="block text-sm font-medium text-slate-200">
										Quantity
										<input
											type="number"
											min={1}
											step={1}
											value={qty}
											onChange={(e) => setQty(e.target.value)}
											className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1b18] px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
										/>
									</label>
								</div>

								{selected ? (
									<div className="mt-4 rounded-xl border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-300">
										<div>Available: {selected.available_qty ?? 0}</div>
										<div>Reserved: {selected.reserved_qty ?? 0}</div>
									</div>
								) : null}

								<div className="mt-5 flex items-center gap-3">
									<button
										type="button"
										onClick={submitRequest}
										className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400"
									>
										Submit request
									</button>

									{outcome ? (
										<span
											className={`rounded-full px-3 py-1 text-xs font-semibold ${outcome === "fulfilled"
													? "bg-emerald-500/20 text-emerald-200"
													: outcome === "partial"
														? "bg-amber-500/20 text-amber-200"
														: "bg-rose-500/20 text-rose-200"
												}`}
										>
											{outcome}
										</span>
									) : null}
								</div>

								{submitStatus ? (
									<p className="mt-3 text-sm text-slate-300">{submitStatus}</p>
								) : null}
							</>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
