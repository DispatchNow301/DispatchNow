"use client";
import React, { useState } from "react";
import { FaFire, FaBoxOpen, FaShieldHalved, FaTruck } from "react-icons/fa6";
import {
	FiAlertTriangle,
	FiCheckCircle,
	FiClock,
	FiMapPin,
	FiRadio,
	FiZap,
} from "react-icons/fi";

const tabs = [
	{ id: "report", label: "Report Disaster", icon: FiAlertTriangle },
	{ id: "resources", label: "Request Resources", icon: FaBoxOpen },
	{ id: "incident", label: "Create Incident", icon: FaShieldHalved },
	{ id: "dispatch", label: "Dispatch", icon: FaTruck },
];

const ReportCard = () => (
	<div className="flex flex-col gap-4">
		{/* Big feature card */}
		<div
			className="rounded-2xl p-6 relative overflow-hidden"
			style={{
				background:
					"linear-gradient(135deg, #1a0a0a 0%, #2d0f0f 60%, #1a0a0a 100%)",
				border: "1px solid rgba(253,77,77,0.2)",
			}}
		>
			<div
				className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
				style={{
					background: "radial-gradient(circle, #fd4d4d, transparent)",
					transform: "translate(30%, -30%)",
				}}
			/>
			<div className="flex items-center gap-2 mb-4">
				<span className="flex items-center gap-1.5 bg-[#fd4d4d] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
					<FiAlertTriangle size={10} /> Live Report
				</span>
				<span className="text-neutral-500 text-xs ml-auto">
					just now
				</span>
			</div>
			<p className="text-2xl font-bold text-white mb-1">Structure Fire</p>
			<div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-4">
				<FiMapPin size={12} />
				<span>142 Maple Ave, Milton, ON</span>
			</div>
			<p className="text-neutral-400 text-sm leading-relaxed mb-5">
				Three-storey residential building fully engulfed. Residents
				trapped on upper floors. Gas line may be ruptured. Smoke visible
				from 2km radius.
			</p>
			<div className="flex gap-2 flex-wrap">
				{["Fire", "Entrapment", "Gas Leak"].map((tag) => (
					<span
						key={tag}
						className="text-[#fd4d4d] text-[11px] font-semibold border border-[#fd4d4d]/30 bg-[#fd4d4d]/10 px-2.5 py-1 rounded-full"
					>
						{tag}
					</span>
				))}
			</div>
			<div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded-full bg-[#fd4d4d]/20 flex items-center justify-center">
						<span className="text-[10px] text-[#fd4d4d] font-bold">
							JR
						</span>
					</div>
					<span className="text-neutral-500 text-xs">
						Reported by James R.
					</span>
				</div>
				<span className="text-[#fd4d4d] text-xs font-semibold cursor-pointer hover:underline">
					View on map →
				</span>
			</div>
		</div>

		{/* Two small cards */}
		<div className="grid grid-cols-2 gap-4">
			<div
				className="rounded-2xl p-4"
				style={{ background: "#111", border: "1px solid #222" }}
			>
				<div className="flex items-center gap-2 mb-2">
					<FiRadio size={14} className="text-orange-400" />
					<span className="text-orange-400 text-[10px] font-bold uppercase tracking-widest">
						Alert Sent
					</span>
				</div>
				<p className="text-white text-sm font-semibold">
					Nearby units notified
				</p>
				<p className="text-neutral-500 text-xs mt-1">
					6 units within 3km radius
				</p>
			</div>
			<div
				className="rounded-2xl p-4"
				style={{ background: "#111", border: "1px solid #222" }}
			>
				<div className="flex items-center gap-2 mb-2">
					<FiClock size={14} className="text-blue-400" />
					<span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
						Response Time
					</span>
				</div>
				<p className="text-white text-sm font-semibold">
					Avg. 4 min ETA
				</p>
				<p className="text-neutral-500 text-xs mt-1">
					Based on current traffic
				</p>
			</div>
		</div>
	</div>
);

const ResourcesCard = () => (
	<div className="flex flex-col gap-4">
		<div
			className="rounded-2xl p-6"
			style={{
				background:
					"linear-gradient(135deg, #0a0f1a 0%, #0f1d2d 60%, #0a0f1a 100%)",
				border: "1px solid rgba(59,130,246,0.2)",
			}}
		>
			<div className="flex items-center gap-2 mb-4">
				<span className="flex items-center gap-1.5 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
					<FaBoxOpen size={10} /> Resource Request
				</span>
				<span className="text-neutral-500 text-xs ml-auto">
					2 min ago
				</span>
			</div>
			<p className="text-xl font-bold text-white mb-1">
				Medical Supplies Needed
			</p>
			<div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-4">
				<FiMapPin size={12} />
				<span>Incident #2847 · Milton Fire Station 3</span>
			</div>
			<div className="space-y-2 mb-4">
				{[
					{ item: "Trauma Kits", qty: "×12", status: "Pending" },
					{ item: "Oxygen Tanks", qty: "×4", status: "En Route" },
					{ item: "Stretchers", qty: "×6", status: "Confirmed" },
				].map(({ item, qty, status }) => (
					<div
						key={item}
						className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5"
					>
						<span className="text-white text-sm font-medium">
							{item}
						</span>
						<span className="text-neutral-400 text-sm">{qty}</span>
						<span
							className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
								status === "Confirmed"
									? "text-green-400 bg-green-400/10"
									: status === "En Route"
										? "text-blue-400 bg-blue-400/10"
										: "text-yellow-400 bg-yellow-400/10"
							}`}
						>
							{status}
						</span>
					</div>
				))}
			</div>
			<div className="pt-4 border-t border-white/5 flex justify-between items-center">
				<span className="text-neutral-500 text-xs">
					Requested by: Incident Commander
				</span>
				<span className="text-blue-400 text-xs font-semibold cursor-pointer hover:underline">
					Approve all →
				</span>
			</div>
		</div>
		<div
			className="rounded-2xl p-4"
			style={{ background: "#111", border: "1px solid #222" }}
		>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-white text-sm font-semibold">
						Regional Inventory
					</p>
					<p className="text-neutral-500 text-xs mt-0.5">
						Real-time stock across 14 stations
					</p>
				</div>
				<div className="flex items-center gap-1.5">
					<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
					<span className="text-green-400 text-xs font-semibold">
						Live
					</span>
				</div>
			</div>
		</div>
	</div>
);

const IncidentCard = () => (
	<div className="flex flex-col gap-4">
		<div
			className="rounded-2xl p-6 relative overflow-hidden"
			style={{
				background:
					"linear-gradient(135deg, #0d0a1a 0%, #1a0f2d 60%, #0d0a1a 100%)",
				border: "1px solid rgba(139,92,246,0.25)",
			}}
		>
			<div
				className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
				style={{
					background: "radial-gradient(circle, #8b5cf6, transparent)",
					transform: "translate(30%, -30%)",
				}}
			/>
			<div className="flex items-center gap-2 mb-4">
				<span className="flex items-center gap-1.5 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
					<FaShieldHalved size={10} /> Authority · Incident Created
				</span>
				<span className="text-neutral-500 text-xs ml-auto">
					5 min ago
				</span>
			</div>
			<p className="text-xl font-bold text-white mb-1">
				INC-2847 · Major Structure Fire
			</p>
			<div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-5">
				<FiMapPin size={12} />
				<span>142 Maple Ave — Severity Level 4</span>
			</div>

			<div className="grid grid-cols-3 gap-3 mb-5">
				{[
					{ label: "Units Assigned", val: "8" },
					{ label: "Civilians Affected", val: "23" },
					{ label: "Est. Duration", val: "3–5 hrs" },
				].map(({ label, val }) => (
					<div
						key={label}
						className="bg-white/5 rounded-xl p-3 text-center"
					>
						<p className="text-white font-bold text-lg">{val}</p>
						<p className="text-neutral-500 text-[10px] mt-0.5">
							{label}
						</p>
					</div>
				))}
			</div>

			<div className="space-y-2">
				<p className="text-neutral-500 text-[11px] uppercase tracking-widest font-semibold mb-2">
					Assigned Commanders
				</p>
				{["Chief D. Okafor", "Capt. S. Mehta"].map((name) => (
					<div
						key={name}
						className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2"
					>
						<div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
							<span className="text-[10px] text-violet-400 font-bold">
								{name
									.split(" ")
									.map((w) => w[0])
									.join("")
									.slice(0, 2)}
							</span>
						</div>
						<span className="text-white text-sm">{name}</span>
						<FiCheckCircle
							className="ml-auto text-green-400"
							size={14}
						/>
					</div>
				))}
			</div>
		</div>
	</div>
);

const DispatchCard = () => (
	<div className="flex flex-col gap-4">
		<div
			className="rounded-2xl p-6"
			style={{
				background:
					"linear-gradient(135deg, #0a120a 0%, #0f1f0f 60%, #0a120a 100%)",
				border: "1px solid rgba(34,197,94,0.2)",
			}}
		>
			<div className="flex items-center gap-2 mb-4">
				<span className="flex items-center gap-1.5 bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
					<FiZap size={10} /> Dispatched
				</span>
				<div className="flex items-center gap-1.5 ml-auto">
					<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
					<span className="text-green-400 text-xs font-semibold">
						En Route
					</span>
				</div>
			</div>
			<p className="text-xl font-bold text-white mb-1">
				Resources Dispatched
			</p>
			<p className="text-neutral-400 text-sm mb-5">
				INC-2847 · 142 Maple Ave, Milton
			</p>

			<div className="space-y-3 mb-5">
				{[
					{
						unit: "Engine 7",
						type: "Fire Suppression",
						eta: "2 min",
						progress: 85,
					},
					{
						unit: "Medic 3",
						type: "Advanced Life Support",
						eta: "4 min",
						progress: 65,
					},
					{
						unit: "Rescue 1",
						type: "Heavy Rescue",
						eta: "6 min",
						progress: 45,
					},
					{
						unit: "Tanker 2",
						type: "Water Supply",
						eta: "8 min",
						progress: 30,
					},
				].map(({ unit, type, eta, progress }) => (
					<div key={unit} className="bg-white/5 rounded-xl px-4 py-3">
						<div className="flex items-center justify-between mb-2">
							<div>
								<p className="text-white text-sm font-semibold">
									{unit}
								</p>
								<p className="text-neutral-500 text-xs">
									{type}
								</p>
							</div>
							<span className="text-green-400 text-xs font-bold">
								{eta}
							</span>
						</div>
						<div className="w-full h-1.5 rounded-full bg-white/10">
							<div
								className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				))}
			</div>

			<div className="pt-4 border-t border-white/5 flex justify-between">
				<span className="text-neutral-500 text-xs">
					Authorized by: Chief D. Okafor
				</span>
				<span className="text-green-400 text-xs font-semibold cursor-pointer hover:underline">
					Track live →
				</span>
			</div>
		</div>
	</div>
);

const cardMap: Record<string, React.ReactNode> = {
	report: <ReportCard />,
	resources: <ResourcesCard />,
	incident: <IncidentCard />,
	dispatch: <DispatchCard />,
};

export default function AppFeedDemo() {
	const [active, setActive] = useState("report");

	return (
		<section
			className="w-full py-24 px-6"
			style={{ background: "transparent" }}
		>
			<div className="max-w-[82vw] mx-auto">
				{/* Header */}
				<div className="text-center mb-14">
					<div className="inline-block bg-[#fd4d4d]/10 px-4 py-2 rounded-full border border-[#fd4d4d]/10 mb-4">
						<p className="text-[#fd4d4d] text-xs font-semibold uppercase tracking-widest">
							See It In Action
						</p>
					</div>
					<h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
						The Full Response,{" "}
						<span
							className="text-[#fd4d4d]"
							style={{
								textShadow: "0 0 40px rgba(253,77,77,0.5)",
							}}
						>
							End to End
						</span>
					</h2>
					<p className="text-neutral-500 text-lg mt-4 max-w-xl mx-auto">
						From a citizen filing a report to resources arriving on
						scene — every step happens on one platform.
					</p>
				</div>

				{/* Tabs */}
				<div className="flex flex-wrap justify-center gap-3 mb-10">
					{tabs.map(({ id, label, icon: Icon }) => (
						<button
							key={id}
							onClick={() => setActive(id)}
							className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
								active === id
									? "bg-[#fd4d4d] text-white shadow-[0_0_20px_rgba(253,77,77,0.4)]"
									: "bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10 hover:text-white"
							}`}
						>
							<Icon size={13} />
							{label}
						</button>
					))}
				</div>

				{/* Card area */}
				<div className="max-w-2xl mx-auto transition-all duration-300">
					{cardMap[active]}
				</div>

				{/* Bottom label */}
				<p className="text-center text-neutral-600 text-sm mt-10">
					Experience the full workflow in the app. Real-time. Every
					role. One platform.
				</p>
			</div>
		</section>
	);
}
