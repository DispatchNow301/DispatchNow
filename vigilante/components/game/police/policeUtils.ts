import type { LatLngTuple } from "leaflet";
import type { PoliceMode, PoliceUnit } from "./policeTypes";

const RESPONSE_MIN_SEGMENT_MS = 180;
const RESPONSE_MAX_SEGMENT_MS = 3200;
const REJOIN_MIN_SEGMENT_MS = 260;
const REJOIN_MAX_SEGMENT_MS = 4600;
const PATROL_MIN_SEGMENT_MS = 520;
const PATROL_MAX_SEGMENT_MS = 6200;

export function clamp01(x: number) {
	return Math.max(0, Math.min(1, x));
}

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export function samePoint(a: LatLngTuple, b: LatLngTuple) {
	return Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
}

export function ensureClosedLoop(points: LatLngTuple[]) {
	if (points.length < 2) return points.slice();

	const first = points[0];
	const last = points[points.length - 1];

	if (samePoint(first, last)) {
		return points.slice();
	}

	return [...points, first];
}

export function distanceMeters(a: LatLngTuple, b: LatLngTuple) {
	const avgLat = ((a[0] + b[0]) / 2) * (Math.PI / 180);
	const dx = (a[1] - b[1]) * 111320 * Math.cos(avgLat);
	const dy = (a[0] - b[0]) * 110540;
	return Math.sqrt(dx * dx + dy * dy);
}

export function getPathDistanceMeters(path: LatLngTuple[]) {
	if (path.length < 2) return 0;

	let total = 0;
	for (let i = 0; i < path.length - 1; i += 1) {
		total += distanceMeters(path[i], path[i + 1]);
	}
	return total;
}

export function normalizePath(path: LatLngTuple[]) {
	if (path.length <= 1) return path.slice();

	const out: LatLngTuple[] = [path[0]];
	for (let i = 1; i < path.length; i += 1) {
		if (!samePoint(path[i - 1], path[i])) {
			out.push(path[i]);
		}
	}
	return out;
}

/**
 * Resample the path so movement remains smooth even when Google returns
 * uneven segment lengths.
 */
export function resamplePath(path: LatLngTuple[], targetStepMeters = 26) {
	const clean = normalizePath(path);
	if (clean.length < 2) return clean;

	const out: LatLngTuple[] = [clean[0]];

	for (let i = 0; i < clean.length - 1; i += 1) {
		const a = clean[i];
		const b = clean[i + 1];
		const meters = distanceMeters(a, b);

		if (meters <= targetStepMeters) {
			out.push(b);
			continue;
		}

		const steps = Math.ceil(meters / targetStepMeters);

		for (let step = 1; step <= steps; step += 1) {
			const t = step / steps;
			out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
		}
	}

	return normalizePath(out);
}

export function getSpeedMps(unit: PoliceUnit, mode: PoliceMode) {
	switch (mode) {
		case "responding":
			return unit.responseOverrideMps ?? unit.speeds.responseMps;
		case "rejoining":
			return unit.speeds.rejoinMps;
		case "holding":
			return 0;
		case "patrolling":
		default:
			return unit.speeds.patrolMps;
	}
}

export function getSegmentDurationMs(
	unit: PoliceUnit,
	from: LatLngTuple,
	to: LatLngTuple,
	mode: PoliceMode,
) {
	const meters = distanceMeters(from, to);
	const speedMps = Math.max(getSpeedMps(unit, mode), 0.1);
	const base = Math.round((meters / speedMps) * 1000);

	if (mode === "responding") {
		return Math.max(
			RESPONSE_MIN_SEGMENT_MS,
			Math.min(RESPONSE_MAX_SEGMENT_MS, base),
		);
	}

	if (mode === "rejoining") {
		return Math.max(
			REJOIN_MIN_SEGMENT_MS,
			Math.min(REJOIN_MAX_SEGMENT_MS, base),
		);
	}

	if (mode === "holding") {
		return 1000;
	}

	return Math.max(
		PATROL_MIN_SEGMENT_MS,
		Math.min(PATROL_MAX_SEGMENT_MS, base),
	);
}

export function getUnitPosition(unit: PoliceUnit, now: number): LatLngTuple {
	if (unit.path.length === 0) return [0, 0];
	if (unit.path.length === 1) return unit.path[0];

	const safeIndex = Math.max(
		0,
		Math.min(unit.segmentIndex, unit.path.length - 2),
	);

	const from = unit.path[safeIndex];
	const to = unit.path[safeIndex + 1];
	const t = clamp01((now - unit.segmentStartedAt) / unit.segmentDurationMs);

	return [lerp(from[0], to[0], t), lerp(from[1], to[1], t)];
}

