"use client";
import React, { useEffect, useRef, useState } from "react";

const STATS = [
	{
		value: 12400,
		suffix: "+",
		label: "Incidents Reported",
		sublabel: "across all regions",
		color: "#fd4d4d",
	},
	{
		value: 98,
		suffix: "%",
		label: "Response Rate",
		sublabel: "within 10 minutes",
		color: "#60a5fa",
	},
	{
		value: 340,
		suffix: "+",
		label: "Active Authorities",
		sublabel: "on the platform",
		color: "#34d399",
	},
	{
		value: 5200,
		suffix: "+",
		label: "Resources Deployed",
		sublabel: "in the last 30 days",
		color: "#f59e0b",
	},
];

function useCountUp(target: number, duration = 2000, started: boolean) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!started) return;
		let startTime: number | null = null;
		const step = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			// ease out expo
			const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
			setCount(Math.floor(eased * target));
			if (progress < 1) requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	}, [started, target, duration]);

	return count;
}

function StatCard({
	value,
	suffix,
	label,
	sublabel,
	color,
	started,
}: (typeof STATS)[0] & { started: boolean }) {
	const count = useCountUp(value, 2000, started);

	return (
		<div
			className="group relative flex-1 flex flex-col gap-3 px-8 py-10 rounded-2xl overflow-hidden transition-all duration-500"
			style={{
				background: "rgba(255,255,255,0.02)",
				border: "1px solid rgba(255,255,255,0.06)",
			}}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.background =
					"rgba(255,255,255,0.04)";
				(e.currentTarget as HTMLElement).style.border =
					`1px solid ${color}30`;
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.background =
					"rgba(255,255,255,0.02)";
				(e.currentTarget as HTMLElement).style.border =
					"1px solid rgba(255,255,255,0.06)";
			}}
		>
			{/* Corner glow */}
			<div
				className="absolute top-0 left-0 w-40 h-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
				style={{
					background: `radial-gradient(circle at top left, ${color}18, transparent 70%)`,
				}}
			/>

			{/* Top accent line */}
			<div
				className="absolute top-0 left-8 right-8 h-px"
				style={{
					background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
				}}
			/>

			{/* Number */}
			<div
				className="text-6xl font-black tracking-tight leading-none tabular-nums"
				style={{
					color,
					textShadow: `0 0 40px ${color}40`,
				}}
			>
				{count.toLocaleString()}
				<span className="text-5xl">{suffix}</span>
			</div>

			{/* Label */}
			<div className="space-y-0.5">
				<p className="text-white font-bold text-lg">{label}</p>
				<p className="text-neutral-500 text-sm">{sublabel}</p>
			</div>
		</div>
	);
}

export default function StatsSection() {
	const ref = useRef<HTMLDivElement>(null);
	const [started, setStarted] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setStarted(true);
			},
			{ threshold: 0.3 },
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className="w-full max-w-7xl mx-auto px-8 py-10">
			<div className="flex flex-col md:flex-row gap-4">
				{STATS.map((stat) => (
					<StatCard key={stat.label} {...stat} started={started} />
				))}
			</div>
		</div>
	);
}
