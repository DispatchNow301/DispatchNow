import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export type OsmPlace = {
	name: string;
	lat: number;
	lng: number;
	kind?: string;
};

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const south = searchParams.get("south");
	const west = searchParams.get("west");
	const north = searchParams.get("north");
	const east = searchParams.get("east");

	if (!south || !west || !north || !east) {
		return NextResponse.json(
			{ error: "Missing bbox params" },
			{ status: 400 },
		);
	}

	const bbox = `${south},${west},${north},${east}`;

	// Global bbox filter keeps the query fast — Overpass only scans that tile.
	// "out 400" caps results so we never pull 5k nodes on wider viewports.
	const query = `
[out:json][timeout:20][bbox:${bbox}];
(
  node["amenity"]["name"];
  node["shop"]["name"];
  node["tourism"]["name"];
  node["office"]["name"];
  node["leisure"]["name"];
  node["building"]["name"];
  node["public_transport"]["name"];
);
out 400;
`.trim();

	try {
		const res = await fetch(OVERPASS_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `data=${encodeURIComponent(query)}`,
			signal: AbortSignal.timeout(22_000),
		});

		if (!res.ok) {
			return NextResponse.json({ places: [] }, { status: 200 });
		}

		const data = (await res.json()) as {
			elements: Array<{
				lat: number;
				lon: number;
				tags: Record<string, string>;
			}>;
		};

		const places: OsmPlace[] = (data.elements ?? [])
			.filter((el) => el.tags?.name && el.tags.name.trim().length > 0)
			.map((el) => ({
				name: el.tags.name,
				lat: el.lat,
				lng: el.lon,
				kind:
					el.tags.amenity ??
					el.tags.shop ??
					el.tags.tourism ??
					el.tags.office ??
					el.tags.leisure ??
					undefined,
			}));

		return NextResponse.json({ places });
	} catch {
		return NextResponse.json({ places: [] }, { status: 200 });
	}
}
