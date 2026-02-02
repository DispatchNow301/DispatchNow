// File: app/inventory/page.tsx
// Purpose: Render the Resource Catalog by calling GET /api/inventory/catalog (Tier 2+). Shows an edit link for Tier 3.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CatalogRow = {
	shelter_name?: string | null;
	resource_name: string | null;
	available_qty: number | null;
	reserved_qty: number | null;
};

type CatalogResp =
	| { ok: true; tier: number; rows: CatalogRow[] }
	| { ok: false; error: string };

export default function InventoryPage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");
	const [tier, setTier] = useState<number | null>(null);
	const [rows, setRows] = useState<CatalogRow[]>([]);

	async function loadCatalog() {
		setLoading(true);
		setError("");

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
		setLoading(false);
	}

	useEffect(() => {
		loadCatalog();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
			<header className="border-b border-white/10 bg-slate-950/40 backdrop-blur">
				<div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
					<div>
						<h1 className="text-2xl font-semibold text-white">
							Resource Catalog
						</h1>
						<p className="mt-1 text-sm text-slate-400">
							{tier ? `Tier ${tier} access` : "Inventory module"}
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

						{tier !== null && tier >= 3 ? (
							<Link
								href="/inventory/edit"
								className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
							>
								Edit Inventory
							</Link>
						) : null}

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
				<div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(2,6,23,0.65)] backdrop-blur">
					<div className="border-b border-white/10 px-6 py-4">
						<p className="text-sm text-slate-300">
							Catalog shows resource name, available quantity, and reserved quantity.
						</p>
					</div>

					{loading ? (
						<div className="px-6 py-10 text-sm text-slate-300">Loading…</div>
					) : error ? (
						<div className="px-6 py-10 text-sm text-slate-300">
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
					) : rows.length === 0 ? (
						<div className="px-6 py-10 text-sm text-slate-400">
							No resources found. Seed the database first.
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead className="bg-white/[0.04] text-slate-200">
									<tr>
										<th className="px-6 py-3 font-semibold">Resource</th>
										<th className="px-6 py-3 font-semibold">Available</th>
										<th className="px-6 py-3 font-semibold">Reserved</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/10">
									{rows.map((r, idx) => (
										<tr key={idx} className="hover:bg-white/[0.03]">
											<td className="px-6 py-3 font-medium text-white">
												{r.resource_name ?? "—"}
											</td>
											<td className="px-6 py-3 text-slate-200">
												{r.available_qty ?? 0}
											</td>
											<td className="px-6 py-3 text-slate-200">
												{r.reserved_qty ?? 0}
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
