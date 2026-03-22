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
"[project]/lib/supabase/utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server-client.ts [app-route] (ecmascript)");
;
/**
 * Get a Supabase client for the current request
 */ function getSupabase() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSupabaseServerClient"])();
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
"[project]/app/api/report/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// usage: GET /api/report/[id]
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/utils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-errors.ts [app-route] (ecmascript)");
;
;
;
async function GET(req, { params }) {
    try {
        const { id } = await params;
        // Fetch the report
        const report = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getById"])("reports", id);
        if (!report) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiErrors"].USER_NOT_FOUND, {
                status: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiErrors"].USER_NOT_FOUND.code
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: report
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

//# sourceMappingURL=%5Broot-of-the-server%5D__92fd2535._.js.map