// File: app/inventory/edit/page.tsx
// Purpose: Tier-locked page for editing resource inventory quantities via API routes (Tier 3 only, non-negative validation).

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ResourceRow = {
	id: string;
	shelter_name?: string | null;
	name: string | null;
	total_qty: number | null;
};

type ResourcesResp =
	| { ok: true; tier: number; rows: ResourceRow[] }
	| { ok: false; error: string };

type PatchResp =
	| { ok: true; resource: ResourceRow }
	| { ok: false; error: string };

export default function InventoryEditPage() {
	const [loading, setLoading] = useState(true);
	const [tier, setTier] = useState<number | null>(null);
	const [rows, setRows] = useState<ResourceRow[]>([]);
	const [editQty, setEditQty] = useState<Record<string, string>>({});
	const [status, setStatus] = useState<string>("");

	async function loadResources() {
		setLoading(true);
		setStatus("");

		const resp = await fetch("/api/inventory/resources", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});

		const json = (await resp.json()) as ResourcesResp;

		if (!resp.ok || !json.ok) {
			setTier(null);
			setRows([]);
			setEditQty({});
			setStatus(json.ok ? "Failed to load resources." : json.error);
			setLoading(false);
			return;
		}

		setTier(json.tier);
		setRows(json.rows);

		const init: Record<string, string> = {};
		for (const r of json.rows) {
			init[r.id] = String(r.total_qty ?? 0);
		}
		setEditQty(init);

		setLoading(false);
	}

	useEffect(() => {
		loadResources();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function saveRow(resourceId: string) {
		setStatus("");

		if (tier !== null && tier < 3) {
			setStatus("Access denied: Tier 3 required.");
			return;
		}

		const raw = editQty[resourceId] ?? "0";
		const parsed = Number(raw);

		// Client-side validation: non-negative integer only.
		if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
			setStatus("Quantity must be an integer.");
			return;
		}
		if (parsed < 0) {
			setStatus("Quantity cannot be negative.");
			return;
		}

		const resp = await fetch("/api/inventory/edit", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ resourceId, totalQty: parsed }),
		});

		const json = (await resp.json()) as PatchResp;

		if (!resp.ok || !json.ok) {
			setStatus(json.ok ? "Update failed." : json.error);
			return;
		}

		setRows((prev) =>
			prev.map((r) =>
				r.id === resourceId ? { ...r, total_qty: json.resource.total_qty } : r,
			),
		);

		setStatus("Inventory updated.");
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
			<header className="border-b border-white/10 bg-slate-950/40 backdrop-blur">
				<div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
					<div>
						<h1 className="text-2xl font-semibold text-white">
							Edit Resource Inventory
						</h1>
						<p className="mt-1 text-sm text-slate-400">
							Only Tier 3 can edit. Negative values are blocked.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={loadResources}
							className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.10]"
						>
							Refresh
						</button>

						<Link
							href="/inventory"
							className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
						>
							Back to Catalog →
						</Link>

						<Link
							href="/"
							className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
						>
							Home →
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-5xl px-6 py-10">
				<div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(2,6,23,0.65)] backdrop-blur">
					<div className="border-b border-white/10 px-6 py-4">
						{tier !== null ? (
							<p className="text-sm text-slate-300">Current tier: {tier}</p>
						) : (
							<p className="text-sm text-slate-300">
								Not authenticated or unable to determine tier.
							</p>
						)}

						{status ? (
							<p className="mt-2 text-sm text-slate-300">{status}</p>
						) : null}
					</div>

					{loading ? (
						<div className="px-6 py-10 text-sm text-slate-300">Loading…</div>
					) : tier !== null && tier < 3 ? (
						<div className="px-6 py-10 text-sm text-slate-300">
							Access denied: Tier 3 required.
							<div className="mt-4">
								<Link
									href="/inventory"
									className="text-emerald-300 hover:text-emerald-200"
								>
									Back to Catalog →
								</Link>
							</div>
						</div>
					) : rows.length === 0 ? (
						<div className="px-6 py-10 text-sm text-slate-400">
							No resources found.
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead className="bg-white/[0.04] text-slate-200">
									<tr>
										<th className="px-6 py-3 font-semibold">Shelter</th>
										<th className="px-6 py-3 font-semibold">Resource</th>
										<th className="px-6 py-3 font-semibold">Current Qty</th>
										<th className="px-6 py-3 font-semibold">New Qty</th>
										<th className="px-6 py-3 font-semibold">Action</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/10">
									{rows.map((r) => (
										<tr key={r.id} className="hover:bg-white/[0.03]">
											<td className="px-6 py-3 text-slate-300">
												{r.shelter_name ?? "—"}
											</td>
											<td className="px-6 py-3 font-medium text-white">
												{r.name ?? "—"}
											</td>
											<td className="px-6 py-3 text-slate-200">
												{r.total_qty ?? 0}
											</td>
											<td className="px-6 py-3">
												<input
													type="number"
													min={0}
													step={1}
													value={editQty[r.id] ?? "0"}
													onChange={(e) =>
														setEditQty((prev) => ({
															...prev,
															[r.id]: e.target.value,
														}))
													}
													className="w-32 rounded-lg border border-white/10 bg-[#0b1b18] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
												/>
											</td>
											<td className="px-6 py-3">
												<button
													type="button"
													onClick={() => saveRow(r.id)}
													disabled={tier === null || tier < 3}
													className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
												>
													Save
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