export function advanceUnit(unit: PoliceUnit, now: number) {
	if (unit.path.length < 2) {
		return { nextUnit: unit, pathFinished: true };
	}

	let next = { ...unit };
	let startedAt = next.segmentStartedAt;
	let segmentIndex = next.segmentIndex;
	let segmentDurationMs = next.segmentDurationMs;

	while (now >= startedAt + segmentDurationMs) {
		if (segmentIndex >= next.path.length - 2) {
			return {
				nextUnit: {
					...next,
					segmentIndex,
					segmentStartedAt: startedAt,
					segmentDurationMs,
				},
				pathFinished: true,
			};
		}

		startedAt += segmentDurationMs;
		segmentIndex += 1;

		const from = next.path[segmentIndex];
		const to = next.path[segmentIndex + 1];
		segmentDurationMs = getSegmentDurationMs(next, from, to, next.mode);
	}

	next = {
		...next,
		segmentIndex,
		segmentStartedAt: startedAt,
		segmentDurationMs,
	};

	return { nextUnit: next, pathFinished: false };
}

export function switchUnitToPath(args: {
	unit: PoliceUnit;
	path: LatLngTuple[];
	mode: PoliceMode;
	isLooping: boolean;
	nextLoopPath: LatLngTuple[] | null;
	assignedIncidentId: string | null;
	holdUntilTs: number | null;
	now: number;
}) {
	const path = resamplePath(args.path);

	const nextBase: PoliceUnit = {
		...args.unit,
		mode: args.mode,
		path,
		isLooping: args.isLooping,
		nextLoopPath: args.nextLoopPath,
		assignedIncidentId: args.assignedIncidentId,
		holdUntilTs: args.holdUntilTs,
		cooldownUntilTs: args.unit.cooldownUntilTs,
		segmentIndex: 0,
		segmentStartedAt: args.now,
		segmentDurationMs: 1000,
		responseOverrideMps:
			args.mode === "responding"
				? args.unit.responseOverrideMps ?? null
				: null,
	};

	if (path.length < 2) {
		return nextBase;
	}

	return {
		...nextBase,
		segmentDurationMs: getSegmentDurationMs(
			nextBase,
			path[0],
			path[1],
			args.mode,
		),
	};
}

export function restartLoop(unit: PoliceUnit, now: number) {
	if (unit.path.length < 2) return unit;

	const nextUnit: PoliceUnit = {
		...unit,
		responseOverrideMps:
			unit.mode === "responding"
				? unit.responseOverrideMps ?? null
				: null,
		segmentIndex: 0,
		segmentStartedAt: now,
		segmentDurationMs: 1000,
	};

	return {
		...nextUnit,
		segmentDurationMs: getSegmentDurationMs(
			nextUnit,
			nextUnit.path[0],
			nextUnit.path[1],
			nextUnit.mode,
		),
	};
}

export function rotateClosedLoop(loop: LatLngTuple[], startIndex: number) {
	if (loop.length < 2) return loop.slice();

	const closed = samePoint(loop[0], loop[loop.length - 1]);
	const core = closed ? loop.slice(0, -1) : loop.slice();

	if (core.length < 2) return loop.slice();

	const idx = Math.max(0, Math.min(startIndex, core.length - 1));
	const rotated = [...core.slice(idx), ...core.slice(0, idx)];

	return [...rotated, rotated[0]];
}

export function findNearestPointIndex(path: LatLngTuple[], point: LatLngTuple) {
	let bestIdx = 0;
	let bestDistance = Number.POSITIVE_INFINITY;

	for (let i = 0; i < path.length; i += 1) {
		const d = distanceMeters(path[i], point);
		if (d < bestDistance) {
			bestDistance = d;
			bestIdx = i;
		}
	}

	return bestIdx;
}

export function getRemainingVisiblePath(unit: PoliceUnit, now: number) {
	if (unit.path.length === 0) return [];
	if (unit.path.length === 1) return unit.path.slice();

	const currentPos = getUnitPosition(unit, now);
	const nextPoints = unit.path.slice(
		Math.min(unit.segmentIndex + 1, unit.path.length - 1),
	);

	return [currentPos, ...nextPoints];
}

export function getRemainingEtaMs(unit: PoliceUnit, now: number) {
	if (unit.path.length < 2) return 0;

	const safeIndex = Math.max(
		0,
		Math.min(unit.segmentIndex, unit.path.length - 2),
	);

	let total = Math.max(unit.segmentStartedAt + unit.segmentDurationMs - now, 0);

	for (let i = safeIndex + 1; i < unit.path.length - 1; i += 1) {
		total += getSegmentDurationMs(
			unit,
			unit.path[i],
			unit.path[i + 1],
			unit.mode,
		);
	}

	return total;
}