"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Incident = {
	id: string;
	priority: string; // HIGH | MEDIUM | LOW
	status: string; // ACTIVE | PAUSED | CLOSED
	created_at: string;
	closed_at: string | null;
};

const AuthorityDashboard = () => {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadIncidents = async () => {
			const { data: incidentsRaw, error } = await supabase
				.from("incidents")
				.select("id, priority, status, created_at, closed_at");

			if (error) {
				console.error("Error fetching incidents:", error.message);
				setIncidents([]);
				setLoading(false);
				return;
			}

			// Define custom ordering
			const statusOrder: Record<string, number> = {
				ACTIVE: 1,
				PAUSED: 2,
				CLOSED: 3,
			};
			const priorityOrder: Record<string, number> = {
				HIGH: 1,
				MEDIUM: 2,
				LOW: 3,
			};

			// Sort in JS
			const sortedIncidents = (incidentsRaw || []).sort((a, b) => {
				const s1 = statusOrder[a.status] || 99;
				const s2 = statusOrder[b.status] || 99;
				if (s1 !== s2) return s1 - s2;

				const p1 = priorityOrder[a.priority] || 99;
				const p2 = priorityOrder[b.priority] || 99;
				if (p1 !== p2) return p1 - p2;

				return (
					new Date(b.created_at).getTime() -
					new Date(a.created_at).getTime()
				);
			});

			setIncidents(sortedIncidents);
			setLoading(false);
		};

		loadIncidents();
	}, []);

	if (loading) return <div>Loading incidents...</div>;

	return (
		<div style={{ padding: "20px" }}>
			<h1>Incidents Dashboard</h1>
			{incidents.length === 0 && <p>No incidents found.</p>}
			{incidents.map((inc) => (
				<div
					key={inc.id}
					style={{
						border: "1px solid #ccc",
						borderRadius: "8px",
						padding: "12px",
						marginBottom: "12px",
					}}
				>
					<p>
						<strong>ID:</strong> {inc.id}
					</p>
					<p>
						<strong>Priority:</strong> {inc.priority}
					</p>
					<p>
						<strong>Status:</strong> {inc.status}
					</p>
					<p>
						<strong>Created:</strong>{" "}
						{new Date(inc.created_at).toLocaleString()}
					</p>
					<p>
						<strong>Closed:</strong>{" "}
						{inc.closed_at
							? new Date(inc.closed_at).toLocaleString()
							: "Not closed"}
					</p>
				</div>
			))}
		</div>
	);
};

export default AuthorityDashboard;
