"use client";
import { useState, useEffect } from "react";

export type UserProfile = {
	id: string;
	email: string | null;
	tier: number | null;
};

type AssignUsersProps = {
	username?: string;
};

export default function AssignUsers({ username }: AssignUsersProps) {
	const [users, setUsers] = useState<UserProfile[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const url = username
				? `/api/user/list?username=${encodeURIComponent(username)}`
				: "/api/user/list";

			const res = await fetch(url);
			const data = await res.json();

			if (!res.ok) throw new Error(data.error || "Failed to fetch users");

			setUsers(data.data || []);
		} catch (err: any) {
			console.error("Error fetching users:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [username]);

	const updateTier = async (userId: string, newTier: number) => {
		// find old tier to display in audit if needed
		const oldTier = users.find((u) => u.id === userId)?.tier ?? 0;

		try {
			const res = await fetch("/api/user/assign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, tier: newTier }),
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.error || "Failed to update tier");

			// update local state
			setUsers((prev) =>
				prev.map((u) =>
					u.id === userId ? { ...u, tier: newTier } : u,
				),
			);

			console.log(`Updated ${userId} tier from ${oldTier} to ${newTier}`);
		} catch (err: any) {
			console.error("Error updating tier:", err);
			alert("Error updating tier: " + err.message);
		}
	};

	if (loading) return <p>Loading users...</p>;
	if (!loading && users.length === 0) return <p>No users found.</p>;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
	);
}
