import { createSupabaseServerClient } from "./server-client";

/**
 * Get a Supabase client for the current request
 */
function getSupabase() {
	return createSupabaseServerClient();
}

// ============================================================================
// FETCH/READ OPERATIONS
// ============================================================================

export async function getRow<T>(
	table: string,
	conditions: Record<string, any>,
): Promise<T | null> {
	const supabase = await getSupabase();
	let query = supabase.from(table).select("*");

	for (const [key, value] of Object.entries(conditions)) {
		query = query.eq(key, value);
	}

	const { data, error } = await query.single();
	if (error) {
		console.error(`Error fetching row from ${table}:`, error);
		return null;
	}

	return data as T;
}

export async function getRows<T>(
	table: string,
	conditions?: Record<string, any>,
	options?: {
		select?: string;
		limit?: number;
		offset?: number;
		orderBy?: { column: string; ascending?: boolean };
	},
): Promise<T[]> {
	const supabase = await getSupabase();
	let query = supabase.from(table).select(options?.select || "*");

	if (conditions) {
		for (const [key, value] of Object.entries(conditions)) {
			query = query.eq(key, value);
		}
	}

	if (options?.orderBy) {
		query = query.order(options.orderBy.column, {
			ascending: options.orderBy.ascending ?? true,
		});
	}

	if (options?.limit) query = query.limit(options.limit);
	if (options?.offset) {
		query = query.range(
			options.offset,
			options.offset + (options.limit || 10) - 1,
		);
	}

	const { data, error } = await query;
	if (error) {
		console.error(`Error fetching rows from ${table}:`, error);
		return [];
	}

	return (data as T[]) || [];
}

export async function getById<T>(
	table: string,
	id: string | number,
): Promise<T | null> {
	return getRow<T>(table, { id });
}

export async function countRows(
	table: string,
	conditions?: Record<string, any>,
): Promise<number> {
	const supabase = await getSupabase();
	let query = supabase
		.from(table)
		.select("*", { count: "exact", head: true });

	if (conditions) {
		for (const [key, value] of Object.entries(conditions)) {
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

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

export async function insertRow<T>(table: string, data: T): Promise<T | null> {
	const supabase = await getSupabase();
	const { data: result, error } = await supabase
		.from(table)
		.insert([data])
		.select()
		.single();

	if (error) {
		console.error(`Error inserting row into ${table}:`, error);
		return null;
	}

	return result as T;
}

export async function insertRows<T>(table: string, data: T[]): Promise<T[]> {
	const supabase = await getSupabase();
	const { data: result, error } = await supabase
		.from(table)
		.insert(data)
		.select();

	if (error) {
		console.error(`Error inserting rows into ${table}:`, error);
		return [];
	}

	return (result as T[]) || [];
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

export async function updateById<T>(
	table: string,
	id: string | number,
	updates: Partial<T>,
): Promise<T | null> {
	const supabase = await getSupabase();
	const { data, error } = await supabase
		.from(table)
		.update(updates)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error(`Error updating row in ${table}:`, error);
		return null;
	}

	return data as T;
}

export async function updateRows<T>(
	table: string,
	updates: Partial<T>,
	conditions: Record<string, any>,
): Promise<T[]> {
	const supabase = await getSupabase();
	let query = supabase.from(table).update(updates);

	for (const [key, value] of Object.entries(conditions)) {
		query = query.eq(key, value);
	}

	const { data, error } = await query.select();
	if (error) {
		console.error(`Error updating rows in ${table}:`, error);
		return [];
	}

	return (data as T[]) || [];
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

export async function deleteById(
	table: string,
	id: string | number,
): Promise<boolean> {
	const supabase = await getSupabase();
	const { error } = await supabase.from(table).delete().eq("id", id);

	if (error) {
		console.error(`Error deleting row from ${table}:`, error);
		return false;
	}

	return true;
}

export async function deleteRows(
	table: string,
	conditions: Record<string, any>,
): Promise<boolean> {
	const supabase = await getSupabase();
	let query = supabase.from(table).delete();

	for (const [key, value] of Object.entries(conditions)) {
		query = query.eq(key, value);
	}

	const { error } = await query;
	if (error) {
		console.error(`Error deleting rows from ${table}:`, error);
		return false;
	}

	return true;
}

// ============================================================================
// UPSERT OPERATIONS
// ============================================================================

export async function upsertRow<T>(
	table: string,
	data: T,
	options?: { onConflict?: string },
): Promise<T | null> {
	const supabase = await getSupabase();
	const { data: result, error } = await supabase
		.from(table)
		.upsert([data], { onConflict: options?.onConflict || "id" })
		.select()
		.single();

	if (error) {
		console.error(`Error upserting row in ${table}:`, error);
		return null;
	}

	return result as T;
}

export async function upsertRows<T>(
	table: string,
	data: T[],
	options?: { onConflict?: string },
): Promise<T[]> {
	const supabase = await getSupabase();
	const { data: result, error } = await supabase
		.from(table)
		.upsert(data, { onConflict: options?.onConflict || "id" })
		.select();

	if (error) {
		console.error(`Error upserting rows in ${table}:`, error);
		return [];
	}

	return (result as T[]) || [];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export async function rowExists(
	table: string,
	conditions: Record<string, any>,
): Promise<boolean> {
	const count = await countRows(table, conditions);
	return count > 0;
}
