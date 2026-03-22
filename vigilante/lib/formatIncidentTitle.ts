/**
 * Display title for incident type labels (e.g. "elevator rescue" → "Elevator Rescue").
 * Splits on spaces and hyphens so each word segment is capitalized.
 */
export function formatIncidentTypeLabel(raw: string): string {
	return raw
		.trim()
		.split(/\s+/)
		.map((word) =>
			word
				.split("-")
				.map((seg) =>
					seg.length === 0
						? seg
						: seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase(),
				)
				.join("-"),
		)
		.join(" ");
}
