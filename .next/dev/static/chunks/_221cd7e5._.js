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
"[project]/app/dashboard/citizen/GlobalSearch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobalSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
function useOutsideClick(ref, onOutside) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOutsideClick.useEffect": ()=>{
            function onDown(e) {
                const el = ref.current;
                if (!el) return;
                if (!el.contains(e.target)) onOutside();
            }
            document.addEventListener("mousedown", onDown);
            return ({
                "useOutsideClick.useEffect": ()=>document.removeEventListener("mousedown", onDown)
            })["useOutsideClick.useEffect"];
        }
    }["useOutsideClick.useEffect"], [
        ref,
        onOutside
    ]);
}
_s(useOutsideClick, "OD7bBpZva5O2jO+Puf00hKivP7c=");
function IconUser() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-4 w-4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 21a8 8 0 1 0-16 0"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = IconUser;
function IconHash() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-4 w-4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 9h16M3 15h16"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 3 8 21M16 3l-2 18"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c1 = IconHash;
function IconSliders() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-4 w-4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 14h4M10 8h4M18 16h4"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c2 = IconSliders;
function IconSearch() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-4 w-4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "11",
                cy: "11",
                r: "7.5"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m21 21-4.3-4.3"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_c3 = IconSearch;
function TypeBadge({ t }) {
    const base = "rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider";
    if (t === "user") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `${base} bg-white/[0.04] text-[#34D399]`,
        children: "User"
    }, void 0, false, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 70,
        columnNumber: 28
    }, this);
    if (t === "report") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `${base} bg-white/[0.04] text-[#D9D9D9]`,
        children: "Report"
    }, void 0, false, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 71,
        columnNumber: 30
    }, this);
    if (t === "incident") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `${base} bg-white/[0.04] text-[#FF9F1A]`,
        children: "Incident"
    }, void 0, false, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 72,
        columnNumber: 32
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `${base} bg-white/[0.04] text-[#9CA3AF]`,
        children: "Request"
    }, void 0, false, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 73,
        columnNumber: 10
    }, this);
}
_c4 = TypeBadge;
const SUGGESTIONS = [
    {
        key: "from:",
        title: "From a specific user",
        subtitle: "Filter results created by a user",
        example: "from:arshin",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconUser, {}, void 0, false, {
            fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
            lineNumber: 82,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        key: "type:",
        title: "In a specific category",
        subtitle: "Limit results to one type",
        example: "type:report",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconHash, {}, void 0, false, {
            fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
            lineNumber: 89,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        key: "status:",
        title: "With a status",
        subtitle: "Filter by status field",
        example: "status:open",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSliders, {}, void 0, false, {
            fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
            lineNumber: 96,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function parseInsert(key) {
    // Discord style: insert the key, and if it's type: or status:, also add a trailing : so user can immediately type the value
    return `${key}`;
}
function GlobalSearch() {
    _s1();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const boxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    useOutsideClick(boxRef, {
        "GlobalSearch.useOutsideClick": ()=>setOpen(false)
    }["GlobalSearch.useOutsideClick"]);
    const showSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GlobalSearch.useMemo[showSuggestions]": ()=>q.trim().length === 0
    }["GlobalSearch.useMemo[showSuggestions]"], [
        q
    ]);
    // debounce search
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalSearch.useEffect": ()=>{
            const query = q.trim();
            if (!open) return;
            if (query.length === 0) {
                setResults([]);
                setLoading(false);
                return;
            }
            const t = setTimeout({
                "GlobalSearch.useEffect.t": async ()=>{
                    try {
                        setLoading(true);
                        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                        const data = await res.json().catch({
                            "GlobalSearch.useEffect.t": ()=>null
                        }["GlobalSearch.useEffect.t"]);
                        if (!res.ok) {
                            setResults([]);
                            return;
                        }
                        setResults(data?.results ?? []);
                    } finally{
                        setLoading(false);
                    }
                }
            }["GlobalSearch.useEffect.t"], 220);
            return ({
                "GlobalSearch.useEffect": ()=>clearTimeout(t)
            })["GlobalSearch.useEffect"];
        }
    }["GlobalSearch.useEffect"], [
        q,
        open
    ]);
    const onPickSuggestion = (key)=>{
        setQ(parseInsert(key));
        setOpen(true);
        requestAnimationFrame(()=>inputRef.current?.focus());
        // setTimeout to ensure the input is focused after the dropdown opens and state updates, allowing the user to immediately type the filter value without an extra click
        setTimeout(()=>{
            if (inputRef.current) {
                const len = inputRef.current.value.length;
                inputRef.current.focus();
                inputRef.current.setSelectionRange(len, len);
            }
        }, 0);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: boxRef,
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2",
                onClick: ()=>{
                    setOpen(true);
                    inputRef.current?.focus();
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mr-2 text-[#D9D9D9]/60",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSearch, {}, void 0, false, {
                            fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: inputRef,
                        value: q,
                        onChange: (e)=>{
                            setQ(e.target.value);
                            setOpen(true);
                        },
                        onFocus: ()=>setOpen(true),
                        placeholder: "Search...",
                        className: "w-32 bg-transparent text-xs text-[#D9D9D9] placeholder:text-[#D9D9D9]/40 outline-none"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this),
                    q.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "ml-2 text-[#D9D9D9]/45 hover:text-[#D9D9D9]/80 text-xs",
                        onClick: (e)=>{
                            e.stopPropagation();
                            setQ("");
                            setResults([]);
                            requestAnimationFrame(()=>inputRef.current?.focus());
                        },
                        "aria-label": "Clear",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 mt-2 w-[400px] overflow-hidden rounded-xl border border-white/10 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.55)]",
                style: {
                    backgroundColor: "#2b2d31"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 pt-3 pb-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[11px] font-semibold tracking-wide text-white/70",
                            children: showSuggestions ? "FILTERS" : "RESULTS"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                            lineNumber: 212,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-px bg-white/10"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    showSuggestions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-1",
                        children: [
                            SUGGESTIONS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>onPickSuggestion(s.key),
                                    className: "w-full rounded-xl px-3 py-2 text-left transition border border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.07] active:scale-[0.99]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "shrink-0 rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-semibold text-white/85",
                                                children: s.key
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                                lineNumber: 230,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "min-w-0 flex-1 text-right font-mono text-[11px] text-white/70 truncate",
                                                children: s.example
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                                lineNumber: 235,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                        lineNumber: 228,
                                        columnNumber: 21
                                    }, this)
                                }, s.key, false, {
                                    fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                    lineNumber: 222,
                                    columnNumber: 17
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 pt-3 pb-4 text-xs text-[#D9D9D9]/45",
                                children: "Tip: start typing to search, or click a filter to insert it."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                lineNumber: 242,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                        lineNumber: 220,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between px-2 pt-1 pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-white/50",
                                        children: "Matching items"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                        lineNumber: 249,
                                        columnNumber: 17
                                    }, this),
                                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-white/55",
                                        children: "Loading..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                        lineNumber: 250,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                lineNumber: 248,
                                columnNumber: 15
                            }, this),
                            !loading && results.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-2 pb-3 text-[12px] text-white/55",
                                children: "No results found."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                lineNumber: 254,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-h-[320px] overflow-y-auto",
                                children: results.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: r.url,
                                        className: "flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.06] transition",
                                        onClick: ()=>setOpen(false),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-0.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypeBadge, {
                                                    t: r.type
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                                lineNumber: 264,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-xs font-semibold text-white/90",
                                                        children: r.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                                        lineNumber: 268,
                                                        columnNumber: 25
                                                    }, this),
                                                    r.description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-0.5 line-clamp-1 text-[11px] text-white/55",
                                                        children: r.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 27
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                                lineNumber: 267,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, `${r.type}:${r.id}`, true, {
                                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                        lineNumber: 258,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                                lineNumber: 256,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                        lineNumber: 247,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
                lineNumber: 206,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/citizen/GlobalSearch.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_s1(GlobalSearch, "zog5ShJwl6hgfIAuqKg0wbagvH4=", false, function() {
    return [
        useOutsideClick
    ];
});
_c5 = GlobalSearch;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "IconUser");
__turbopack_context__.k.register(_c1, "IconHash");
__turbopack_context__.k.register(_c2, "IconSliders");
__turbopack_context__.k.register(_c3, "IconSearch");
__turbopack_context__.k.register(_c4, "TypeBadge");
__turbopack_context__.k.register(_c5, "GlobalSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_221cd7e5._.js.map