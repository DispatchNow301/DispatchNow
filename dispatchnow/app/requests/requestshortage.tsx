// File: app/requests/requestshortage.tsx
// Purpose: Shortage Handling MVP UI. User selects a shelter, chooses or types an item name, enters quantity, and submits a request.
//          Layout uses a dark gradient background + glass cards to match the app's auth/session styling.

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CatalogRow = {
	shelter_name?: string | null;
	resource_name: string | null;
	available_qty: number | null;
	reserved_qty: number | null;
};

type CatalogResp =
	| { ok: true; tier: number; rows: CatalogRow[] }
	| { ok: false; error: string };

type CreateResp =
	| {
		ok: true;
		tier: number;
		request_id: string;
		status: "fulfilled" | "partial" | "out_of_stock";
		message: string;
		requested_qty: number;
		allocated_qty: number;
		meta?: {
			available_qty?: number;
			reserved_qty?: number;
			placeholder_resource_created?: boolean;
		};
	}
	| { ok: false; error: string };

export default function RequestShortage() {
	const [loading, setLoading] = useState(true);
	const [tier, setTier] = useState<number | null>(null);
	const [rows, setRows] = useState<CatalogRow[]>([]);
	const [error, setError] = useState<string>("");

	const [shelterName, setShelterName] = useState<string>("Central Shelter");
	const [itemName, setItemName] = useState<string>("");
	const [qty, setQty] = useState<number>(1);

	const [result, setResult] = useState<string>("");

	async function loadCatalog() {
		setLoading(true);
		setError("");
		setResult("");

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

	const shelters = useMemo(() => {
		const set = new Set<string>();
		set.add("Central Shelter");
		for (const r of rows) {
			if (r.shelter_name && r.shelter_name.trim()) {
				set.add(r.shelter_name.trim());
			}
		}
		return Array.from(set).sort((a, b) => a.localeCompare(b));
	}, [rows]);

	const itemSuggestions = useMemo(() => {
		const s = new Set<string>();
		const chosenShelter = shelterName.trim();

		for (const r of rows) {
			const rowShelter = (r.shelter_name ?? "Central Shelter").trim();
			if (rowShelter !== chosenShelter) continue;
			if (r.resource_name && r.resource_name.trim()) {
				s.add(r.resource_name.trim());
			}
		}
		return Array.from(s).sort((a, b) => a.localeCompare(b));
	}, [rows, shelterName]);

	const currentStats = useMemo(() => {
		const chosenShelter = shelterName.trim();
		const chosenItem = itemName.trim().toLowerCase();
		if (!chosenItem) return null;

		const hit = rows.find((r) => {
			const rowShelter = (r.shelter_name ?? "Central Shelter").trim();
			const rowItem = (r.resource_name ?? "").trim().toLowerCase();
			return rowShelter === chosenShelter && rowItem === chosenItem;
		});

		return hit ?? null;
	}, [rows, shelterName, itemName]);

	async function onSubmit() {
		setError("");
		setResult("");

		const s = shelterName.trim();
		const i = itemName.trim();
		const q = Number.isFinite(qty) ? Math.floor(qty) : 0;

		if (!s) return setError("Please select a shelter.");
		if (!i) return setError("Please choose or type an item name.");
		if (q <= 0) return setError("Quantity must be a positive integer.");

		const resp = await fetch("/api/requests/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				shelter_name: s,
				item_name: i,
				qty: q,
			}),
		});

		const json = (await resp.json()) as CreateResp;

		if (!resp.ok || !json.ok) {
			setError(json.ok ? "Request failed." : json.error);
			return;
		}

		const extra =
			json.meta?.placeholder_resource_created
				? " (New item placeholder created with qty=0)"
				: "";

		setResult(`${json.status.toUpperCase()}: ${json.message}${extra}`);

		await loadCatalog();
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
			<header className="border-b border-white/10 bg-slate-950/40 backdrop-blur">
				<div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
					<div>
						<h1 className="text-2xl font-semibold text-white">
							Shortage Handling
						</h1>
						<p className="mt-1 text-sm text-slate-400">
							{tier ? `Current tier: ${tier}` : "Tier 2+ required"}
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
							className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
						>
							Back home →
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-5xl px-6 py-10">
				<div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(2,6,23,0.65)] backdrop-blur">
					<div className="border-b border-white/10 px-6 py-4">
						<p className="text-sm text-slate-300">
							Submit a request even if inventory is insufficient. The response will be fulfilled, partial, or out of stock.
						</p>
					</div>

					{loading ? (
						<div className="px-6 py-10 text-sm text-slate-300">
							Loading…
						</div>
					) : (
						<div className="px-6 py-8">
							{error ? (
								<div className="mb-5 rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-200">
									{error}
								</div>
							) : null}

							{result ? (
								<div className="mb-5 rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-200">
									{result}
								</div>
							) : null}

							{/* One-row layout on desktop, stacked on mobile */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
								<label className="md:col-span-4">
									<span className="block text-sm font-medium text-slate-200">
										Shelter
									</span>
									<select
										value={shelterName}
										onChange={(e) => setShelterName(e.target.value)}
										className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0b1b18] px-3 py-2.5 text-base text-white shadow-inner shadow-black/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
									>
										{shelters.map((s) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</select>
								</label>

								<label className="md:col-span-5">
									<span className="block text-sm font-medium text-slate-200">
										Resource
									</span>
									<input
										type="text"
										value={itemName}
										onChange={(e) => setItemName(e.target.value)}
										list="item-suggestions"
										placeholder="Choose an existing item or type a new name"
										className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0b1b18] px-3 py-2.5 text-base text-white placeholder-slate-500 shadow-inner shadow-black/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
									/>
									<datalist id="item-suggestions">
										{itemSuggestions.map((name) => (
											<option key={name} value={name} />
										))}
									</datalist>
								</label>

								<label className="md:col-span-3">
									<span className="block text-sm font-medium text-slate-200">
										Quantity
									</span>
									<input
										type="number"
										min={1}
										value={qty}
										onChange={(e) => setQty(Number(e.target.value))}
										className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0b1b18] px-3 py-2.5 text-base text-white shadow-inner shadow-black/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
									/>
								</label>
							</div>

							<div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-300">
								<span>
									Available:{" "}
									<span className="text-slate-200">
										{currentStats?.available_qty ?? "—"}
									</span>
								</span>
								<span>
									Reserved:{" "}
									<span className="text-slate-200">
										{currentStats?.reserved_qty ?? "—"}
									</span>
								</span>
							</div>

							<button
								type="button"
								onClick={onSubmit}
								className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400"
							>
								Submit request
							</button>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
