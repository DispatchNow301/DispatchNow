"use client";
import { useEffect, useState } from "react";

type AuditLog = {
	id: string;
	profile_id: string;
	changed_by: string;
	column_changed: string;
	old_value: string;
	new_value: string;
	changed_at: string;
};

export default function AuditPage() {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const res = await fetch("/api/audit");
				const data = await res.json();

				if (!res.ok) throw new Error(data.error);

				setLogs(data.data || []);
			} catch (err) {
				console.error("Failed to fetch audit logs:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchLogs();
	}, []);

	if (loading) return <p className="p-6">Loading audit logs...</p>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">
				Audit History (latest changes)
			</h1>

			{logs.length === 0 ? (
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
							{logs.map((log) => (
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
