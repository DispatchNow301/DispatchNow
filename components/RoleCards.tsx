"use client";
import React from "react";
import { FaUser, FaHandshake, FaShield } from "react-icons/fa6";

const ROLES = [
	{
		icon: FaUser,
		label: "Citizen",
		color: "#60a5fa", // blue
		description:
			"Report disasters as they happen. Submit requests for basic aid and help your community stay informed during emergencies.",
		perks: ["Report incidents", "Request medical aid", "View alerts"],
	},
	{
		icon: FaHandshake,
		label: "Volunteer",
		color: "#34d399", // green
		description:
			"Appointed trusted volunteers who can request resources and coordinate local relief efforts without upper-level approval for minor requests.",
		perks: [
			"Approve citizen reports",
			"Request resources",
			"Coordinate relief",
		],
	},
	{
		icon: FaShield,
		label: "Authority",
		color: "#fd4d4d", // red
		description:
			"First responders, hospital workers, and local officials with full platform access. Requests are instantly processed and dispatched.",
		perks: [
			"Auto-approved requests",
			"Full resource access",
			"Dispatch teams",
		],
	},
];

export default function RoleCards() {
	return (
		<div className="w-full px-8 max-w-7xl mx-auto py-24 space-y-14">
			<div className="space-y-3">
				<h1 className="text-5xl font-extrabold font-sans text-white">
					Everything you need in one place
				</h1>
				<p className="text-neutral-500 text-lg max-w-xl">
					Three tiers of access, built for every kind of responder —
					from everyday citizens to regional authorities.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{ROLES.map(
					({ icon: Icon, label, color, description, perks }) => (
						<div
							key={label}
							className="group relative rounded-2xl p-6 flex flex-col gap-6 cursor-pointer transition-all duration-500"
							style={{
								background: "rgba(255,255,255,0.02)",
								border: `1px solid rgba(255,255,255,0.07)`,
								backdropFilter: "blur(8px)",
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLElement).style.border =
									`1px solid ${color}30`;
								(
									e.currentTarget as HTMLElement
								).style.background = `rgba(255,255,255,0.04)`;
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.border =
									`1px solid rgba(255,255,255,0.07)`;
								(
									e.currentTarget as HTMLElement
								).style.background = `rgba(255,255,255,0.02)`;
							}}
						>
							{/* Subtle corner glow on hover */}
							<div
								className="absolute top-0 right-0 w-32 h-32 rounded-tr-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
								style={{
									background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`,
								}}
							/>

							{/* Icon block */}
							<div className="relative w-16 h-16">
								{/* Foreground icon container */}
								<div
									className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
									style={{
										background: `${color}15`,
										border: `1.5px solid ${color}30`,
									}}
								>
									<Icon
										style={{
											color: color,
											fontSize: "1.6rem",
										}}
									/>
								</div>
							</div>

							{/* Text */}
							<div className="space-y-2">
								<h3 className="text-white text-2xl font-bold">
									{label}
								</h3>
								<p className="text-neutral-500 text-sm leading-relaxed">
									{description}
								</p>
							</div>

							{/* Perks */}
							<ul className="flex flex-col gap-2 mt-auto">
								{perks.map((perk) => (
									<li
										key={perk}
										className="flex items-center gap-2.5"
									>
										<span
											className="w-1.5 h-1.5 rounded-full flex-shrink-0"
											style={{ background: color }}
										/>
										<span className="text-neutral-400 text-sm">
											{perk}
										</span>
									</li>
								))}
							</ul>

							{/* Bottom accent line */}
							<div
								className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
								style={{
									background: `linear-gradient(90deg, transparent, ${color}50, transparent)`,
								}}
							/>
						</div>
					),
				)}
			</div>
		</div>
	);
}
