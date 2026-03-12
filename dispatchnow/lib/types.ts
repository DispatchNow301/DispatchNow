export enum Tier {
	Citizen = 1,
	Volunteer = 2,
	Authority = 3,
}

export enum ReportType {
	Pothole = "pothole",
	Flooding = "flooding",
	Debris = "debris",
	Accident = "accident",
	Other = "other",
}

export enum ReportStatus {
	Unverified = "unverified",
	Verified = "verified",
	Resolved = "resolved",
	Rejected = "rejected",
}

export enum ResourceType {
	Water = "water",
	Blanket = "blanket",
	Food = "food",
	Medical = "medical",
	Shelter = "shelter",
	Other = "other",
}

export enum IncidentStatus {
	Active = "active",
	Paused = "paused",
	Closed = "closed",
}

export enum IncidentPriority {
	Low = "low",
	Medium = "medium",
	High = "high",
}
