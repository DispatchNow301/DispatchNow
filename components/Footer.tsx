"use client";
import React from "react";
import Link from "next/link";
import { FaXTwitter, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa6";
import { MdOutlineRadar } from "react-icons/md";

const FOOTER_LINKS = {
	Product: [
		{ label: "Overview", href: "/overview" },
		{ label: "Features", href: "/features" },
		{ label: "Pricing", href: "/pricing" },
		{ label: "Changelog", href: "/changelog" },
		{ label: "Roadmap", href: "/roadmap" },
	],
	Solutions: [
		{ label: "Citizen Reporting", href: "/solutions/citizen" },
		{ label: "Emergency Response", href: "/solutions/response" },
		{ label: "Resource Allocation", href: "/solutions/resources" },
		{ label: "Team Coordination", href: "/solutions/teams" },
		{ label: "Analytics & Insights", href: "/solutions/analytics" },
	],
	Developers: [
		{ label: "API Reference", href: "/docs/api" },
		{ label: "Documentation", href: "/docs" },
		{ label: "SDKs", href: "/docs/sdks" },
		{ label: "Webhooks", href: "/docs/webhooks" },
		{ label: "Status Page", href: "/status" },
	],
	Company: [
		{ label: "About", href: "/about" },
		{ label: "Blog", href: "/blog" },
		{ label: "Careers", href: "/careers" },
		{ label: "Press", href: "/press" },
		{ label: "Contact", href: "/contact" },
	],
};

const SOCIAL_LINKS = [
	{ icon: FaXTwitter, href: "https://x.com", label: "X / Twitter" },
	{ icon: FaGithub, href: "https://github.com", label: "GitHub" },
	{ icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
	{ icon: FaDiscord, href: "https://discord.com", label: "Discord" },
];

export default function Footer() {
	return (
		<footer
			className="relative w-full overflow-hidden"
			style={{
				background:
					"linear-gradient(to bottom, #090909 0%, #0d0d0d 100%)",
				borderTop: "1px solid rgba(253, 77, 77, 0.08)",
			}}
		>
			{/* Subtle top glow line */}
			<div
				className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px pointer-events-none"
				style={{
					background:
						"linear-gradient(90deg, transparent, rgba(253,77,77,0.4), transparent)",
				}}
			/>

			{/* Background grid texture */}
			<div
				className="absolute inset-0 pointer-events-none opacity-30"
				style={{
					backgroundImage: `
						linear-gradient(rgba(253, 77, 77, 0.03) 1px, transparent 1px),
						linear-gradient(90deg, rgba(253, 77, 77, 0.03) 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Radial fade to hide grid at edges */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 40%, #090909 100%)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-8 pt-20 pb-10">
				{/* Top section: Brand + Newsletter */}
				<div
					className="flex flex-col lg:flex-row justify-between gap-12 mb-16 pb-16"
					style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
				>
					{/* Brand */}
					<div className="flex flex-col gap-5 max-w-sm">
						<div className="flex items-center gap-2.5">
							<div
								className="w-9 h-9 rounded-lg flex items-center justify-center"
								style={{
									background: "rgba(253,77,77,0.12)",
									border: "1px solid rgba(253,77,77,0.25)",
								}}
							>
								<MdOutlineRadar
									className="text-[#fd4d4d]"
									size={20}
								/>
							</div>
							<span className="text-white font-extrabold text-xl tracking-tight">
								Dispatch
								<span className="text-[#fd4d4d]">Now</span>
							</span>
							<span
								className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
								style={{
									color: "#fd4d4d",
									background: "rgba(253,77,77,0.1)",
									border: "1px solid rgba(253,77,77,0.15)",
								}}
							>
								Beta
							</span>
						</div>
						<p className="text-neutral-500 text-sm leading-relaxed">
							The intelligent platform for disaster response
							coordination. Report, respond, and recover — faster
							than ever before.
						</p>
						<div className="flex items-center gap-3">
							{SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
								<a
									key={label}
									href={href}
									aria-label={label}
									target="_blank"
									rel="noopener noreferrer"
									className="group w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
									style={{
										background: "rgba(255,255,255,0.03)",
										border: "1px solid rgba(255,255,255,0.07)",
									}}
									onMouseEnter={(e) => {
										(
											e.currentTarget as HTMLElement
										).style.background =
											"rgba(253,77,77,0.1)";
										(
											e.currentTarget as HTMLElement
										).style.borderColor =
											"rgba(253,77,77,0.3)";
									}}
									onMouseLeave={(e) => {
										(
											e.currentTarget as HTMLElement
										).style.background =
											"rgba(255,255,255,0.03)";
										(
											e.currentTarget as HTMLElement
										).style.borderColor =
											"rgba(255,255,255,0.07)";
									}}
								>
									<Icon
										className="text-neutral-500 group-hover:text-[#fd4d4d] transition-colors duration-300"
										size={16}
									/>
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
					<p className="text-neutral-600 text-xs">
						© {new Date().getFullYear()} DispatchNow, Inc. All
						rights reserved.
					</p>
					<div className="flex items-center gap-6">
						{[
							{ label: "Privacy Policy", href: "/privacy" },
							{ label: "Terms of Service", href: "/terms" },
							{ label: "Cookie Policy", href: "/cookies" },
						].map(({ label, href }) => (
							<Link
								key={label}
								href={href}
								className="text-neutral-600 text-xs hover:text-neutral-400 transition-colors duration-200"
							>
								{label}
							</Link>
						))}
					</div>
					<div className="flex items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
						<p className="text-neutral-600 text-xs">
							All systems operational
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
