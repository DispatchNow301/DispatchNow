(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa6$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa6/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/md/index.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
const FOOTER_LINKS = {
    Product: [
        {
            label: "Overview",
            href: "/overview"
        },
        {
            label: "Features",
            href: "/features"
        },
        {
            label: "Pricing",
            href: "/pricing"
        },
        {
            label: "Changelog",
            href: "/changelog"
        },
        {
            label: "Roadmap",
            href: "/roadmap"
        }
    ],
    Solutions: [
        {
            label: "Citizen Reporting",
            href: "/solutions/citizen"
        },
        {
            label: "Emergency Response",
            href: "/solutions/response"
        },
        {
            label: "Resource Allocation",
            href: "/solutions/resources"
        },
        {
            label: "Team Coordination",
            href: "/solutions/teams"
        },
        {
            label: "Analytics & Insights",
            href: "/solutions/analytics"
        }
    ],
    Developers: [
        {
            label: "API Reference",
            href: "/docs/api"
        },
        {
            label: "Documentation",
            href: "/docs"
        },
        {
            label: "SDKs",
            href: "/docs/sdks"
        },
        {
            label: "Webhooks",
            href: "/docs/webhooks"
        },
        {
            label: "Status Page",
            href: "/status"
        }
    ],
    Company: [
        {
            label: "About",
            href: "/about"
        },
        {
            label: "Blog",
            href: "/blog"
        },
        {
            label: "Careers",
            href: "/careers"
        },
        {
            label: "Press",
            href: "/press"
        },
        {
            label: "Contact",
            href: "/contact"
        }
    ]
};
const SOCIAL_LINKS = [
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa6$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaXTwitter"],
        href: "https://x.com",
        label: "X / Twitter"
    },
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa6$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaGithub"],
        href: "https://github.com",
        label: "GitHub"
    },
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa6$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLinkedin"],
        href: "https://linkedin.com",
        label: "LinkedIn"
    },
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa6$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaDiscord"],
        href: "https://discord.com",
        label: "Discord"
    }
];
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "relative w-full overflow-hidden",
        style: {
            background: "linear-gradient(to bottom, #090909 0%, #0d0d0d 100%)",
            borderTop: "1px solid rgba(253, 77, 77, 0.08)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px pointer-events-none",
                style: {
                    background: "linear-gradient(90deg, transparent, rgba(253,77,77,0.4), transparent)"
                }
            }, void 0, false, {
                fileName: "[project]/components/Footer.tsx",
                lineNumber: 56,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 pointer-events-none opacity-30",
                style: {
                    backgroundImage: `
						linear-gradient(rgba(253, 77, 77, 0.03) 1px, transparent 1px),
						linear-gradient(90deg, rgba(253, 77, 77, 0.03) 1px, transparent 1px)
					`,
                    backgroundSize: "60px 60px"
                }
            }, void 0, false, {
                fileName: "[project]/components/Footer.tsx",
                lineNumber: 65,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 pointer-events-none",
                style: {
                    background: "radial-gradient(ellipse at center, transparent 40%, #090909 100%)"
                }
            }, void 0, false, {
                fileName: "[project]/components/Footer.tsx",
                lineNumber: 77,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative max-w-7xl mx-auto px-8 pt-20 pb-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col lg:flex-row justify-between gap-12 mb-16 pb-16",
                        style: {
                            borderBottom: "1px solid rgba(255,255,255,0.05)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-5 max-w-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-9 h-9 rounded-lg flex items-center justify-center",
                                                style: {
                                                    background: "rgba(253,77,77,0.12)",
                                                    border: "1px solid rgba(253,77,77,0.25)"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineRadar"], {
                                                    className: "text-[#fd4d4d]",
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 94,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white font-extrabold text-xl tracking-tight",
                                                children: [
                                                    "Dispatch",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#fd4d4d]",
                                                        children: "Now"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Footer.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 106,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                style: {
                                                    color: "#fd4d4d",
                                                    background: "rgba(253,77,77,0.1)",
                                                    border: "1px solid rgba(253,77,77,0.15)"
                                                },
                                                children: "Beta"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 110,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 93,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-neutral-500 text-sm leading-relaxed",
                                        children: "The intelligent platform for disaster response coordination. Report, respond, and recover — faster than ever before."
                                    }, void 0, false, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 121,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: SOCIAL_LINKS.map(({ icon: Icon, href, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: href,
                                                "aria-label": label,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "group w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
                                                style: {
                                                    background: "rgba(255,255,255,0.03)",
                                                    border: "1px solid rgba(255,255,255,0.07)"
                                                },
                                                onMouseEnter: (e)=>{
                                                    e.currentTarget.style.background = "rgba(253,77,77,0.1)";
                                                    e.currentTarget.style.borderColor = "rgba(253,77,77,0.3)";
                                                },
                                                onMouseLeave: (e)=>{
                                                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "text-neutral-500 group-hover:text-[#fd4d4d] transition-colors duration-300",
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 10
                                                }, this)
                                            }, label, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 128,
                                                columnNumber: 9
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 126,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Footer.tsx",
                                lineNumber: 92,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-4 max-w-sm w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white font-semibold text-sm mb-1",
                                                children: "Stay in the loop"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 172,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-neutral-500 text-sm",
                                                children: "Get updates on new features, incidents, and response tools."
                                            }, void 0, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 175,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 171,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                placeholder: "your@email.com",
                                                className: "flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#fd4d4d]/40 transition-colors duration-200"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 181,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300",
                                                style: {
                                                    background: "rgba(253,77,77,0.15)",
                                                    border: "1px solid rgba(253,77,77,0.3)"
                                                },
                                                onMouseEnter: (e)=>{
                                                    e.currentTarget.style.background = "rgba(253,77,77,0.25)";
                                                },
                                                onMouseLeave: (e)=>{
                                                    e.currentTarget.style.background = "rgba(253,77,77,0.15)";
                                                },
                                                children: "Subscribe"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 186,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 180,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-neutral-600 text-xs",
                                        children: "No spam, ever. Unsubscribe anytime."
                                    }, void 0, false, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 206,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Footer.tsx",
                                lineNumber: 170,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Footer.tsx",
                        lineNumber: 87,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row items-center justify-between gap-4 pt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-neutral-600 text-xs",
                                children: [
                                    "© ",
                                    new Date().getFullYear(),
                                    " DispatchNow, Inc. All rights reserved."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Footer.tsx",
                                lineNumber: 214,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-6",
                                children: [
                                    {
                                        label: "Privacy Policy",
                                        href: "/privacy"
                                    },
                                    {
                                        label: "Terms of Service",
                                        href: "/terms"
                                    },
                                    {
                                        label: "Cookie Policy",
                                        href: "/cookies"
                                    }
                                ].map(({ label, href })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: href,
                                        className: "text-neutral-600 text-xs hover:text-neutral-400 transition-colors duration-200",
                                        children: label
                                    }, label, false, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 224,
                                        columnNumber: 8
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/Footer.tsx",
                                lineNumber: 218,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 234,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-neutral-600 text-xs",
                                        children: "All systems operational"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Footer.tsx",
                                        lineNumber: 235,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Footer.tsx",
                                lineNumber: 233,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Footer.tsx",
                        lineNumber: 213,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Footer.tsx",
                lineNumber: 85,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Footer.tsx",
        lineNumber: 47,
        columnNumber: 3
    }, this);
}
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/lib/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IncidentPriority",
    ()=>IncidentPriority,
    "IncidentStatus",
    ()=>IncidentStatus,
    "ReportStatus",
    ()=>ReportStatus,
    "ReportType",
    ()=>ReportType,
    "ResourceType",
    ()=>ResourceType,
    "Tier",
    ()=>Tier
]);
var Tier = /*#__PURE__*/ function(Tier) {
    Tier[Tier["Citizen"] = 1] = "Citizen";
    Tier[Tier["Volunteer"] = 2] = "Volunteer";
    Tier[Tier["Authority"] = 3] = "Authority";
    return Tier;
}({});
var ReportType = /*#__PURE__*/ function(ReportType) {
    ReportType["Pothole"] = "pothole";
    ReportType["Flooding"] = "flooding";
    ReportType["Debris"] = "debris";
    ReportType["Accident"] = "accident";
    ReportType["Other"] = "other";
    return ReportType;
}({});
var ReportStatus = /*#__PURE__*/ function(ReportStatus) {
    ReportStatus["Unverified"] = "unverified";
    ReportStatus["Verified"] = "verified";
    ReportStatus["Resolved"] = "resolved";
    ReportStatus["Rejected"] = "rejected";
    return ReportStatus;
}({});
var ResourceType = /*#__PURE__*/ function(ResourceType) {
    ResourceType["Water"] = "water";
    ResourceType["Blanket"] = "blanket";
    ResourceType["Food"] = "food";
    ResourceType["Medical"] = "medical";
    ResourceType["Shelter"] = "shelter";
    ResourceType["Other"] = "other";
    return ResourceType;
}({});
var IncidentStatus = /*#__PURE__*/ function(IncidentStatus) {
    IncidentStatus["Active"] = "active";
    IncidentStatus["Paused"] = "paused";
    IncidentStatus["Closed"] = "closed";
    return IncidentStatus;
}({});
var IncidentPriority = /*#__PURE__*/ function(IncidentPriority) {
    IncidentPriority["Low"] = "low";
    IncidentPriority["Medium"] = "medium";
    IncidentPriority["High"] = "high";
    return IncidentPriority;
}({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/resource-catalog/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ResourceCatalogPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/util/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// ── helpers ───────────────────────────────────────────────────────────────────
const TYPE_ICONS = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Water]: "💧",
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Blanket]: "🛏️",
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Food]: "🥫",
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Medical]: "🩺",
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Shelter]: "⛺",
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Other]: "📦"
};
const TYPE_COLORS = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Water]: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Blanket]: {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/20"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Food]: {
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/20"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Medical]: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Shelter]: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/20"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"].Other]: {
        bg: "bg-neutral-500/10",
        text: "text-neutral-400",
        border: "border-neutral-500/20"
    }
};
function formatRelativeTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}
// ── sub-components ────────────────────────────────────────────────────────────
function ResourceCard({ resource, onClick }) {
    const color = TYPE_COLORS[resource.type];
    const icon = TYPE_ICONS[resource.type];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "group w-full text-left bg-[#111111] border border-neutral-800 rounded-xl p-5 hover:border-[#fd4d4d]/40 hover:bg-[#161616] transition-all duration-200 focus:outline-none focus:border-[#fd4d4d]/60",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-4 min-w-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex-shrink-0 w-10 h-10 rounded-lg ${color.bg} border ${color.border} flex items-center justify-center text-lg mt-0.5`,
                            children: icon
                        }, void 0, false, {
                            fileName: "[project]/app/resource-catalog/page.tsx",
                            lineNumber: 113,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 flex-wrap mb-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-semibold text-white",
                                            children: resource.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 123,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color.bg} ${color.text}`,
                                            children: resource.type
                                        }, void 0, false, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 126,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                    lineNumber: 122,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-neutral-400 text-sm leading-relaxed line-clamp-2 mb-3",
                                    children: resource.description ?? "No description provided."
                                }, void 0, false, {
                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                    lineNumber: 134,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4 text-xs text-neutral-500 flex-wrap",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1.5 font-medium text-neutral-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiPackage"], {
                                                    size: 11
                                                }, void 0, false, {
                                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 9
                                                }, this),
                                                resource.quantity.toLocaleString(),
                                                " units"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiClock"], {
                                                    size: 11
                                                }, void 0, false, {
                                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 9
                                                }, this),
                                                formatRelativeTime(resource.created_at)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 144,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                    lineNumber: 139,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/resource-catalog/page.tsx",
                            lineNumber: 120,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/resource-catalog/page.tsx",
                    lineNumber: 111,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiChevronRight"], {
                    size: 16,
                    className: "flex-shrink-0 text-neutral-600 group-hover:text-[#fd4d4d] transition-colors mt-1"
                }, void 0, false, {
                    fileName: "[project]/app/resource-catalog/page.tsx",
                    lineNumber: 152,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/resource-catalog/page.tsx",
            lineNumber: 110,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/resource-catalog/page.tsx",
        lineNumber: 104,
        columnNumber: 3
    }, this);
}
_c = ResourceCard;
function SkeletonCard() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-[#111111] border border-neutral-800 rounded-xl p-5 animate-pulse",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-10 h-10 rounded-lg bg-neutral-800 flex-shrink-0"
                }, void 0, false, {
                    fileName: "[project]/app/resource-catalog/page.tsx",
                    lineNumber: 165,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-3 w-32 bg-neutral-800 rounded"
                        }, void 0, false, {
                            fileName: "[project]/app/resource-catalog/page.tsx",
                            lineNumber: 167,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-3/4 bg-neutral-800 rounded"
                        }, void 0, false, {
                            fileName: "[project]/app/resource-catalog/page.tsx",
                            lineNumber: 168,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-1/2 bg-neutral-800 rounded"
                        }, void 0, false, {
                            fileName: "[project]/app/resource-catalog/page.tsx",
                            lineNumber: 169,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-3 w-28 bg-neutral-800 rounded mt-3"
                        }, void 0, false, {
                            fileName: "[project]/app/resource-catalog/page.tsx",
                            lineNumber: 170,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/resource-catalog/page.tsx",
                    lineNumber: 166,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/resource-catalog/page.tsx",
            lineNumber: 164,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/resource-catalog/page.tsx",
        lineNumber: 163,
        columnNumber: 3
    }, this);
}
_c1 = SkeletonCard;
// ── main page ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;
function ResourceCatalogPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [resources, setResources] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [meta, setMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        total: 0,
        limit: PAGE_SIZE,
        offset: 0
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingMore, setLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(searchParams.get("search") ?? "");
    const [typeFilter, setTypeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(searchParams.get("type") ?? "");
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const debounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fetchResources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResourceCatalogPage.useCallback[fetchResources]": async (opts)=>{
            const params = new URLSearchParams();
            if (opts.search) params.set("search", opts.search);
            if (opts.type) params.set("type", opts.type);
            params.set("limit", String(PAGE_SIZE));
            params.set("offset", String(opts.offset));
            try {
                const res = await fetch(`/api/resources?${params.toString()}`);
                const json = await res.json();
                if (opts.append) {
                    setResources({
                        "ResourceCatalogPage.useCallback[fetchResources]": (prev)=>[
                                ...prev,
                                ...json.data ?? []
                            ]
                    }["ResourceCatalogPage.useCallback[fetchResources]"]);
                } else {
                    setResources(json.data ?? []);
                }
                setMeta(json.meta ?? {
                    total: 0,
                    limit: PAGE_SIZE,
                    offset: opts.offset
                });
            } catch (e) {
                console.error(e);
            }
        }
    }["ResourceCatalogPage.useCallback[fetchResources]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResourceCatalogPage.useEffect": ()=>{
            setLoading(true);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout({
                "ResourceCatalogPage.useEffect": async ()=>{
                    await fetchResources({
                        search,
                        type: typeFilter,
                        offset: 0
                    });
                    setLoading(false);
                }
            }["ResourceCatalogPage.useEffect"], 300);
            return ({
                "ResourceCatalogPage.useEffect": ()=>{
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                }
            })["ResourceCatalogPage.useEffect"];
        }
    }["ResourceCatalogPage.useEffect"], [
        search,
        typeFilter,
        fetchResources
    ]);
    const handleLoadMore = async ()=>{
        setLoadingMore(true);
        const nextOffset = meta.offset + PAGE_SIZE;
        await fetchResources({
            search,
            type: typeFilter,
            offset: nextOffset,
            append: true
        });
        setLoadingMore(false);
    };
    const hasMore = resources.length < meta.total;
    const activeFilters = typeFilter ? 1 : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$util$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                activeHref: "/resource-catalog"
            }, void 0, false, {
                fileName: "[project]/app/resource-catalog/page.tsx",
                lineNumber: 266,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-gradient-to-br from-[#090909] via-[#1a1a1a] to-[#090909] text-white pl-[84px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 pointer-events-none opacity-30",
                        style: {
                            backgroundImage: `
							linear-gradient(rgba(253,77,77,0.04) 1px, transparent 1px),
							linear-gradient(90deg, rgba(253,77,77,0.04) 1px, transparent 1px)
						`,
                            backgroundSize: "80px 80px"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/resource-catalog/page.tsx",
                        lineNumber: 268,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative max-w-4xl mx-auto px-4 sm:px-6 py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-4 mb-10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "inline-flex items-center gap-2 bg-[#fd4d4d]/10 px-3 py-1.5 rounded-full border border-[#fd4d4d]/10 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiPackage"], {
                                                    size: 12,
                                                    className: "text-[#fd4d4d]"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#fd4d4d] text-xs font-semibold uppercase tracking-widest",
                                                    children: "Inventory"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                                    lineNumber: 288,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 283,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-4xl font-extrabold mb-2",
                                            children: "Resource Catalog"
                                        }, void 0, false, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 292,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-500 text-base",
                                            children: "Browse and filter all available disaster response resources."
                                        }, void 0, false, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 295,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/resource-catalog/page.tsx",
                                lineNumber: 281,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiSearch"], {
                                                size: 15,
                                                className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                                            }, void 0, false, {
                                                fileName: "[project]/app/resource-catalog/page.tsx",
                                                lineNumber: 305,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: search,
                                                onChange: (e)=>setSearch(e.target.value),
                                                placeholder: "Search by name or description…",
                                                className: "w-full bg-[#111111] border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#fd4d4d]/50 transition-colors"
                                            }, void 0, false, {
                                                fileName: "[project]/app/resource-catalog/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 8
                                            }, this),
                                            search && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSearch(""),
                                                className: "absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiX"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                                    lineNumber: 323,
                                                    columnNumber: 10
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/resource-catalog/page.tsx",
                                                lineNumber: 319,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/resource-catalog/page.tsx",
                                        lineNumber: 304,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowFilters((v)=>!v),
                                        className: `relative flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                                        ${showFilters || activeFilters > 0 ? "bg-[#fd4d4d]/10 border-[#fd4d4d]/40 text-[#fd4d4d]" : "bg-[#111111] border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiFilter"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/app/resource-catalog/page.tsx",
                                                lineNumber: 337,
                                                columnNumber: 8
                                            }, this),
                                            "Filters",
                                            activeFilters > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#fd4d4d] text-white text-[10px] font-bold flex items-center justify-center",
                                                children: activeFilters
                                            }, void 0, false, {
                                                fileName: "[project]/app/resource-catalog/page.tsx",
                                                lineNumber: 340,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/resource-catalog/page.tsx",
                                        lineNumber: 328,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/resource-catalog/page.tsx",
                                lineNumber: 303,
                                columnNumber: 6
                            }, this),
                            showFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 mb-6 flex-wrap p-4 bg-[#111111] border border-neutral-800 rounded-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-1.5 flex-1 min-w-[160px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs text-neutral-500 font-medium uppercase tracking-wider",
                                                children: "Type"
                                            }, void 0, false, {
                                                fileName: "[project]/app/resource-catalog/page.tsx",
                                                lineNumber: 351,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: typeFilter,
                                                onChange: (e)=>setTypeFilter(e.target.value),
                                                className: "bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fd4d4d]/50 transition-colors cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "All types"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/resource-catalog/page.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 10
                                                    }, this),
                                                    Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceType"]).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: t,
                                                            children: [
                                                                TYPE_ICONS[t],
                                                                " ",
                                                                t.charAt(0).toUpperCase() + t.slice(1)
                                                            ]
                                                        }, t, true, {
                                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                                            lineNumber: 365,
                                                            columnNumber: 11
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/resource-catalog/page.tsx",
                                                lineNumber: 354,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/resource-catalog/page.tsx",
                                        lineNumber: 350,
                                        columnNumber: 8
                                    }, this),
                                    activeFilters > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-end",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setTypeFilter(""),
                                            className: "flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-400 hover:text-white border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiX"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 11
                                                }, this),
                                                "Clear"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 376,
                                            columnNumber: 10
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/resource-catalog/page.tsx",
                                        lineNumber: 375,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/resource-catalog/page.tsx",
                                lineNumber: 349,
                                columnNumber: 7
                            }, this),
                            !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-neutral-600 mb-4",
                                children: meta.total === 0 ? "No resources found" : `Showing ${resources.length} of ${meta.total} resource${meta.total !== 1 ? "s" : ""}`
                            }, void 0, false, {
                                fileName: "[project]/app/resource-catalog/page.tsx",
                                lineNumber: 390,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: loading ? Array.from({
                                    length: 6
                                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonCard, {}, i, false, {
                                        fileName: "[project]/app/resource-catalog/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 9
                                    }, this)) : resources.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center py-24 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-16 h-16 rounded-2xl bg-[#fd4d4d]/5 border border-[#fd4d4d]/10 flex items-center justify-center text-2xl mb-4",
                                            children: "📦"
                                        }, void 0, false, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 405,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-400 font-medium mb-1",
                                            children: "No resources found"
                                        }, void 0, false, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 408,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-600 text-sm",
                                            children: "Try adjusting your search or filters."
                                        }, void 0, false, {
                                            fileName: "[project]/app/resource-catalog/page.tsx",
                                            lineNumber: 411,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                    lineNumber: 404,
                                    columnNumber: 8
                                }, this) : resources.map((resource)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResourceCard, {
                                        resource: resource,
                                        onClick: ()=>router.push(`/resource/${resource.id}`)
                                    }, resource.id, false, {
                                        fileName: "[project]/app/resource-catalog/page.tsx",
                                        lineNumber: 417,
                                        columnNumber: 9
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/resource-catalog/page.tsx",
                                lineNumber: 398,
                                columnNumber: 6
                            }, this),
                            !loading && hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center mt-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleLoadMore,
                                    disabled: loadingMore,
                                    className: "flex items-center gap-2 px-6 py-2.5 bg-[#111111] border border-neutral-800 rounded-lg text-sm text-neutral-300 hover:border-neutral-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                                    children: loadingMore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-4 h-4 border-2 border-neutral-600 border-t-[#fd4d4d] rounded-full animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/resource-catalog/page.tsx",
                                                lineNumber: 440,
                                                columnNumber: 11
                                            }, this),
                                            "Loading…"
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "Load more (",
                                            meta.total - resources.length,
                                            " ",
                                            "remaining)"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/app/resource-catalog/page.tsx",
                                    lineNumber: 431,
                                    columnNumber: 8
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/resource-catalog/page.tsx",
                                lineNumber: 430,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/resource-catalog/page.tsx",
                        lineNumber: 279,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/resource-catalog/page.tsx",
                lineNumber: 267,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/resource-catalog/page.tsx",
                lineNumber: 455,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
_s(ResourceCatalogPage, "ENyRiOw13ZscAbuyggIKMMMsXVE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c2 = ResourceCatalogPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ResourceCard");
__turbopack_context__.k.register(_c1, "SkeletonCard");
__turbopack_context__.k.register(_c2, "ResourceCatalogPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_72bc552d._.js.map