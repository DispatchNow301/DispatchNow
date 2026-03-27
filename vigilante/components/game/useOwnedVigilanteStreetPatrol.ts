"use client";

import type { LatLngTuple } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { getVigilantePatrolStreetLoop } from "./police/googleRoutes";
import type { PoliceUnit } from "./police/policeTypes";
import {
	advanceUnit,
	ensureClosedLoop,
	getUnitPosition,
	restartLoop,
	rotateClosedLoop,
	switchUnitToPath,
} from "./police/policeUtils";

const TICK_MS = 16;

/** Corner offsets around each vigilante's local patrol center. */
const PATROL_CORNER_OFFSETS: LatLngTuple[] = [
	[0.00072, -0.00072],
	[0.0008, 0.00068],
	[-0.00068, 0.00078],
	[-0.00078, -0.00064],
];

function rotationForVigilanteId(id: string): number {
	let rot = 0;
	for (let i = 0; i < id.length; i += 1) {
		rot = (rot + id.charCodeAt(i)) % PATROL_CORNER_OFFSETS.length;
	}
	return rot;
}

function routePhaseForVigilanteId(id: string): number {
	let seed = 0;
	for (let i = 0; i < id.length; i += 1) {
		seed = (seed * 33 + id.charCodeAt(i)) >>> 0;
	}
	return seed;
}

export function anchorsForOwnedVigilantePatrol(
	vigilanteId: string,
	base: LatLngTuple,
	slotIndex: number,
	totalOwned: number,
): LatLngTuple[] {
	const count = Math.max(totalOwned, 1);
	const angle = (Math.PI * 2 * slotIndex) / count;
	const ringBase = count <= 3 ? 0.009 : count <= 5 ? 0.0105 : 0.012;
	// Interleave a second ring so adjacent slots don't track on nearly the same orbit.
	const ring = ringBase + (slotIndex % 2 === 0 ? 0 : 0.0018);
	const phase = slotIndex % 2 === 0 ? 0 : Math.PI / Math.max(count, 2);
	const centerLat = base[0] + Math.cos(angle + phase) * ring;
	const centerLng = base[1] + Math.sin(angle + phase) * ring;

	const rot = rotationForVigilanteId(vigilanteId);
	const n = PATROL_CORNER_OFFSETS.length;
	return Array.from({ length: n }, (_, i) => {
		const [dLat, dLng] = PATROL_CORNER_OFFSETS[(i + rot) % n]!;
		return [centerLat + dLat, centerLng + dLng] as LatLngTuple;
	});
}

function anchorsAroundCenter(vigilanteId: string, center: LatLngTuple): LatLngTuple[] {
	const rot = rotationForVigilanteId(vigilanteId);
	const n = PATROL_CORNER_OFFSETS.length;
	return Array.from({ length: n }, (_, i) => {
		const [dLat, dLng] = PATROL_CORNER_OFFSETS[(i + rot) % n]!;
		return [center[0] + dLat, center[1] + dLng] as LatLngTuple;
	});
}

type OwnedWalker = PoliceUnit & { vigilanteDbId: string };

function createOwnedWalker(
	vigilanteId: string,
	path: LatLngTuple[],
	now: number,
	patrolMps: number,
): OwnedWalker {
	const baseUnit: PoliceUnit = {
		pinId: "cop-diaz",
		displayName: "",
		initial: "V",
		patrolRouteId: "diaz",
		speeds: {
			patrolMps,
			responseMps: patrolMps,
			rejoinMps: patrolMps,
		},
		holdMs: 0,
		mode: "patrolling",
		path: ensureClosedLoop(path),
		segmentIndex: 0,
		segmentStartedAt: now,
		segmentDurationMs: 1000,
		assignedIncidentId: null,
		isLooping: true,
		nextLoopPath: null,
		holdUntilTs: null,
		cooldownUntilTs: null,
	};

	const looped = ensureClosedLoop(path);
	const switched = switchUnitToPath({
		unit: baseUnit,
		path: looped,
		mode: "patrolling",
		isLooping: true,
		nextLoopPath: null,
		assignedIncidentId: null,
		holdUntilTs: null,
		now,
	});

	return { ...switched, vigilanteDbId: vigilanteId };
}

function withDbId(unit: PoliceUnit, id: string): OwnedWalker {
	return { ...unit, vigilanteDbId: id };
}

/**
 * Positions owned vigilantes along Google pedestrian routes (loops near base).
 */
