module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/supabase/server-client.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSupabaseServerClient",
    ()=>createSupabaseServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [middleware] (ecmascript)");
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
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseAnonKey, {
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
"[project]/lib/types.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/route-permissions.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RoutePermissions",
    ()=>RoutePermissions,
    "isAuthorized",
    ()=>isAuthorized
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [middleware] (ecmascript)");
;
const RoutePermissions = {
    "/test": [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["Tier"].Citizen
    ],
    "/assign": [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["Tier"].Authority
    ],
    "/dashboard/authority": [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["Tier"].Authority
    ]
};
function isAuthorized(path, tier) {
    for(const route in RoutePermissions){
        if (path === route) {
            return RoutePermissions[route].includes(tier);
        }
    }
    return true;
}
}),
"[project]/lib/supabase/utils.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "countRows",
    ()=>countRows,
    "deleteById",
    ()=>deleteById,
    "deleteRows",
    ()=>deleteRows,
    "getById",
    ()=>getById,
    "getRow",
    ()=>getRow,
    "getRows",
    ()=>getRows,
    "insertRow",
    ()=>insertRow,
    "insertRows",
    ()=>insertRows,
    "rowExists",
    ()=>rowExists,
    "updateById",
    ()=>updateById,
    "updateRows",
    ()=>updateRows,
    "upsertRow",
    ()=>upsertRow,
    "upsertRows",
    ()=>upsertRows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2d$client$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server-client.ts [middleware] (ecmascript)");
;
/**
 * Get a Supabase client for the current request
 */ function getSupabase() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2d$client$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["createSupabaseServerClient"])();
}
async function getRow(table, conditions) {
    const supabase = await getSupabase();
    let query = supabase.from(table).select("*");
    for (const [key, value] of Object.entries(conditions)){
        query = query.eq(key, value);
    }
    const { data, error } = await query.single();
    // Handle "no rows found" error gracefully
    if (error) {
        if (error.code === "PGRST116") {
            // No rows found - return null instead of throwing error
            return null;
        }
        console.error(`Error fetching row from ${table}:`, error);
        return null;
    }
    return data;
}
async function getRows(table, conditions, options) {
    const supabase = await getSupabase();
    let query = supabase.from(table).select(options?.select || "*");
    if (conditions) {
        for (const [key, value] of Object.entries(conditions)){
            query = query.eq(key, value);
        }
    }
    if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true
        });
    }
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    const { data, error } = await query;
    if (error) {
        console.error(`Error fetching rows from ${table}:`, error);
        return [];
    }
    return data || [];
}
async function getById(table, id) {
    return getRow(table, {
        id
    });
}
async function countRows(table, conditions) {
    const supabase = await getSupabase();
    let query = supabase.from(table).select("*", {
        count: "exact",
        head: true
    });
    if (conditions) {
        for (const [key, value] of Object.entries(conditions)){
            query = query.eq(key, value);
        }
    }
    const { count, error } = await query;
    if (error) {
        console.error(`Error counting rows in ${table}:`, error);
        return 0;
    }
    return count || 0;
}
async function insertRow(table, data) {
    const supabase = await getSupabase();
    const { data: result, error } = await supabase.from(table).insert([
        data
    ]).select().single();
    if (error) {
        console.error(`Error inserting row into ${table}:`, error);
        return null;
    }
    return result;
}
async function insertRows(table, data) {
    const supabase = await getSupabase();
    const { data: result, error } = await supabase.from(table).insert(data).select();
    if (error) {
        console.error(`Error inserting rows into ${table}:`, error);
        return [];
    }
    return result || [];
}
async function updateById(table, id, updates) {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single();
    if (error) {
        if (error.code === "PGRST116") {
            // No rows found - return null instead of throwing error
            return null;
        }
        console.error(`Error updating row in ${table}:`, error);
        return null;
    }
    return data;
}
async function updateRows(table, updates, conditions) {
    const supabase = await getSupabase();
    let query = supabase.from(table).update(updates);
    for (const [key, value] of Object.entries(conditions)){
        query = query.eq(key, value);
    }
    const { data, error } = await query.select();
    if (error) {
        console.error(`Error updating rows in ${table}:`, error);
        return [];
    }
    return data || [];
}
async function deleteById(table, id) {
    const supabase = await getSupabase();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
        console.error(`Error deleting row from ${table}:`, error);
        return false;
    }
    return true;
}
async function deleteRows(table, conditions) {
    const supabase = await getSupabase();
    let query = supabase.from(table).delete();
    for (const [key, value] of Object.entries(conditions)){
        query = query.eq(key, value);
    }
    const { error } = await query;
    if (error) {
        console.error(`Error deleting rows from ${table}:`, error);
        return false;
    }
    return true;
}
async function upsertRow(table, data, options) {
    const supabase = await getSupabase();
    const { data: result, error } = await supabase.from(table).upsert([
        data
    ], {
        onConflict: options?.onConflict || "id"
    }).select().single();
    if (error) {
        if (error.code === "PGRST116") {
            // No rows found - return null instead of throwing error
            return null;
        }
        console.error(`Error upserting row in ${table}:`, error);
        return null;
    }
    return result;
}
async function upsertRows(table, data, options) {
    const supabase = await getSupabase();
    const { data: result, error } = await supabase.from(table).upsert(data, {
        onConflict: options?.onConflict || "id"
    }).select();
    if (error) {
        console.error(`Error upserting rows in ${table}:`, error);
        return [];
    }
    return result || [];
}
async function rowExists(table, conditions) {
    const count = await countRows(table, conditions);
    return count > 0;
}
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2d$client$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server-client.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$permissions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/route-permissions.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$utils$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/utils.ts [middleware] (ecmascript)");
;
;
;
;
async function proxy(request) {
    const path = request.nextUrl.pathname;
    // Check if this path requires authorization
    const requiresAuth = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$permissions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["RoutePermissions"]).includes(path);
    if (!requiresAuth) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2d$client$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["createSupabaseServerClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    // User not logged in
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
    }
    // User logged in - check tier permissions
    const profile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$utils$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["getRow"])("profiles", {
        id: user.id
    });
    if (!profile) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/404", request.url));
    }
    // Check if user tier is allowed for this route
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$permissions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["isAuthorized"])(path, profile.tier)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/404", request.url));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__01b9dd82._.js.map