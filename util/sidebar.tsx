// util/sidebar.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";

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
        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
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
      <path
        d="M12 15.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a7.9 7.9 0 0 0 .1-1l2-1.2-2-3.4-2.3.6a7.6 7.6 0 0 0-1.7-1L15 6h-6l-.5 2a7.6 7.6 0 0 0-1.7 1l-2.3-.6-2 3.4L4.6 14a7.9 7.9 0 0 0 .1 1l-2 1.2 2 3.4 2.3-.6a7.6 7.6 0 0 0 1.7 1l.5 2h6l.5-2a7.6 7.6 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

export default function Sidebar({ activeHref }: { activeHref?: string }) {
  const DISPATCH_ICON_HREF = "/";
  const HOME_HREF = "/dashboard";

  const itemsTop: NavItem[] = useMemo(
    () => [
      { href: HOME_HREF, label: "Dashboard", icon: <IconHome className="h-6 w-6" /> },
      { href: "/reports-catalog", label: "Reports", icon: <IconReports className="h-6 w-6" /> },
      { href: "/incidents-catalog", label: "Incidents", icon: <IconIncidents className="h-6 w-6" /> },
      { href: "/resource-catalog", label: "Resources", icon: <IconResources className="h-6 w-6" /> },
      { href: "/requests-catalog", label: "Requests", icon: <IconRequests className="h-6 w-6" /> },
      { href: "/profile/test", label: "Profile", icon: <IconProfile className="h-6 w-6" /> },
    ],
    []
  );

  const itemsBottom: NavItem[] = useMemo(
    () => [{ href: "/settings", label: "Settings", icon: <IconSettings className="h-6 w-6" /> }],
    []
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
          "block w-full",
          "transition",
          active ? "opacity-100" : "opacity-95 hover:opacity-100"
        )}
      >
        <div
          className={cn(
            "h-[56px] w-[56px] group-hover:w-full",
            "transition-[width] duration-200 ease-out",
            "grid grid-cols-[56px_1fr] items-center",
            "overflow-hidden",
            "rounded-2xl group-hover:rounded-2xl",
            active ? "bg-white/10" : "bg-white/5 hover:bg-white/10",
            "border border-[#D9D9D9]/10"
          )}
        >
          <span className="grid h-[56px] w-[56px] place-items-center text-[#D9D9D9]/90">
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
        "border-r border-[#D9D9D9]/10 bg-black/35 backdrop-blur-md"
      )}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-full flex-col px-3 py-4">
        <Link
          href={DISPATCH_ICON_HREF}
          title="DispatchNow"
          className="mb-4 inline-flex w-full justify-center group-hover:justify-start"
        >
          <div className="h-[56px] w-[56px] rounded-2xl border border-[#D9D9D9]/10 bg-[#8B000D] grid place-items-center">
            <IconSquare className="h-6 w-6 text-[#D9D9D9]" />
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-3">
          {itemsTop.map(Item)}
          <div className="flex-1" />
          {itemsBottom.map(Item)}
        </nav>
      </div>
    </aside>
  );
}