export function useOwnedVigilanteStreetPatrol(
	ownedVigilanteIds: string[],
	base: LatLngTuple,
	roamCenters?: Map<string, { lat: number; lng: number }>,
): Map<string, { lat: number; lng: number }> {
	const [positions, setPositions] = useState<
		Map<string, { lat: number; lng: number }>
	>(() => new Map());

	const walkersRef = useRef<OwnedWalker[]>([]);
	const ownedKeyRef = useRef<string | null>(null);

	useEffect(() => {
		const sorted = [...new Set(ownedVigilanteIds)].sort();
		const centerSig = sorted
			.map((id) => {
				const c = roamCenters?.get(id);
				return c
					? `${id}@${c.lat.toFixed(5)},${c.lng.toFixed(5)}`
					: `${id}@base`;
			})
			.join("\0");
		const key = `${sorted.join("\0")}::${centerSig}`;
		if (ownedKeyRef.current !== null && key === ownedKeyRef.current) return;
		ownedKeyRef.current = key;

		const now = Date.now();
		const prevById = new Map(
			walkersRef.current.map((w) => [w.vigilanteDbId, w]),
		);

		const nextWalkers: OwnedWalker[] = sorted.map((id, idx) => {
			const existing = prevById.get(id);
			if (existing) return existing;

			const centerOverride = roamCenters?.get(id);
			const anchors = centerOverride
				? anchorsAroundCenter(id, [centerOverride.lat, centerOverride.lng])
				: anchorsForOwnedVigilantePatrol(id, base, idx, sorted.length);
			const center = anchors[0] ?? base;
			// Street-only guarantee: don't traverse straight fallback segments that can cut buildings.
			// Hold near center until Google pedestrian loop is ready.
			const fallback: LatLngTuple[] = [center, center];
			const patrolMps = 4.8 + (idx % 3) * 0.35;
			return createOwnedWalker(id, fallback, now, patrolMps);
		});

		walkersRef.current = nextWalkers;

		const initialMap = new Map<string, { lat: number; lng: number }>();
		for (const w of nextWalkers) {
			const p = getUnitPosition(w, now);
			initialMap.set(w.vigilanteDbId, { lat: p[0], lng: p[1] });
		}
		setPositions(initialMap);

		for (let i = 0; i < sorted.length; i += 1) {
			const id = sorted[i]!;
			const centerOverride = roamCenters?.get(id);
			const anchors = centerOverride
				? anchorsAroundCenter(id, [centerOverride.lat, centerOverride.lng])
				: anchorsForOwnedVigilantePatrol(id, base, i, sorted.length);
			const cacheSuffix = centerOverride
				? `${centerOverride.lat.toFixed(4)}_${centerOverride.lng.toFixed(4)}`
				: "base";
			void getVigilantePatrolStreetLoop(id, anchors, cacheSuffix).then((loop) => {
				if (loop.length < 2) return;
				const closed = ensureClosedLoop(loop);
				const phaseSeed = routePhaseForVigilanteId(id);
				const phaseIndex = Math.max(
					0,
					Math.min(
						closed.length - 2,
						phaseSeed % Math.max(closed.length - 1, 1),
					),
				);
				const phasedLoop = rotateClosedLoop(closed, phaseIndex);
				const ts = Date.now();

				walkersRef.current = walkersRef.current.map((w) => {
					if (w.vigilanteDbId !== id) return w;
					if (w.mode !== "patrolling") return w;
					return withDbId(
						switchUnitToPath({
							unit: w,
							path: phasedLoop,
							mode: "patrolling",
							isLooping: true,
							nextLoopPath: null,
							assignedIncidentId: null,
							holdUntilTs: null,
							now: ts,
						}),
						id,
					);
				});
			});
		}
	}, [ownedVigilanteIds, base, roamCenters]);

	useEffect(() => {
		const id = window.setInterval(() => {
			const now = Date.now();

			let changed = false;
			const next = walkersRef.current.map((unit) => {
				const { nextUnit, pathFinished } = advanceUnit(unit, now);

				if (!pathFinished) {
					if (
						nextUnit.segmentIndex !== unit.segmentIndex ||
						nextUnit.segmentStartedAt !== unit.segmentStartedAt
					) {
						changed = true;
					}
					return withDbId(nextUnit, unit.vigilanteDbId);
				}

				if (unit.isLooping) {
					changed = true;
					return withDbId(restartLoop(nextUnit, now), unit.vigilanteDbId);
				}

				return withDbId(nextUnit, unit.vigilanteDbId);
			});

			if (changed || next.length > 0) {
				walkersRef.current = next;
			}

			const map = new Map<string, { lat: number; lng: number }>();
			for (const w of walkersRef.current) {
				const p = getUnitPosition(w, now);
				map.set(w.vigilanteDbId, { lat: p[0], lng: p[1] });
			}
			setPositions(map);
		}, TICK_MS);

		return () => window.clearInterval(id);
	}, []);

	return positions;
}
