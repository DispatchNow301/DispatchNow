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
]);

//# sourceMappingURL=_c10a8fcf._.js.map