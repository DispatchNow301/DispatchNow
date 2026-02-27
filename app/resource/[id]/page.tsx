// app/resource/[id]/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import Sidebar from "@/util/sidebar";

type ResourceDTO = {
	id: string;
	name?: string | null;
	type?: string | null;
	category?: string | null;
	quantity?: number | null;
	location?: string | null;
	notes?: string | null;
	description?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

function fmt(ts?: string | null) {
	if (!ts) return "—";
	const d = new Date(ts);
	return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

async function getBaseUrl() {
	const h = await Promise.resolve(headers());
	const host = h.get("host") ?? "localhost:3000";
	const proto = h.get("x-forwarded-proto") ?? "http";
	return `${proto}://${host}`;
}

const cardStyle = {
	background: "rgba(20,20,20,0.85)",
	border: "1px solid rgba(255,255,255,0.07)",
	boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

const innerCardStyle = {
	background: "rgba(10,10,10,0.6)",
	border: "1px solid rgba(255,255,255,0.06)",
};

function LoadingCard() {
	return (
		<div
			className="rounded-2xl overflow-hidden animate-pulse"
			style={cardStyle}
		>
			<div
				className="px-6 py-5 flex items-start justify-between gap-4"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<div className="space-y-2">
					<div
						className="h-3 w-16 rounded"
						style={{ background: "rgba(255,255,255,0.06)" }}
					/>
					<div
						className="h-7 w-56 rounded-lg"
						style={{ background: "rgba(255,255,255,0.06)" }}
					/>
					<div
						className="h-3 w-32 rounded"
						style={{ background: "rgba(255,255,255,0.04)" }}
					/>
				</div>
				<div
					className="h-14 w-20 rounded-xl"
					style={{ background: "rgba(253,77,77,0.08)" }}
				/>
			</div>
			<div
				className="flex gap-2 px-6 py-4"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<div
					className="h-7 w-32 rounded-full"
					style={{ background: "rgba(255,255,255,0.05)" }}
				/>
				<div
					className="h-7 w-24 rounded-full"
					style={{ background: "rgba(255,255,255,0.05)" }}
				/>
				<div
					className="h-7 w-28 rounded-full"
					style={{ background: "rgba(255,255,255,0.05)" }}
				/>
			</div>
			<div className="grid gap-4 md:grid-cols-2 p-6">
				<div className="h-44 rounded-xl" style={innerCardStyle} />
				<div className="h-44 rounded-xl" style={innerCardStyle} />
			</div>
		</div>
	);
}

function NotFoundCard({ id }: { id: string }) {
	return (
		<div className="rounded-2xl overflow-hidden" style={cardStyle}>
			<div className="p-8">
				<p
					className="text-[10px] font-bold uppercase tracking-widest mb-3"
					style={{ color: "#fd4d4d" }}
				>
					Not Found
				</p>
				<h2 className="text-2xl font-extrabold text-white tracking-tight">
					Resource not found
				</h2>
				<p
					className="mt-2 text-sm"
					style={{ color: "rgba(217,217,217,0.45)" }}
				>
					Unable to find resource{" "}
					<span style={{ color: "rgba(217,217,217,0.8)" }}>{id}</span>
					. The ID may be invalid or you may not have access.
				</p>
				<Link
					href="/resource-catalog"
					className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:text-white"
					style={{
						background: "rgba(255,255,255,0.04)",
						border: "1px solid rgba(255,255,255,0.08)",
						color: "rgba(217,217,217,0.6)",
					}}
				>
					← Back to Resources
				</Link>
			</div>
		</div>
	);
}

function Field({
	label,
	value,
}: {
	label: string;
	value: string | number | null | undefined;
}) {
	return (
		<div
			className="flex justify-between gap-4 text-sm py-2.5"
			style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
		>
			<span style={{ color: "rgba(217,217,217,0.35)" }}>{label}</span>
			<span style={{ color: "rgba(217,217,217,0.8)" }}>
				{value ?? "—"}
			</span>
		</div>
	);
}

function Pill({ label, value }: { label: string; value?: string | null }) {
	return (
		<span
			className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
			style={{
				background: "rgba(255,255,255,0.04)",
				border: "1px solid rgba(255,255,255,0.08)",
			}}
		>
			<span style={{ color: "rgba(217,217,217,0.3)" }}>{label}</span>
			<span style={{ color: "rgba(217,217,217,0.85)" }}>
				{value ?? "—"}
			</span>
		</span>
	);
}

async function ResourceDetails({ id }: { id: string }) {
	const baseUrl = await getBaseUrl();
	const res = await fetch(`${baseUrl}/api/resource/${id}`, {
		cache: "no-store",
	});

	if (!res.ok) return <NotFoundCard id={id} />;

	const json = (await res.json()) as { data?: ResourceDTO };
	const r = json?.data;
	if (!r) return <NotFoundCard id={id} />;

	return (
		<div className="rounded-2xl overflow-hidden" style={cardStyle}>
			{/* Header */}
			<div
				className="flex items-start justify-between gap-4 px-6 py-5"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<div>
					<p
						className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
						style={{ color: "#fd4d4d" }}
					>
						Resource
					</p>
					<h2 className="text-2xl font-extrabold text-white tracking-tight">
						{r.name ?? "Unnamed Resource"}
					</h2>
					<p
						className="mt-1 text-xs"
						style={{ color: "rgba(217,217,217,0.35)" }}
					>
						ID: {r.id}
					</p>
				</div>

				<div
					className="flex flex-col items-center justify-center px-5 py-3 rounded-xl shrink-0"
					style={{
						background: "rgba(253,77,77,0.08)",
						border: "1px solid rgba(253,77,77,0.20)",
					}}
				>
					<span
						className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
						style={{ color: "rgba(253,77,77,0.5)" }}
					>
						Qty
					</span>
					<span
						className="text-2xl font-extrabold"
						style={{
							color: "#fd4d4d",
							textShadow: "0 0 20px rgba(253,77,77,0.4)",
						}}
					>
						{typeof r.quantity === "number" ? r.quantity : "—"}
					</span>
				</div>
			</div>

			{/* Pills */}
			<div
				className="flex flex-wrap gap-2 px-6 py-4"
				style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				<Pill label="Category" value={r.category} />
				<Pill label="Type" value={r.type} />
				<Pill label="Location" value={r.location} />
			</div>

			{/* Detail grid */}
			<div className="grid gap-4 md:grid-cols-2 p-6">
				<div className="rounded-xl p-5" style={innerCardStyle}>
					<h3
						className="text-[10px] font-bold uppercase tracking-widest mb-3"
						style={{ color: "rgba(217,217,217,0.35)" }}
					>
						Notes
					</h3>
					<p
						className="text-sm leading-6"
						style={{ color: "rgba(217,217,217,0.7)" }}
					>
						{r.notes ?? r.description ?? "No notes provided."}
					</p>
				</div>

				<div className="rounded-xl p-5" style={innerCardStyle}>
					<h3
						className="text-[10px] font-bold uppercase tracking-widest mb-3"
						style={{ color: "rgba(217,217,217,0.35)" }}
					>
						Info
					</h3>
					<Field label="Name" value={r.name} />
					<Field label="Quantity" value={r.quantity} />
					<Field label="Created" value={fmt(r.created_at)} />
					<Field label="Updated" value={fmt(r.updated_at)} />
				</div>
			</div>

			{/* Related */}
			<div className="mx-6 mb-6 rounded-xl p-5" style={innerCardStyle}>
				<h3
					className="text-[10px] font-bold uppercase tracking-widest mb-2"
					style={{ color: "rgba(217,217,217,0.35)" }}
				>
					Related Items
				</h3>
				<p
					className="text-sm"
					style={{ color: "rgba(217,217,217,0.3)" }}
				>
					If related requests or incidents exist, they will appear
					here.
				</p>
			</div>
		</div>
	);
}

export default async function ResourcePage({
	params,
}: {
	params: { id: string } | Promise<{ id: string }>;
}) {
	const { id } = await Promise.resolve(params);

	return (
		<main
			className="relative min-h-screen text-[#D9D9D9]"
			style={{ background: "#090909" }}
		>
			{/* Grid texture */}
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					backgroundImage: `
                        linear-gradient(rgba(253, 77, 77, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(253, 77, 77, 0.04) 1px, transparent 1px)
                    `,
					backgroundSize: "60px 60px",
					zIndex: 0,
				}}
			/>
			{/* Vignette */}
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 30%, #090909 100%)",
					zIndex: 1,
				}}
			/>
			{/* Red glow */}
			<div
				className="pointer-events-none fixed"
				style={{
					top: "-15%",
					right: "5%",
					width: "45%",
					height: "55%",
					background:
						"radial-gradient(circle, rgba(253,77,77,0.07) 0%, transparent 70%)",
					zIndex: 1,
				}}
			/>

			<Sidebar activeHref="/resource-catalog" />

			<div className="relative pl-[84px]" style={{ zIndex: 10 }}>
				<div className="mx-auto max-w-4xl px-6 py-10">
					<div className="mb-8">
						<Link
							href="/resource-catalog"
							className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:text-white"
							style={{ color: "rgba(217,217,217,0.35)" }}
						>
							← Back to Resources
						</Link>
						<h1 className="mt-4 text-4xl font-extrabold text-white tracking-tight">
							Resource Details
						</h1>
						<p
							className="mt-1 text-sm"
							style={{ color: "rgba(217,217,217,0.35)" }}
						>
							View category, quantity, location, and notes.
						</p>
					</div>

					<Suspense fallback={<LoadingCard />}>
						<ResourceDetails id={id} />
					</Suspense>
				</div>
			</div>
		</main>
	);
}
