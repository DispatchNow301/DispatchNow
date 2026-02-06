"use client";

import { useState, useEffect } from "react";

type Report = {
	id: string;
	description: string;
	type: string;
	location: string;
	status: string;
	created_at: string;
};

export default function ReportPage() {
	const [description, setDescription] = useState("");
	const [type, setType] = useState("");
	const [location, setLocation] = useState("");
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchReports = async () => {
		try {
			const res = await fetch("/api/report/list");
			const data = await res.json();
			if (!res.ok)
				throw new Error(data.error || "Failed to fetch reports");
			setReports(data.data || []);
		} catch (err: any) {
			console.error("Error fetching reports:", err);
			alert("Error fetching reports: " + err.message);
		}
	};

	useEffect(() => {
		fetchReports();
	}, []);

	const submitReport = async () => {
		if (!description || !type || !location) {
			alert("Please fill all fields");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/report/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ description, type, location }),
			});
			const data = await res.json();

			if (!res.ok)
				throw new Error(data.error || "Failed to create report");

			// Reset form
			setDescription("");
			setType("");
			setLocation("");

			// Refresh reports
			fetchReports();
		} catch (err: any) {
			console.error("Error submitting report:", err);
			alert("Error submitting report: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 max-w-xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold">Create Report</h1>

			<input
				placeholder="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				className="border p-2 w-full rounded"
			/>
			<input
				placeholder="Type"
				value={type}
				onChange={(e) => setType(e.target.value)}
				className="border p-2 w-full rounded"
			/>
			<input
				placeholder="Location"
				value={location}
				onChange={(e) => setLocation(e.target.value)}
				className="border p-2 w-full rounded"
			/>

			<button
				onClick={submitReport}
				disabled={loading}
				className="bg-black text-white px-4 py-2 rounded"
			>
				{loading ? "Submitting..." : "Submit Report"}
			</button>

			<hr />

			<h2 className="text-xl font-bold">My Reports</h2>

			<div className="space-y-3">
				{reports.length === 0 && <p>No reports found.</p>}
				{reports.map((r) => (
					<div key={r.id} className="border p-3 rounded">
						<p className="text-sm text-gray-500">
							{new Date(r.created_at).toLocaleString()}
						</p>
						<p>
							<b>{r.type}</b>
						</p>
						<p>{r.description}</p>
						<p className="text-sm text-gray-500">
							{r.location} • {r.status}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
