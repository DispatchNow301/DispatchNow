"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type NavItem = {
	href: string;
	label: string;
	icon: React.ReactNode;
};

function cn(...parts: Array<string | false | null | undefined>) {
	return parts.filter(Boolean).join(" ");
}

function IconSquare(props: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={props.className} fill="none">
			<path
				d="M6 6h12v12H6z"
				stroke="currentColor"
				strokeWidth="2"
				opacity="0.95"
			/>
		</svg>
	);
}

function IconHome(props: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={props.className} fill="none">
			<path
				d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function IconReports(props: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={props.className} fill="none">
			<path
				d="M7 3h9l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<path
				d="M14 3v4a1 1 0 0 0 1 1h4"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<path
				d="M8 12h8M8 16h8"
				stroke="currentColor"
				strokeWidth="2"
				opacity="0.9"
			/>
		</svg>
	);
}

function IconIncidents(props: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={props.className} fill="none">
			<path
				d="M12 2 3 20h18L12 2z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<path
				d="M12 9v5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M12 17h.01"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function IconResources(props: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={props.className} fill="none">
			<path
				d="M4 7l8-4 8 4-8 4-8-4z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<path
				d="M4 7v10l8 4 8-4V7"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<path
				d="M12 11v10"
				stroke="currentColor"
				strokeWidth="2"
				opacity="0.9"
			/>
		</svg>
	);
}

function IconRequests(props: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={props.className} fill="none">
			<path
				d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<path
				d="M8 9h8M8 13h5"
				stroke="currentColor"
				strokeWidth="2"
				opacity="0.9"
			/>
			<path
				d="M16.5 13.5 18 15l3-3"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function IconProfile(props: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={props.className} fill="none">
			<path
				d="M20 21a8 8 0 0 0-16 0"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</svg>
	);
}

function IconSettings(props: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={props.className} fill="none">
			<circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8" />
			<path
				d="M17.64 9.95 L19.88 10.61 L19.88 13.39 L17.64 14.05
           L16.60 15.86 L17.14 18.13 L14.74 19.52 L13.04 17.91
           L10.96 17.91 L9.26 19.52 L6.86 18.13 L7.40 15.86
           L6.36 14.05 L4.12 13.39 L4.12 10.61 L6.36 9.95
           L7.40 8.14 L6.86 5.87 L9.26 4.48 L10.96 6.09
           L13.04 6.09 L14.74 4.48 L17.14 5.87 L16.60 8.14 Z"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function Sidebar({ activeHref }: { activeHref?: string }) {
	const DISPATCH_ICON_HREF = "/";
	const HOME_HREF = "/dashboard";

	const [profileHref, setProfileHref] = useState("/profile/test");

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const supabase = getSupabaseBrowserClient();
				const { data: userRes } = await supabase.auth.getUser();
				const user = userRes?.user;

				if (!user?.id) return;

				const { data: profile, error } = await supabase
					.from("profiles")
					.select("username")
					.eq("id", user.id)
					.maybeSingle<{ username: string | null }>();

				if (cancelled) return;

				if (!error && profile?.username && profile.username.trim().length > 0) {
					setProfileHref(`/profile/${profile.username.trim()}`);
				}
			} catch {
				// keep fallback
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	const itemsTop: NavItem[] = useMemo(
		() => [
			{ href: HOME_HREF, label: "Dashboard", icon: <IconHome className="h-6 w-6" /> },
			{ href: "/reports-catalog", label: "Reports", icon: <IconReports className="h-6 w-6" /> },
			{ href: "/incidents-catalog", label: "Incidents", icon: <IconIncidents className="h-6 w-6" /> },
			{ href: "/resource-catalog", label: "Resources", icon: <IconResources className="h-6 w-6" /> },
			{ href: "/requests-catalog", label: "Requests", icon: <IconRequests className="h-6 w-6" /> },
			{ href: profileHref, label: "Profile", icon: <IconProfile className="h-6 w-6" /> },
		],
		[profileHref],
	);

	const itemsBottom: NavItem[] = useMemo(
		() => [{ href: "/settings", label: "Settings", icon: <IconSettings className="h-6 w-6" /> }],
		[],
	);

	const isActiveHref = (href: string) => {
		if (!activeHref) return false;
		if (activeHref === href) return true;
		const base = href.split("[")[0];
		return href.includes("[") && activeHref.startsWith(base);
	};

	const Item = (it: NavItem) => {
		const active = isActiveHref(it.href);
		return (
			<Link
				key={it.href}
				href={it.href}
				title={it.label}
				className={cn(
					"block w-full shrink-0 transition",
					active ? "opacity-100" : "opacity-95 hover:opacity-100",
				)}
			>
				<div
					className={cn(
						"h-[56px] min-h-[56px] w-[56px] group-hover:w-full",
						"transition-[width] duration-200 ease-out",
						"flex items-center",
						"overflow-hidden rounded-2xl border border-[#D9D9D9]/10",
						active ? "bg-white/10" : "bg-white/5 hover:bg-white/10",
					)}
				>
					<span className="flex h-[56px] w-[56px] shrink-0 items-center justify-center text-[#D9D9D9]/90">
						{it.icon}
					</span>
					<span className="hidden group-hover:block whitespace-nowrap pr-4 text-sm text-[#D9D9D9]/85">
						{it.label}
					</span>
				</div>
			</Link>
		);
	};

	return (
		<aside
			className={cn(
				"fixed left-0 top-0 z-50 h-screen",
				"group w-[84px] hover:w-[220px]",
				"transition-[width] duration-200 ease-out",
				"border-r border-[#D9D9D9]/10 bg-black/35 backdrop-blur-md",
			)}
			aria-label="Sidebar navigation"
		>
			<div className="flex h-full flex-col px-3 py-4">
				<Link
					href={DISPATCH_ICON_HREF}
					title="DispatchNow"
					className="mb-4 inline-flex w-full shrink-0 justify-center group-hover:justify-start"
				>
					<div className="h-[56px] min-h-[56px] w-[56px] min-w-[56px] rounded-2xl border border-[#D9D9D9]/10 bg-[#8B000D] grid place-items-center">
						<IconSquare className="h-6 w-6 text-[#D9D9D9]" />
					</div>
				</Link>

				<nav className="flex min-h-0 flex-1 flex-col gap-3">
					<div className="flex flex-col gap-3 overflow-y-auto">{itemsTop.map(Item)}</div>
					<div className="flex-1" />
					<div className="shrink-0 flex flex-col gap-3 pt-3">{itemsBottom.map(Item)}</div>
				</nav>
			</div>
		</aside>
	);
}