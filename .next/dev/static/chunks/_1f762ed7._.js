(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase/browser-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabaseBrowserClient",
    ()=>getSupabaseBrowserClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
"use client";
;
let client = null;
function getSupabaseBrowserClient() {
    if (client) {
        return client;
    }
    const supabaseUrl = ("TURBOPACK compile-time value", "https://wcuvrdjqizlauwvrvdmk.supabase.co");
    const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdXZyZGpxaXpsYXV3dnJ2ZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzA0NTgsImV4cCI6MjA4NDk0NjQ1OH0.T9t4gViQwSoWR8pFTpyFD8v-XUB8sq6lDCoB9NDGjRM");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseAnonKey);
    return client;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/util/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$browser$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/browser-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function cn(...parts) {
    return parts.filter(Boolean).join(" ");
}
function IconSquare(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: props.className,
        fill: "none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M6 6h12v12H6z",
            stroke: "currentColor",
            strokeWidth: "2",
            opacity: "0.95"
        }, void 0, false, {
            fileName: "[project]/util/sidebar.tsx",
            lineNumber: 20,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, this);
}
_c = IconSquare;
function IconHome(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: props.className,
        fill: "none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/util/sidebar.tsx",
            lineNumber: 33,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 32,
        columnNumber: 3
    }, this);
}
_c1 = IconHome;
function IconReports(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: props.className,
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 3h9l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 46,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14 3v4a1 1 0 0 0 1 1h4",
                stroke: "currentColor",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 52,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8 12h8M8 16h8",
                stroke: "currentColor",
                strokeWidth: "2",
                opacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 57,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 45,
        columnNumber: 3
    }, this);
}
_c2 = IconReports;
function IconIncidents(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: props.className,
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2 3 20h18L12 2z",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 70,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 9v5",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 76,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 17h.01",
                stroke: "currentColor",
                strokeWidth: "3",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 82,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 69,
        columnNumber: 3
    }, this);
}
_c3 = IconIncidents;
function IconResources(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: props.className,
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 7l8-4 8 4-8 4-8-4z",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 95,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 7v10l8 4 8-4V7",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 101,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 11v10",
                stroke: "currentColor",
                strokeWidth: "2",
                opacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 107,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 94,
        columnNumber: 3
    }, this);
}
_c4 = IconResources;
function IconRequests(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: props.className,
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
                stroke: "currentColor",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 120,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8 9h8M8 13h5",
                stroke: "currentColor",
                strokeWidth: "2",
                opacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 125,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16.5 13.5 18 15l3-3",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 131,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 119,
        columnNumber: 3
    }, this);
}
_c5 = IconRequests;
function IconProfile(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: props.className,
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 21a8 8 0 0 0-16 0",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 145,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z",
                stroke: "currentColor",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 151,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 144,
        columnNumber: 3
    }, this);
}
_c6 = IconProfile;
function IconSettings(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: props.className,
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "2.8",
                stroke: "currentColor",
                strokeWidth: "1.8"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 163,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.64 9.95 L19.88 10.61 L19.88 13.39 L17.64 14.05 L16.60 15.86 L17.14 18.13 L14.74 19.52 L13.04 17.91 L10.96 17.91 L9.26 19.52 L6.86 18.13 L7.40 15.86 L6.36 14.05 L4.12 13.39 L4.12 10.61 L6.36 9.95 L7.40 8.14 L6.86 5.87 L9.26 4.48 L10.96 6.09 L13.04 6.09 L14.74 4.48 L17.14 5.87 L16.60 8.14 Z",
                stroke: "currentColor",
                strokeWidth: "1.8",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 164,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 162,
        columnNumber: 3
    }, this);
}
_c7 = IconSettings;
function Sidebar({ activeHref }) {
    _s();
    const DISPATCH_ICON_HREF = "/";
    const HOME_HREF = "/dashboard";
    const [profileHref, setProfileHref] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("/profile/test");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            let cancelled = false;
            ({
                "Sidebar.useEffect": async ()=>{
                    try {
                        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$browser$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSupabaseBrowserClient"])();
                        const { data: userRes } = await supabase.auth.getUser();
                        const user = userRes?.user;
                        if (!user?.id) return;
                        const { data: profile, error } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
                        if (cancelled) return;
                        if (!error && profile?.username && profile.username.trim().length > 0) {
                            setProfileHref(`/profile/${profile.username.trim()}`);
                        }
                    } catch  {
                    // keep fallback
                    }
                }
            })["Sidebar.useEffect"]();
            return ({
                "Sidebar.useEffect": ()=>{
                    cancelled = true;
                }
            })["Sidebar.useEffect"];
        }
    }["Sidebar.useEffect"], []);
    const itemsTop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.useMemo[itemsTop]": ()=>[
                {
                    href: HOME_HREF,
                    label: "Dashboard",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconHome, {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 219,
                        columnNumber: 49
                    }, this)
                },
                {
                    href: "/reports-catalog",
                    label: "Reports",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconReports, {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 220,
                        columnNumber: 56
                    }, this)
                },
                {
                    href: "/incidents-catalog",
                    label: "Incidents",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconIncidents, {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 221,
                        columnNumber: 60
                    }, this)
                },
                {
                    href: "/resource-catalog",
                    label: "Resources",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconResources, {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 222,
                        columnNumber: 59
                    }, this)
                },
                {
                    href: "/requests-catalog",
                    label: "Requests",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconRequests, {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 223,
                        columnNumber: 58
                    }, this)
                },
                {
                    href: profileHref,
                    label: "Profile",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconProfile, {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 224,
                        columnNumber: 49
                    }, this)
                }
            ]
    }["Sidebar.useMemo[itemsTop]"], [
        profileHref
    ]);
    const itemsBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.useMemo[itemsBottom]": ()=>[
                {
                    href: "/settings",
                    label: "Settings",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSettings, {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 230,
                        columnNumber: 56
                    }, this)
                }
            ]
    }["Sidebar.useMemo[itemsBottom]"], []);
    const isActiveHref = (href)=>{
        if (!activeHref) return false;
        if (activeHref === href) return true;
        const base = href.split("[")[0];
        return href.includes("[") && activeHref.startsWith(base);
    };
    const Item = (it)=>{
        const active = isActiveHref(it.href);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: it.href,
            title: it.label,
            className: cn("block w-full shrink-0 transition", active ? "opacity-100" : "opacity-95 hover:opacity-100"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: cn("h-[56px] min-h-[56px] w-[56px] group-hover:w-full", "transition-[width] duration-200 ease-out", "flex items-center", "overflow-hidden rounded-2xl border border-[#D9D9D9]/10", active ? "bg-white/10" : "bg-white/5 hover:bg-white/10"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-[56px] w-[56px] shrink-0 items-center justify-center text-[#D9D9D9]/90",
                        children: it.icon
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 262,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden group-hover:block whitespace-nowrap pr-4 text-sm text-[#D9D9D9]/85",
                        children: it.label
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 265,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/util/sidebar.tsx",
                lineNumber: 253,
                columnNumber: 5
            }, this)
        }, it.href, false, {
            fileName: "[project]/util/sidebar.tsx",
            lineNumber: 244,
            columnNumber: 4
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: cn("fixed left-0 top-0 z-50 h-screen", "group w-[84px] hover:w-[220px]", "transition-[width] duration-200 ease-out", "border-r border-[#D9D9D9]/10 bg-black/35 backdrop-blur-md"),
        "aria-label": "Sidebar navigation",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full flex-col px-3 py-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: DISPATCH_ICON_HREF,
                    title: "DispatchNow",
                    className: "mb-4 inline-flex w-full shrink-0 justify-center group-hover:justify-start",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[56px] min-h-[56px] w-[56px] min-w-[56px] rounded-2xl border border-[#D9D9D9]/10 bg-[#8B000D] grid place-items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSquare, {
                            className: "h-6 w-6 text-[#D9D9D9]"
                        }, void 0, false, {
                            fileName: "[project]/util/sidebar.tsx",
                            lineNumber: 290,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/util/sidebar.tsx",
                        lineNumber: 289,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/util/sidebar.tsx",
                    lineNumber: 284,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex min-h-0 flex-1 flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 overflow-y-auto",
                            children: itemsTop.map(Item)
                        }, void 0, false, {
                            fileName: "[project]/util/sidebar.tsx",
                            lineNumber: 295,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1"
                        }, void 0, false, {
                            fileName: "[project]/util/sidebar.tsx",
                            lineNumber: 296,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "shrink-0 flex flex-col gap-3 pt-3",
                            children: itemsBottom.map(Item)
                        }, void 0, false, {
                            fileName: "[project]/util/sidebar.tsx",
                            lineNumber: 297,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/util/sidebar.tsx",
                    lineNumber: 294,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/util/sidebar.tsx",
            lineNumber: 283,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/util/sidebar.tsx",
        lineNumber: 274,
        columnNumber: 3
    }, this);
}
_s(Sidebar, "fuSDj6jiZtuK6yN01BiVaQcx0GU=");
_c8 = Sidebar;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "IconSquare");
__turbopack_context__.k.register(_c1, "IconHome");
__turbopack_context__.k.register(_c2, "IconReports");
__turbopack_context__.k.register(_c3, "IconIncidents");
__turbopack_context__.k.register(_c4, "IconResources");
__turbopack_context__.k.register(_c5, "IconRequests");
__turbopack_context__.k.register(_c6, "IconProfile");
__turbopack_context__.k.register(_c7, "IconSettings");
__turbopack_context__.k.register(_c8, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/settings/client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SettingsClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/util/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$browser$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/browser-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function StatTile({ title, desc, right }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-white/10 bg-white/5 p-5",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold text-[#D9D9D9]",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/app/settings/client.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1 text-xs text-[#D9D9D9]/60",
                            children: desc
                        }, void 0, false, {
                            fileName: "[project]/app/settings/client.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/settings/client.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this),
                right ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "shrink-0",
                    children: right
                }, void 0, false, {
                    fileName: "[project]/app/settings/client.tsx",
                    lineNumber: 33,
                    columnNumber: 18
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/app/settings/client.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/settings/client.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = StatTile;
function ButtonGhost({ children, href, onClick, disabled }) {
    const cls = "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed";
    return href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: cls,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/settings/client.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: cls,
        onClick: onClick,
        disabled: disabled,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/settings/client.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c1 = ButtonGhost;
function Input({ placeholder, value, onChange, type }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        value: value,
        onChange: (e)=>onChange(e.target.value),
        placeholder: placeholder,
        type: type ?? "text",
        className: "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#D9D9D9] placeholder:text-[#D9D9D9]/40 outline-none focus:border-white/20"
    }, void 0, false, {
        fileName: "[project]/app/settings/client.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_c2 = Input;
function Select({ options, value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        className: "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#D9D9D9] outline-none focus:border-white/20",
        value: value,
        onChange: (e)=>onChange(e.target.value),
        children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: o,
                className: "bg-[#0b0b0c]",
                children: o
            }, o, false, {
                fileName: "[project]/app/settings/client.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/settings/client.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c3 = Select;
function Toggle({ on, setOn }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "inline-flex cursor-pointer items-center gap-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "relative inline-flex h-6 w-11 items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    checked: on,
                    onChange: (e)=>setOn(e.target.checked),
                    type: "checkbox",
                    className: "peer sr-only"
                }, void 0, false, {
                    fileName: "[project]/app/settings/client.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "absolute inset-0 rounded-full border border-white/10 bg-white/5 transition peer-checked:bg-white/10"
                }, void 0, false, {
                    fileName: "[project]/app/settings/client.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "absolute left-1 h-4 w-4 rounded-full bg-[#D9D9D9]/70 transition peer-checked:translate-x-5 peer-checked:bg-[#D9D9D9]"
                }, void 0, false, {
                    fileName: "[project]/app/settings/client.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/settings/client.tsx",
            lineNumber: 118,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/settings/client.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_c4 = Toggle;
function TierBadge({ tier }) {
    const tierText = tier === 1 ? "Citizen" : tier === 2 ? "Volunteer" : "Authority";
    const citizenText = "#34D399";
    const volunteerText = "#FF9F1A";
    const authorityRed = "#8B000D";
    const isAuthority = tier === 3;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "rounded-full border border-white/10 px-3 py-1 text-xs",
        style: {
            color: tier === 1 ? citizenText : tier === 2 ? volunteerText : "#D9D9D9",
            background: isAuthority ? authorityRed : "rgba(255,255,255,0.06)"
        },
        children: tierText
    }, void 0, false, {
        fileName: "[project]/app/settings/client.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_c5 = TierBadge;
function loadPrefs() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = window.localStorage.getItem("dispatchnow:prefs");
    if (!raw) {
        return {
            emailNotifications: true,
            publicProfile: true,
            defaultLanding: "Dashboard",
            boldText: false
        };
    }
    try {
        const v = JSON.parse(raw);
        return {
            emailNotifications: !!v.emailNotifications,
            publicProfile: !!v.publicProfile,
            defaultLanding: typeof v.defaultLanding === "string" ? v.defaultLanding : "Dashboard",
            boldText: !!v.boldText
        };
    } catch  {
        return {
            emailNotifications: true,
            publicProfile: true,
            defaultLanding: "Dashboard",
            boldText: false
        };
    }
}
function savePrefs(p) {
    window.localStorage.setItem("dispatchnow:prefs", JSON.stringify(p));
}
function SettingsClient() {
    _s();
    const sidebarWidth = 84;
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [authId, setAuthId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profileId, setProfileId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tier, setTier] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [prefs, setPrefs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SettingsClient.useState": ()=>loadPrefs()
    }["SettingsClient.useState"]);
    const [newPassword, setNewPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showPasswordBox, setShowPasswordBox] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SettingsClient.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$browser$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSupabaseBrowserClient"])()
    }["SettingsClient.useMemo[supabase]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsClient.useEffect": ()=>{
            ({
                "SettingsClient.useEffect": async ()=>{
                    setLoading(true);
                    setToast(null);
                    const { data: { user }, error: userErr } = await supabase.auth.getUser();
                    if (userErr) {
                        setToast({
                            kind: "err",
                            msg: userErr.message
                        });
                        setLoading(false);
                        return;
                    }
                    if (!user) {
                        setAuthId(null);
                        setProfileId(null);
                        setLoading(false);
                        return;
                    }
                    setAuthId(user.id);
                    const { data: prof, error: profErr } = await supabase.from("profiles").select("id,email,tier,username").eq("id", user.id).maybeSingle();
                    if (profErr) {
                        setToast({
                            kind: "err",
                            msg: profErr.message
                        });
                        setLoading(false);
                        return;
                    }
                    if (prof) {
                        setProfileId(prof.id);
                        setTier(prof.tier ?? 1);
                        setUsername(prof.username ?? "");
                        setEmail(prof.email ?? user.email ?? "");
                    } else {
                        setProfileId(user.id);
                        setEmail(user.email ?? "");
                    }
                    setLoading(false);
                }
            })["SettingsClient.useEffect"]();
        }
    }["SettingsClient.useEffect"], [
        supabase
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsClient.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) savePrefs(prefs);
        }
    }["SettingsClient.useEffect"], [
        prefs
    ]);
    async function refreshProfile() {
        if (!authId) return;
        const { data: prof, error } = await supabase.from("profiles").select("id,email,tier,username").eq("id", authId).maybeSingle();
        if (error) throw error;
        if (prof) {
            setProfileId(prof.id);
            setTier(prof.tier ?? 1);
            setUsername(prof.username ?? "");
            setEmail(prof.email ?? email);
        }
    }
    async function handleUpdateAccount() {
        if (!authId) {
            setToast({
                kind: "err",
                msg: "You must be logged in."
            });
            return;
        }
        const u = username.trim();
        if (u.length > 0) {
            const ok = /^[a-zA-Z0-9_]+$/.test(u);
            if (!ok) {
                setToast({
                    kind: "err",
                    msg: "Username can only contain letters, numbers, and _"
                });
                return;
            }
        }
        setBusy("account");
        setToast(null);
        try {
            if (u.length > 0) {
                const { error } = await supabase.from("profiles").update({
                    username: u
                }).eq("id", authId);
                if (error) throw error;
            }
            const nextEmail = email.trim();
            if (nextEmail && nextEmail !== "") {
                const { data: current } = await supabase.auth.getUser();
                const currentEmail = current.user?.email ?? "";
                if (currentEmail && nextEmail !== currentEmail) {
                    const { error: e2 } = await supabase.auth.updateUser({
                        email: nextEmail
                    });
                    if (e2) throw e2;
                }
                const { error: e3 } = await supabase.from("profiles").update({
                    email: nextEmail
                }).eq("id", authId);
                if (e3) throw e3;
            }
            await refreshProfile();
            setToast({
                kind: "ok",
                msg: "Account updated."
            });
        } catch (e) {
            setToast({
                kind: "err",
                msg: e?.message ?? "Update failed."
            });
        } finally{
            setBusy(null);
        }
    }
    async function handleResetAccountInputs() {
        setBusy("reset");
        setToast(null);
        try {
            await refreshProfile();
            setToast({
                kind: "ok",
                msg: "Reverted to saved values."
            });
        } catch (e) {
            setToast({
                kind: "err",
                msg: e?.message ?? "Reset failed."
            });
        } finally{
            setBusy(null);
        }
    }
    async function handleSendResetEmail() {
        const to = email.trim();
        if (!to) {
            setToast({
                kind: "err",
                msg: "No email to send to."
            });
            return;
        }
        setBusy("resetEmail");
        setToast(null);
        try {
            const redirectTo = ("TURBOPACK compile-time truthy", 1) ? `${window.location.origin}/confirmation` : "TURBOPACK unreachable";
            const { error } = await supabase.auth.resetPasswordForEmail(to, {
                redirectTo
            });
            if (error) throw error;
            setToast({
                kind: "ok",
                msg: "Reset email sent (if the address exists)."
            });
        } catch (e) {
            setToast({
                kind: "err",
                msg: e?.message ?? "Failed to send reset email."
            });
        } finally{
            setBusy(null);
        }
    }
    async function handleChangePassword() {
        if (!newPassword.trim()) {
            setToast({
                kind: "err",
                msg: "Password is empty."
            });
            return;
        }
        setBusy("password");
        setToast(null);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword.trim()
            });
            if (error) throw error;
            setNewPassword("");
            setShowPasswordBox(false);
            setToast({
                kind: "ok",
                msg: "Password updated."
            });
        } catch (e) {
            setToast({
                kind: "err",
                msg: e?.message ?? "Password update failed."
            });
        } finally{
            setBusy(null);
        }
    }
    async function handleLogout() {
        setBusy("logout");
        setToast(null);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.href = "/";
        } catch (e) {
            setToast({
                kind: "err",
                msg: e?.message ?? "Logout failed."
            });
            setBusy(null);
        }
    }
    function handleSavePreferences() {
        setToast({
            kind: "ok",
            msg: "Preferences saved locally."
        });
    }
    function handleResetPreferences() {
        setPrefs({
            emailNotifications: true,
            publicProfile: true,
            defaultLanding: "Dashboard",
            boldText: false
        });
        setToast({
            kind: "ok",
            msg: "Preferences reset."
        });
    }
    function handleSaveAll() {
        (async ()=>{
            await handleUpdateAccount();
            handleSavePreferences();
        })();
    }
    const tierText = tier === 1 ? "Citizen" : tier === 2 ? "Volunteer" : "Authority";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: `
        relative min-h-screen bg-[#0b0b0c] text-[#D9D9D9]
        ${prefs.boldText ? "font-bold" : ""}
      `,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$util$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                activeHref: "/settings"
            }, void 0, false, {
                fileName: "[project]/app/settings/client.tsx",
                lineNumber: 444,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative px-6 py-8",
                style: {
                    paddingLeft: `calc(${sidebarWidth}px + 24px)`
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-5xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "mb-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-start justify-between gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold text-[#D9D9D9]",
                                                    children: "Settings"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 text-sm text-[#D9D9D9]/60",
                                                    children: "Account, notifications, and preferences"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 455,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-[#D9D9D9]/55",
                                                            children: "Tier"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 459,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TierBadge, {
                                                            tier: tier
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 460,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-[#D9D9D9]/55",
                                                            children: tierText
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 17
                                                }, this),
                                                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 text-xs text-[#D9D9D9]/55",
                                                    children: "Loading…"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 465,
                                                    columnNumber: 19
                                                }, this) : !authId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 text-xs text-[#D9D9D9]/55",
                                                    children: "You are not signed in."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 467,
                                                    columnNumber: 19
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/settings/client.tsx",
                                            lineNumber: 453,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ButtonGhost, {
                                                    href: `/profile/${username || "test"}`,
                                                    children: "View Profile"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 474,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: handleSaveAll,
                                                    disabled: !!busy || !authId,
                                                    className: "inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                    children: "Save Changes"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/settings/client.tsx",
                                            lineNumber: 473,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/settings/client.tsx",
                                    lineNumber: 452,
                                    columnNumber: 13
                                }, this),
                                toast ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `mt-4 rounded-2xl border p-4 text-sm ${toast.kind === "ok" ? "border-white/10 bg-white/5 text-white" : "border-red-500/20 bg-red-500/10 text-white"}`,
                                    children: toast.msg
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/client.tsx",
                                    lineNumber: 488,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/settings/client.tsx",
                            lineNumber: 451,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-baseline justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-lg font-semibold tracking-wide text-[#D9D9D9]",
                                                            children: "Account"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 505,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-[#D9D9D9]/55",
                                                            children: "profile info"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 508,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 504,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "my-4 h-px bg-white/10"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 511,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatTile, {
                                                            title: "Display name",
                                                            desc: "Not stored yet (UI placeholder).",
                                                            right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-[#D9D9D9]/55",
                                                                children: "TODO"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/settings/client.tsx",
                                                                lineNumber: 517,
                                                                columnNumber: 28
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 514,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                            placeholder: "Display name",
                                                            value: "User",
                                                            onChange: ()=>{}
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 519,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatTile, {
                                                            title: "Username",
                                                            desc: "Used in links like /profile/[username].",
                                                            right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-[#D9D9D9]/55",
                                                                children: "unique"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/settings/client.tsx",
                                                                lineNumber: 524,
                                                                columnNumber: 28
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 521,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                            placeholder: "@username",
                                                            value: username,
                                                            onChange: setUsername
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 526,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatTile, {
                                                            title: "Email",
                                                            desc: "Used for sign-in and notifications."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 528,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                            placeholder: "email@example.com",
                                                            value: email,
                                                            onChange: setEmail
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 529,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-end gap-2 pt-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ButtonGhost, {
                                                                    onClick: handleResetAccountInputs,
                                                                    disabled: !!busy,
                                                                    children: "Cancel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 532,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: handleUpdateAccount,
                                                                    disabled: !!busy || !authId,
                                                                    className: "inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                                    children: "Update Account"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 536,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 531,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/settings/client.tsx",
                                            lineNumber: 503,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-baseline justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-lg font-semibold tracking-wide text-[#D9D9D9]",
                                                            children: "Accessibility"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 550,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-[#D9D9D9]/55",
                                                            children: "a11y"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 553,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "my-4 h-px bg-white/10"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm font-semibold text-[#D9D9D9]",
                                                                            children: "Bold text"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/settings/client.tsx",
                                                                            lineNumber: 561,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1 text-xs text-[#D9D9D9]/60",
                                                                            children: "Makes text bolder across the app."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/settings/client.tsx",
                                                                            lineNumber: 564,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 560,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Toggle, {
                                                                    on: prefs.boldText,
                                                                    setOn: (v)=>setPrefs((p)=>({
                                                                                ...p,
                                                                                boldText: v
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 568,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 559,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm font-semibold text-[#D9D9D9]",
                                                                    children: "Colorblind modes"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 575,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-1 text-xs text-[#D9D9D9]/60",
                                                                    children: "TODO"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 578,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 574,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 558,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/settings/client.tsx",
                                            lineNumber: 548,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/settings/client.tsx",
                                    lineNumber: 502,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-baseline justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-lg font-semibold tracking-wide text-[#D9D9D9]",
                                                            children: "Security"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 588,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-[#D9D9D9]/55",
                                                            children: "auth"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 591,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 587,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "my-4 h-px bg-white/10"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 594,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatTile, {
                                                            title: "Password",
                                                            desc: "Update your password.",
                                                            right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ButtonGhost, {
                                                                onClick: ()=>setShowPasswordBox((v)=>!v),
                                                                disabled: !!busy || !authId,
                                                                children: "Change"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/settings/client.tsx",
                                                                lineNumber: 601,
                                                                columnNumber: 23
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 597,
                                                            columnNumber: 19
                                                        }, this),
                                                        showPasswordBox ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm font-semibold text-[#D9D9D9]",
                                                                    children: "New password"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 612,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                                        placeholder: "••••••••",
                                                                        value: newPassword,
                                                                        onChange: setNewPassword,
                                                                        type: "password"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/settings/client.tsx",
                                                                        lineNumber: 616,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 615,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3 flex justify-end gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ButtonGhost, {
                                                                            onClick: ()=>setShowPasswordBox(false),
                                                                            disabled: !!busy,
                                                                            children: "Close"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/settings/client.tsx",
                                                                            lineNumber: 624,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: handleChangePassword,
                                                                            disabled: !!busy || !authId,
                                                                            className: "inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                                            children: "Update"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/settings/client.tsx",
                                                                            lineNumber: 627,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 623,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 611,
                                                            columnNumber: 21
                                                        }, this) : null,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatTile, {
                                                            title: "Reset password email",
                                                            desc: "Send a reset email to your account.",
                                                            right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: handleSendResetEmail,
                                                                disabled: !!busy || !authId,
                                                                className: "inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                                children: "Send"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/settings/client.tsx",
                                                                lineNumber: 643,
                                                                columnNumber: 23
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 639,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatTile, {
                                                            title: "Session",
                                                            desc: "Sign out from this device.",
                                                            right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ButtonGhost, {
                                                                onClick: handleLogout,
                                                                disabled: !!busy || !authId,
                                                                children: "Logout"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/settings/client.tsx",
                                                                lineNumber: 658,
                                                                columnNumber: 23
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 596,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/settings/client.tsx",
                                            lineNumber: 586,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-baseline justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-lg font-semibold tracking-wide text-[#D9D9D9]",
                                                            children: "Preferences"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 668,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-[#D9D9D9]/55",
                                                            children: "ui"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 671,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 667,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "my-4 h-px bg-white/10"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 674,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm font-semibold text-[#D9D9D9]",
                                                                            children: "Email notifications"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/settings/client.tsx",
                                                                            lineNumber: 679,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1 text-xs text-[#D9D9D9]/60",
                                                                            children: "Updates about reports, incidents, and requests."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/settings/client.tsx",
                                                                            lineNumber: 682,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 678,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Toggle, {
                                                                    on: prefs.emailNotifications,
                                                                    setOn: (v)=>setPrefs((p)=>({
                                                                                ...p,
                                                                                emailNotifications: v
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 686,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 677,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm font-semibold text-[#D9D9D9]",
                                                                            children: "Public profile"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/settings/client.tsx",
                                                                            lineNumber: 694,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1 text-xs text-[#D9D9D9]/60",
                                                                            children: "Allow others to view your profile overview."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/settings/client.tsx",
                                                                            lineNumber: 697,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 693,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Toggle, {
                                                                    on: prefs.publicProfile,
                                                                    setOn: (v)=>setPrefs((p)=>({
                                                                                ...p,
                                                                                publicProfile: v
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 701,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 692,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm font-semibold text-[#D9D9D9]",
                                                                    children: "Default landing"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 708,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-1 text-xs text-[#D9D9D9]/60",
                                                                    children: "Where “Home” in the sidebar takes you."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 711,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                                                                        options: [
                                                                            "Dashboard",
                                                                            "Reports catalog",
                                                                            "Incidents catalog"
                                                                        ],
                                                                        value: prefs.defaultLanding,
                                                                        onChange: (v)=>setPrefs((p)=>({
                                                                                    ...p,
                                                                                    defaultLanding: v
                                                                                }))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/settings/client.tsx",
                                                                        lineNumber: 715,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 714,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 707,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-end gap-2 pt-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ButtonGhost, {
                                                                    onClick: handleResetPreferences,
                                                                    disabled: !!busy,
                                                                    children: "Reset"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 724,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: handleSavePreferences,
                                                                    disabled: !!busy,
                                                                    className: "inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                                    children: "Save Preferences"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/settings/client.tsx",
                                                                    lineNumber: 727,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/settings/client.tsx",
                                                            lineNumber: 723,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/settings/client.tsx",
                                                    lineNumber: 676,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/settings/client.tsx",
                                            lineNumber: 666,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/settings/client.tsx",
                                    lineNumber: 585,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/settings/client.tsx",
                            lineNumber: 500,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-[#D9D9D9]/45",
                                children: "DispatchNow • settings"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/client.tsx",
                                lineNumber: 742,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/settings/client.tsx",
                            lineNumber: 741,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/settings/client.tsx",
                    lineNumber: 450,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/settings/client.tsx",
                lineNumber: 446,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/settings/client.tsx",
        lineNumber: 438,
        columnNumber: 5
    }, this);
}
_s(SettingsClient, "v55vrEBpAHr0Nk07Z4T4rlkaOOk=");
_c6 = SettingsClient;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "StatTile");
__turbopack_context__.k.register(_c1, "ButtonGhost");
__turbopack_context__.k.register(_c2, "Input");
__turbopack_context__.k.register(_c3, "Select");
__turbopack_context__.k.register(_c4, "Toggle");
__turbopack_context__.k.register(_c5, "TierBadge");
__turbopack_context__.k.register(_c6, "SettingsClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1f762ed7._.js.map