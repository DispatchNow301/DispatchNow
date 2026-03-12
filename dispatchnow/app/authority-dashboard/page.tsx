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

type Report = {
	id: string;
	created_at: string;
	title: string;
	description: string;
	endorsements_count: number;
	type: string;
	location: string;
	status: string;
};

const AuthorityDashboard = () => {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			// Fetch incidents
			const { data: incidentsRaw, error: incidentsError } = await supabase
				.from("incidents")
				.select("id, priority, status, created_at, closed_at");

			if (incidentsError) {
				console.error(
					"Error fetching incidents:",
					incidentsError.message,
				);
				setIncidents([]);
			} else {
				// Custom ordering for incidents
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
			}

			// Fetch reports
			const { data: reportsRaw, error: reportsError } = await supabase
				.from("reports")
				.select(
					"id, created_at, title, description, endorsements_count, type, location, status",
				)
				.order("created_at", { ascending: false }); // newest first

			if (reportsError) {
				console.error("Error fetching reports:", reportsError.message);
				setReports([]);
			} else {
				setReports(reportsRaw || []);
			}

			setLoading(false);
		};

		loadData();
	}, []);

	if (loading) return <div>Loading dashboard...</div>;

	return (
		<div style={{ padding: "20px" }}>
			<h1>Incidents Dashboard</h1>
			{incidents.length === 0 ? (
				<p>No incidents found.</p>
			) : (
				incidents.map((inc) => (
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
				))
			)}

			<h1 style={{ marginTop: "40px" }}>Reports</h1>
			{reports.length === 0 ? (
				<p>No reports found.</p>
			) : (
				reports.map((rep) => (
					<div
						key={rep.id}
						style={{
							border: "1px solid #ccc",
							borderRadius: "8px",
							padding: "12px",
							marginBottom: "12px",
						}}
					>
						<p>
							<strong>ID:</strong> {rep.id}
						</p>
						<p>
							<strong>Title:</strong> {rep.title}
						</p>
						<p>
							<strong>Description:</strong> {rep.description}
						</p>
						<p>
							<strong>Type:</strong> {rep.type}
						</p>
						<p>
							<strong>Location:</strong> {rep.location}
						</p>
						<p>
							<strong>Status:</strong> {rep.status}
						</p>
						<p>
							<strong>Endorsements:</strong>{" "}
							{rep.endorsements_count}
						</p>
						<p>
							<strong>Created:</strong>{" "}
							{new Date(rep.created_at).toLocaleString()}
						</p>
					</div>
				))
			)}
		</div>
	);
};

export default AuthorityDashboard;
