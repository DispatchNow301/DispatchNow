"use client";
import { useState, useEffect } from "react";

type UserProfile = {
	id: string;
	email: string | null;
	tier: number | null;
};

type AuditLog = {
	id: string;
	profile_id: string;
	changed_by: string;
	column_changed: string;
	old_value: string;
	new_value: string;
	changed_at: string;
};

type AssignProps = {
	users: UserProfile[];
};

export default function AssignPageClient({ users: initialUsers }: AssignProps) {
	const [users, setUsers] = useState(initialUsers);
	const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

	// Fetch audit logs on mount
	useEffect(() => {
		const fetchAuditLogs = async () => {
			const res = await fetch("/api/audit-logs");
			const json = await res.json();
			if (res.ok) {
				setAuditLogs(json.data);
			}
		};
		fetchAuditLogs();
	}, []);

	const updateTier = async (userId: string, newTier: number) => {
		const res = await fetch("/api/update-tier", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId, tier: newTier }),
		});

		const data = await res.json();

		if (res.ok && data.data) {
			setUsers((prev) =>
				prev.map((u) =>
					u.id === userId ? { ...u, tier: newTier } : u,
				),
			);

			// Add new audit log at top immediately
			setAuditLogs((prev) => [
				{
					id: Math.random().toString(),
					profile_id: userId,
					changed_by: "You", // optionally replace with actual user id
					column_changed: "tier",
					old_value: String(users.find((u) => u.id === userId)?.tier),
					new_value: String(newTier),
					changed_at: new Date().toISOString(),
				},
				...prev,
			]);
		} else {
			alert("Error updating tier: " + data.error);
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Assignable Users</h1>

			{/* Users grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
				{users.map((user) => (
					<div
						key={user.id}
						className="border rounded-lg p-4 shadow hover:shadow-lg transition"
					>
						<p className="text-sm text-gray-600">
							{user.email || "No Email"}
						</p>
						<div className="mt-2">
							<label className="text-sm font-medium mr-2">
								Tier:
							</label>
							<select
								value={user.tier || 0}
								onChange={(e) =>
									updateTier(user.id, Number(e.target.value))
								}
								className="border rounded px-2 py-1 text-sm"
							>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
							</select>
						</div>
					</div>
				))}
			</div>

			{/* Audit logs */}
			<h2 className="text-xl font-bold mb-4">
				Audit History (latest changes)
			</h2>
			{auditLogs.length === 0 ? (
				<p>No audit logs yet.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full border">
						<thead>
							<tr className="bg-neutral-800">
								<th className="px-4 py-2 border">Profile ID</th>
								<th className="px-4 py-2 border">Changed By</th>
								<th className="px-4 py-2 border">Column</th>
								<th className="px-4 py-2 border">Old Value</th>
								<th className="px-4 py-2 border">New Value</th>
								<th className="px-4 py-2 border">Changed At</th>
							</tr>
						</thead>
						<tbody>
							{auditLogs.map((log) => (
								<tr key={log.id} className="text-sm">
									<td className="px-4 py-2 border">
										{log.profile_id}
									</td>
									<td className="px-4 py-2 border">
										{log.changed_by}
									</td>
									<td className="px-4 py-2 border">
										{log.column_changed}
									</td>
									<td className="px-4 py-2 border">
										{log.old_value}
									</td>
									<td className="px-4 py-2 border">
										{log.new_value}
									</td>
									<td className="px-4 py-2 border">
										{new Date(
											log.changed_at,
										).toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
