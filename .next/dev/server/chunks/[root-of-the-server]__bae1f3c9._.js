module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/supabase/server-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSupabaseServerClient",
    ()=>createSupabaseServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
function getEnvironmentVariables() {
    const supabaseUrl = ("TURBOPACK compile-time value", "https://wcuvrdjqizlauwvrvdmk.supabase.co");
    const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdXZyZGpxaXpsYXV3dnJ2ZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzA0NTgsImV4cCI6MjA4NDk0NjQ1OH0.T9t4gViQwSoWR8pFTpyFD8v-XUB8sq6lDCoB9NDGjRM");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        supabaseUrl,
        supabaseAnonKey
    };
}
async function createSupabaseServerClient() {
    const { supabaseUrl, supabaseAnonKey } = getEnvironmentVariables();
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch (error) {
                    console.log(error);
                }
            }
        }
    });
}
}),
"[project]/lib/api-errors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiErrors",
    ()=>ApiErrors
]);
const ApiErrors = {
    NETWORK_ERROR: {
        code: 0,
        message: "Network error. Please try again later."
    },
    INVALID_CREDENTIALS: {
        code: 401,
        message: "Invalid email or password."
    },
    UNAUTHORIZED: {
        code: 403,
        message: "You are not authorized to perform this action."
    },
    FORM_VALIDATION: {
        code: 400,
        message: "Please check the form for errors."
    },
    USER_NOT_FOUND: {
        code: 404,
        message: "User does not exist."
    },
    SERVER_ERROR: {
        code: 500,
        message: "Something went wrong on the server."
    }
};
}),
"[project]/lib/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/app/api/resources/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// usage: GET /api/resources?search=&type=&limit=&offset=
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server-client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-errors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") ?? "";
        const type = searchParams.get("type");
        const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
        const offset = parseInt(searchParams.get("offset") ?? "0");
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSupabaseServerClient"])();
        let query = supabase.from("resources").select("*", {
            count: "exact"
        }).order("created_at", {
            ascending: false
        }).range(offset, offset + limit - 1);
        if (search.trim()) {
            query = query.or(`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
        }
        if (type && Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ResourceType"]).includes(type)) {
            query = query.eq("type", type);
        }
        const { data, error, count } = await query;
        if (error) {
            console.error(error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiErrors"].SERVER_ERROR, {
                status: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiErrors"].SERVER_ERROR.code
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data,
            meta: {
                total: count ?? 0,
                limit,
                offset
            }
        });
    } catch (err) {
        console.error(err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiErrors"].SERVER_ERROR, {
            status: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiErrors"].SERVER_ERROR.code
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bae1f3c9._.js.map