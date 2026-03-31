"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Polyline } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import type {
	VigilanteCharacterConfig,
	VigilanteIncident,
	VigilanteRenderItem,
	VigilanteUnit,
	VigilanteEtaItem,
} from "./vigilanteTypes";
import { computeLeafletRoute, getPatrolLoopPath } from "../police/googleRoutes";
import {
	advanceUnit,
	distanceMeters,
	ensureClosedLoop,
	findNearestPointIndex,
	getPathDistanceMeters,
	getRemainingEtaMs,
	getRemainingVisiblePath,
	getUnitPosition,
	restartLoop,
	rotateClosedLoop,
	switchUnitToPath,
} from "./vigilanteUtils";

type Props = {
	incidents: VigilanteIncident[];
	ownedVigilanteSheets: Array<{
		id: string;
		name: string;
		alias: string;
		stats: { speed: number };
		portrait: string;
	}>;
	ownedVigilanteIds: string[];
	onVigilanteRenderUpdate?: (items: VigilanteRenderItem[]) => void;
	onVigilanteEtaUpdate?: (items: VigilanteEtaItem[]) => void;
	onVigilanteResolveIncident?: (incidentId: string) => void;
	paused?: boolean;
	timerSlowdownMultiplier?: number;
	getBaseLocation?: () => LatLngTuple;
};

// Patrol anchors for vigilantes - using different areas than police
const VIGILANTE_PATROL_ANCHORS: Record<string, LatLngTuple[]> = {
	default: [
		[40.7139, -74.0038],
		[40.715, -74.005],
		[40.714, -74.006],
		[40.712, -74.0045],
		[40.7115, -74.0025],
	] as LatLngTuple[],
	zone2: [
		[40.716, -74.008],
		[40.718, -74.0095],
		[40.717, -74.011],
		[40.7145, -74.01],
		[40.714, -74.0075],
	] as LatLngTuple[],
	zone3: [
		[40.71, -74.001],
		[40.712, -74.002],
		[40.711, -74.004],
		[40.709, -74.0035],
		[40.7085, -74.0015],
	] as LatLngTuple[],
};

// Default patrol speed for vigilantes (m/s)
const DEFAULT_PATROL_MPS = 6.5;
const DEFAULT_RESPONSE_MPS = 200.0; // 200m per second (for travel time calculation only)
const DEFAULT_REJOIN_MPS = 9.5;
const DEFAULT_HOLD_MS = 3000; // 3 seconds resolution time

const TICK_MS = 60;
const RENDER_TICK_MS = 1000 / 30;
const REASSIGN_COOLDOWN_MS = 1000;
const RESPONSE_RADIUS_METERS = 5000; // Larger radius for vigilantes

const VIGILANTE_ROUTE_MIN_POINT_SPACING_METERS = 8;
const VIGILANTE_ROUTE_HAIRPIN_RETURN_PROXIMITY_METERS = 40;
const VIGILANTE_ROUTE_HAIRPIN_MIN_LEG_METERS = 40;
const VIGILANTE_ROUTE_HAIRPIN_COS_THRESHOLD = -0.2;
const VIGILANTE_ROUTE_DIRECT_SHORTCUT_MAX_DISTANCE_METERS = 420;
const VIGILANTE_ROUTE_DIRECT_SHORTCUT_RATIO_THRESHOLD = 1.35;
const VIGILANTE_ROUTE_HOOK_LOOKAHEAD_POINTS = 10;
const VIGILANTE_ROUTE_HOOK_DETOUR_MIN_METERS = 30;
const VIGILANTE_ROUTE_HOOK_RETURN_TO_START_METERS = 42;
const VIGILANTE_ROUTE_HOOK_AWAY_FROM_TARGET_MARGIN_METERS = 14;
const VIGILANTE_ROUTE_HOOK_MIN_REJOIN_GAP_METERS = 20;

const VIGILANTE_ROUTE_REVISIT_PROXIMITY_METERS = 30;
const VIGILANTE_ROUTE_REVISIT_MIN_SKIPPED_POINTS = 2;
const VIGILANTE_ROUTE_REVISIT_MIN_SAVED_METERS = 50;
const VIGILANTE_ROUTE_REVISIT_SEARCH_AHEAD_POINTS = 20;

function dedupeAdjacentVigilantePath(path: LatLngTuple[]) {
	if (path.length <= 2) return path.slice();

	const result: LatLngTuple[] = [path[0]];

	for (let i = 1; i < path.length; i += 1) {
		const point = path[i];
		const last = result[result.length - 1];
		const isLastPoint = i === path.length - 1;

		if (
			distanceMeters(last, point) >=
			VIGILANTE_ROUTE_MIN_POINT_SPACING_METERS
		) {
			result.push(point);
			continue;
		}

		if (isLastPoint) {
			result[result.length - 1] = point;
		}
	}

	return result.length >= 2 ? result : path.slice();
}

function isLocalHairpin(a: LatLngTuple, b: LatLngTuple, c: LatLngTuple) {
	const ab = distanceMeters(a, b);
	const bc = distanceMeters(b, c);
	const ac = distanceMeters(a, c);

	if (ab < VIGILANTE_ROUTE_HAIRPIN_MIN_LEG_METERS) return false;
	if (bc < VIGILANTE_ROUTE_HAIRPIN_MIN_LEG_METERS) return false;
	if (ac > VIGILANTE_ROUTE_HAIRPIN_RETURN_PROXIMITY_METERS) return false;

	const cos = cosineBetweenSegments(a, b, c);
	return cos <= VIGILANTE_ROUTE_HAIRPIN_COS_THRESHOLD;
}

function collapseVigilanteHairpins(path: LatLngTuple[]) {
	if (path.length < 3) return path.slice();

	const stack: LatLngTuple[] = [];

	for (const point of path) {
		stack.push(point);

		let changed = true;

		while (changed && stack.length >= 3) {
			changed = false;

			const c = stack[stack.length - 1];
			const b = stack[stack.length - 2];
			const a = stack[stack.length - 3];

			if (isLocalHairpin(a, b, c)) {
				stack.splice(stack.length - 2, 1);
				changed = true;
			}
		}
	}

	return stack.length >= 2 ? stack : path.slice();
}

function getSubPathDistance(
	path: LatLngTuple[],
	startIndex: number,
	endIndex: number,
) {
	let total = 0;

	for (let i = startIndex; i < endIndex; i += 1) {
		total += distanceMeters(path[i], path[i + 1]);
	}

	return total;
}

function collapseVigilanteNearbyRevisits(path: LatLngTuple[]) {
	if (path.length < 4) return path.slice();

	let next = path.slice();
	let changed = true;

	while (changed) {
		changed = false;

		outer: for (let i = 0; i < next.length - 3; i += 1) {
			const maxJ = Math.min(
				next.length - 1,
				i + VIGILANTE_ROUTE_REVISIT_SEARCH_AHEAD_POINTS,
			);

			for (
				let j = i + VIGILANTE_ROUTE_REVISIT_MIN_SKIPPED_POINTS + 1;
				j <= maxJ;
				j += 1
			) {
				const revisitDistance = distanceMeters(next[i], next[j]);

				if (
					revisitDistance > VIGILANTE_ROUTE_REVISIT_PROXIMITY_METERS
				) {
					continue;
				}

				const skippedDistance = getSubPathDistance(next, i, j);
				const savedDistance = skippedDistance - revisitDistance;

				if (savedDistance < VIGILANTE_ROUTE_REVISIT_MIN_SAVED_METERS) {
					continue;
				}

				next = [...next.slice(0, i + 1), ...next.slice(j)];
				changed = true;
				break outer;
			}
		}
	}

	return next.length >= 2 ? next : path.slice();
}

function ensureVigilanteEndpoints(
	path: LatLngTuple[],
	start: LatLngTuple,
	end: LatLngTuple,
) {
	const result = path.slice();

	if (result.length === 0) {
		return [start, end];
	}

	if (distanceMeters(result[0], start) > 1) {
		result.unshift(start);
	} else {
		result[0] = start;
	}

	if (distanceMeters(result[result.length - 1], end) > 1) {
		result.push(end);
	} else {
		result[result.length - 1] = end;
	}

	return result.length >= 2 ? result : [start, end];
}

function hasEarlyReturnHook(
	path: LatLngTuple[],
	start: LatLngTuple,
	end: LatLngTuple,
) {
	const crowDistance = distanceMeters(start, end);
	if (crowDistance > VIGILANTE_ROUTE_DIRECT_SHORTCUT_MAX_DISTANCE_METERS) {
		return false;
	}

	const startToEndDistance = distanceMeters(start, end);
	const lookaheadEnd = Math.min(
		path.length - 1,
		VIGILANTE_ROUTE_HOOK_LOOKAHEAD_POINTS,
	);

	for (let i = 1; i < lookaheadEnd; i += 1) {
		const detourPoint = path[i];
		const detourFromStart = distanceMeters(start, detourPoint);
		const detourToEnd = distanceMeters(detourPoint, end);

		if (detourFromStart < VIGILANTE_ROUTE_HOOK_DETOUR_MIN_METERS) {
			continue;
		}

		if (
			detourToEnd <
			startToEndDistance +
				VIGILANTE_ROUTE_HOOK_AWAY_FROM_TARGET_MARGIN_METERS
		) {
			continue;
		}

		for (let j = i + 1; j <= lookaheadEnd; j += 1) {
			const returnPoint = path[j];
			const returnToStart = distanceMeters(start, returnPoint);
			const gap = distanceMeters(detourPoint, returnPoint);
			const stillNeedsTravel = distanceMeters(returnPoint, end);

			if (
				returnToStart <= VIGILANTE_ROUTE_HOOK_RETURN_TO_START_METERS &&
				gap >= VIGILANTE_ROUTE_HOOK_MIN_REJOIN_GAP_METERS &&
				stillNeedsTravel > 8
			) {
				return true;
			}
		}
	}

	return false;
}

function maybeShortcutVigilanteRoute(
	path: LatLngTuple[],
	start: LatLngTuple,
	end: LatLngTuple,
) {
	const crowDistance = distanceMeters(start, end);
	if (crowDistance <= 0) return path;

	const routeDistance = getPathDistanceMeters(path);
	const ratio = routeDistance / crowDistance;

	if (hasEarlyReturnHook(path, start, end)) {
		return [start, end];
	}

	if (
		crowDistance <= VIGILANTE_ROUTE_DIRECT_SHORTCUT_MAX_DISTANCE_METERS &&
		ratio >= VIGILANTE_ROUTE_DIRECT_SHORTCUT_RATIO_THRESHOLD
	) {
		return [start, end];
	}

	return path;
}

function optimizeVigilanteRoutePath(
	rawPath: LatLngTuple[],
	start: LatLngTuple,
	end: LatLngTuple,
) {
	let path = rawPath.length >= 2 ? rawPath.slice() : [start, end];
	path = ensureVigilanteEndpoints(path, start, end);
	path = dedupeAdjacentVigilantePath(path);

	for (let i = 0; i < 4; i += 1) {
		const collapsedHairpins = collapseVigilanteHairpins(path);
		const collapsedRevisits =
			collapseVigilanteNearbyRevisits(collapsedHairpins);
		const deduped = dedupeAdjacentVigilantePath(collapsedRevisits);

		if (deduped.length === path.length) {
			path = deduped;
			break;
		}

		path = deduped;
	}

	path = ensureVigilanteEndpoints(path, start, end);
	path = maybeShortcutVigilanteRoute(path, start, end);
	path = ensureVigilanteEndpoints(path, start, end);

	return path.length >= 2 ? path : [start, end];
}

function cosineBetweenSegments(a: LatLngTuple, b: LatLngTuple, c: LatLngTuple) {
	const v1 = meterVector(a, b);
	const v2 = meterVector(b, c);

	const mag1 = Math.hypot(v1.x, v1.y);
	const mag2 = Math.hypot(v2.x, v2.y);

	if (mag1 === 0 || mag2 === 0) return 1;

	return (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2);
}

function meterVector(from: LatLngTuple, to: LatLngTuple) {
	const avgLatRad = (((from[0] + to[0]) / 2) * Math.PI) / 180;
	const metersPerLat = 111_320;
	const metersPerLng = 111_320 * Math.cos(avgLatRad);

	return {
		x: (to[1] - from[1]) * metersPerLng,
		y: (to[0] - from[0]) * metersPerLat,
	};
}

export default function VigilanteSystem({
	incidents,
	ownedVigilanteSheets,
	ownedVigilanteIds,
	onVigilanteRenderUpdate,
	onVigilanteEtaUpdate,
	onVigilanteResolveIncident,
	paused = false,
	timerSlowdownMultiplier = 1,
	getBaseLocation,
}: Props) {
	const [units, setUnits] = useState<VigilanteUnit[]>([]);
	const [renderNow, setRenderNow] = useState(Date.now());

	const unitsRef = useRef<VigilanteUnit[]>([]);
	const incidentsRef = useRef<VigilanteIncident[]>(incidents);

	const pausedRef = useRef(paused);
	pausedRef.current = paused;

	const timerSlowdownRef = useRef(timerSlowdownMultiplier);
	timerSlowdownRef.current = timerSlowdownMultiplier;

	const pendingResponseUnitIdsRef = useRef<Set<string>>(new Set());
	const pendingIncidentIdsRef = useRef<Set<string>>(new Set());
	const pendingRejoinUnitIdsRef = useRef<Set<string>>(new Set());
	// Changed: track incidents in resolution phase instead of resolved
	const incidentsInResolutionRef = useRef<Set<string>>(new Set());

	const patrolLoopsRef = useRef<Record<string, LatLngTuple[]>>({});

	const getBaseLocationRef = useRef(getBaseLocation);
	getBaseLocationRef.current = getBaseLocation;
	const prevSheetsIdsRef = useRef<string[]>([]);

	useEffect(() => {
		unitsRef.current = units;
	}, [units]);

	useEffect(() => {
		incidentsRef.current = incidents;
	}, [incidents]);

	// Get patrol zone based on vigilante index
	const getPatrolZone = (index: number): string => {
		const zones = Object.keys(VIGILANTE_PATROL_ANCHORS);
		return zones[index % zones.length];
	};

	// Build vigilante unit config from sheet data
	const buildVigilanteConfig = (
		sheet: (typeof ownedVigilanteSheets)[0],
		index: number,
	) => {
		const speedStat = sheet.stats?.speed ?? 3;
		// Scale patrol speed based on speed stat (1-5 scale)
		const patrolMps = DEFAULT_PATROL_MPS * (0.7 + speedStat * 0.2);
		const responseMps = DEFAULT_RESPONSE_MPS * (0.7 + speedStat * 0.2);
		const rejoinMps = DEFAULT_REJOIN_MPS * (0.7 + speedStat * 0.2);

		return {
			pinId: sheet.id,
			displayName: sheet.alias || sheet.name,
			initial: sheet.name[0]?.toUpperCase() ?? "V",
			portrait: sheet.portrait,
			patrolRouteId: getPatrolZone(index),
			speeds: {
				patrolMps,
				responseMps,
				rejoinMps,
			},
			holdMs: DEFAULT_HOLD_MS,
		};
	};

	useEffect(() => {
		// Avoid re-initialization if sheets haven't actually changed (by ID)
		const currentIds = ownedVigilanteSheets.map((s) => s.id);
		const prevIds = prevSheetsIdsRef.current;
		if (
			prevIds.length > 0 &&
			currentIds.length === prevIds.length &&
			currentIds.every((id, i) => id === prevIds[i])
		) {
			return;
		}
		prevSheetsIdsRef.current = currentIds;

		const ts = Date.now();

		const initialUnits: VigilanteUnit[] = ownedVigilanteSheets.map(
			(sheet, index) => {
				const config = buildVigilanteConfig(sheet, index);
				const patrolRouteId = config.patrolRouteId;
				const initialLoop = ensureClosedLoop(
					VIGILANTE_PATROL_ANCHORS[patrolRouteId] ??
						VIGILANTE_PATROL_ANCHORS.default,
				);

				// Pre-populate patrol loops cache
				patrolLoopsRef.current[patrolRouteId] = initialLoop;

				return switchUnitToPath({
					unit: {
						pinId: config.pinId,
						displayName: config.displayName,
						initial: config.initial,
						portrait: config.portrait,
						patrolRouteId: config.patrolRouteId,
						speeds: config.speeds,
						holdMs: config.holdMs,
						mode: "patrolling",
						path: initialLoop,
						segmentIndex: 0,
						segmentStartedAt: ts,
						segmentDurationMs: 1000,
						assignedIncidentId: null,
						isLooping: true,
						nextLoopPath: null,
						holdUntilTs: null,
						cooldownUntilTs: null,
						responseOverrideMps: null,
					},
					path: initialLoop,
					mode: "patrolling",
					isLooping: true,
					nextLoopPath: null,
					assignedIncidentId: null,
					holdUntilTs: null,
					now: ts,
				});
			},
		);

		unitsRef.current = initialUnits;
		setUnits(initialUnits);

		// Build patrol paths asynchronously
		for (let index = 0; index < ownedVigilanteSheets.length; index += 1) {
			const sheet = ownedVigilanteSheets[index];
			const config = buildVigilanteConfig(sheet, index);
			const routeId = config.patrolRouteId;

			void (async () => {
				try {
					const def = {
						id: routeId,
						label: `Vigilante Patrol ${routeId}`,
						anchors:
							VIGILANTE_PATROL_ANCHORS[routeId] ??
							VIGILANTE_PATROL_ANCHORS.default,
					};

					const built = await getPatrolLoopPath(def);

					if (built.length < 2) return;

					patrolLoopsRef.current[routeId] = ensureClosedLoop(built);

					setUnits((prev) => {
						const idx = prev.findIndex(
							(unit) => unit.pinId === sheet.id,
						);
						if (idx === -1) return prev;

						const target = prev[idx];
						if (target.mode !== "patrolling") return prev;

						const next = [...prev];
						next[idx] = switchUnitToPath({
							unit: target,
							path: patrolLoopsRef.current[routeId],
							mode: "patrolling",
							isLooping: true,
							nextLoopPath: null,
							assignedIncidentId: null,
							holdUntilTs: null,
							now: Date.now(),
						});

						unitsRef.current = next;
						return next;
					});
				} catch (error) {
					console.warn(
						"Failed to build vigilante patrol loop:",
						error,
					);
				}
			})();
		}
	}, [ownedVigilanteSheets]);

	useEffect(() => {
		const id = window.setInterval(() => {
			if (pausedRef.current) return;
			setRenderNow(Date.now());
		}, RENDER_TICK_MS);

		return () => window.clearInterval(id);
	}, []);

	function getPatrolLoop(unit: VigilanteUnit) {
		return (
			patrolLoopsRef.current[unit.patrolRouteId] ??
			ensureClosedLoop(VIGILANTE_PATROL_ANCHORS.default)
		);
	}

	function startResponseJob(
		unit: VigilanteUnit,
		incident: VigilanteIncident,
	) {
		if (pendingResponseUnitIdsRef.current.has(unit.pinId)) return;
		if (pendingIncidentIdsRef.current.has(incident.id)) return;

		pendingResponseUnitIdsRef.current.add(unit.pinId);
		pendingIncidentIdsRef.current.add(incident.id);

		const currentPos = getUnitPosition(unit, Date.now());
		const incidentPoint: LatLngTuple = [incident.lat, incident.lng];

		void (async () => {
			try {
				const route = await computeLeafletRoute(
					{ lat: currentPos[0], lng: currentPos[1] },
					{ lat: incident.lat, lng: incident.lng },
				);

				const finalPath = optimizeVigilanteRoutePath(
					route,
					currentPos,
					incidentPoint,
				);

				setUnits((prev) => {
					const idx = prev.findIndex((x) => x.pinId === unit.pinId);
					if (idx === -1) return prev;

					const now = Date.now();

					const currentUnit = prev[idx];

					if (
						currentUnit.assignedIncidentId &&
						currentUnit.assignedIncidentId !== incident.id
					) {
						return prev;
					}

					const pathMeters = getPathDistanceMeters(finalPath);
					const remainingMs = Math.max(incident.expiresAt - now, 0);
					const arrivalBufferMs = 2000; // Buffer before expiry
					const targetTravelMs = Math.max(
						remainingMs - arrivalBufferMs,
						1000, // Minimum 1 second travel time for visibility
					);

					const desiredResponseMps =
						pathMeters > 0
							? pathMeters / (targetTravelMs / 1000)
							: 0;

					const baseResponseMps = currentUnit.speeds.responseMps;
					const tunedResponseMps =
						desiredResponseMps > 0
							? Math.max(
									baseResponseMps * 0.75,
									Math.min(
										baseResponseMps * 4,
										desiredResponseMps,
									),
								)
							: baseResponseMps;

					const next = [...prev];

					next[idx] = switchUnitToPath({
						unit: {
							...currentUnit,
							responseOverrideMps: tunedResponseMps,
						},
						path: finalPath,
						mode: "responding",
						isLooping: false,
						nextLoopPath: null,
						assignedIncidentId: incident.id,
						holdUntilTs: null,
						now,
					});

					unitsRef.current = next;
					return next;
				});
			} catch (error) {
				console.warn("Vigilante response route failed:", error);
			} finally {
				pendingResponseUnitIdsRef.current.delete(unit.pinId);
				pendingIncidentIdsRef.current.delete(incident.id);
			}
		})();
	}

	function startRejoinJob(unit: VigilanteUnit) {
		if (pendingRejoinUnitIdsRef.current.has(unit.pinId)) return;

		pendingRejoinUnitIdsRef.current.add(unit.pinId);

		const currentPos = getUnitPosition(unit, Date.now());
		const patrolLoop = getPatrolLoop(unit);

		void (async () => {
			try {
				// Build rejoin path similar to police version
				const safeLoop = ensureClosedLoop(patrolLoop);
				const nearestIndex = findNearestPointIndex(
					safeLoop,
					currentPos,
				);
				const rotatedLoop = rotateClosedLoop(safeLoop, nearestIndex);
				const patrolEntry = rotatedLoop[0] ?? currentPos;

				const connectorPath = await computeLeafletRoute(
					{ lat: currentPos[0], lng: currentPos[1] },
					{ lat: patrolEntry[0], lng: patrolEntry[1] },
				);

				const optimizedConnector = optimizeVigilanteRoutePath(
					connectorPath,
					currentPos,
					patrolEntry,
				);

				const loopPath =
					rotatedLoop.length >= 2 ? rotatedLoop : patrolLoop;

				setUnits((prev) => {
					const idx = prev.findIndex((x) => x.pinId === unit.pinId);
					if (idx === -1) return prev;

					const currentUnit = prev[idx];
					const next = [...prev];

					next[idx] = switchUnitToPath({
						unit: currentUnit,
						path: optimizedConnector,
						mode: "rejoining",
						isLooping: false,
						nextLoopPath: loopPath,
						assignedIncidentId: null,
						holdUntilTs: null,
						now: Date.now(),
					});

					unitsRef.current = next;
					return next;
				});
			} catch (error) {
				console.warn("Vigilante rejoin route failed:", error);
			} finally {
				pendingRejoinUnitIdsRef.current.delete(unit.pinId);
			}
		})();
	}

	useEffect(() => {
		const id = window.setInterval(() => {
			if (pausedRef.current) return;
			const now = Date.now();

			setUnits((prev) => {
				let changed = false;

				const next = prev.map((unit) => {
					if (unit.assignedIncidentId) {
						// Check if incident still exists and is active
						const stillExists = incidentsRef.current.some(
							(incident) =>
								incident.id === unit.assignedIncidentId &&
								incident.status === "active" &&
								now < incident.expiresAt,
						);

						if (!stillExists && unit.mode !== "rejoining") {
							const currentPos = getUnitPosition(unit, now);

							const placeholderBase = switchUnitToPath({
								unit,
								path: [currentPos, currentPos],
								mode: "rejoining",
								isLooping: false,
								nextLoopPath: getPatrolLoop(unit),
								assignedIncidentId: null,
								holdUntilTs: null,
								now,
							});

							const placeholder = {
								...placeholderBase,
								cooldownUntilTs: now + REASSIGN_COOLDOWN_MS,
							};

							changed = true;
							startRejoinJob(placeholder);
							return placeholder;
						}
					}

					if (unit.mode === "holding") {
						if ((unit.holdUntilTs ?? 0) <= now) {
							// CHANGED: Mark incident as being in resolution phase
							// instead of calling onVigilanteResolveIncident immediately
							const resolvedIncidentId = unit.assignedIncidentId;
							if (resolvedIncidentId) {
								incidentsInResolutionRef.current.add(
									resolvedIncidentId,
								);
							}

							const currentPos = getUnitPosition(unit, now);

							const placeholderBase = switchUnitToPath({
								unit,
								path: [currentPos, currentPos],
								mode: "rejoining",
								isLooping: false,
								nextLoopPath: getPatrolLoop(unit),
								assignedIncidentId: null,
								holdUntilTs: null,
								now,
							});

							const placeholder = {
								...placeholderBase,
								cooldownUntilTs: now + REASSIGN_COOLDOWN_MS,
							};

							changed = true;
							startRejoinJob(placeholder);
							return placeholder;
						}
						return unit;
					}

					const { nextUnit, pathFinished } = advanceUnit(unit, now);

					if (!pathFinished) {
						if (
							nextUnit.segmentIndex !== unit.segmentIndex ||
							nextUnit.segmentStartedAt !== unit.segmentStartedAt
						) {
							changed = true;
						}
						return nextUnit;
					}

					if (unit.mode === "responding") {
						const arrivedAt = getUnitPosition(nextUnit, now);

						changed = true;
						return switchUnitToPath({
							unit: nextUnit,
							path: [arrivedAt],
							mode: "holding",
							isLooping: false,
							nextLoopPath: getPatrolLoop(nextUnit),
							assignedIncidentId: unit.assignedIncidentId, // Keep assignment during holding
							holdUntilTs: now + unit.holdMs,
							now,
						});
					}

					if (unit.mode === "rejoining") {
						const loopPath =
							unit.nextLoopPath ?? getPatrolLoop(unit);
						changed = true;

						const patrollingUnit = switchUnitToPath({
							unit: nextUnit,
							path: loopPath,
							mode: "patrolling",
							isLooping: true,
							nextLoopPath: null,
							assignedIncidentId: null,
							holdUntilTs: null,
							now,
						});

						return {
							...patrollingUnit,
							cooldownUntilTs: now + REASSIGN_COOLDOWN_MS,
						};
					}

					if (unit.isLooping) {
						changed = true;
						return restartLoop(nextUnit, now);
					}

					return nextUnit;
				});

				if (changed) {
					unitsRef.current = next;
					return next;
				}

				return prev;
			});
		}, TICK_MS);

		return () => window.clearInterval(id);
	}, []);

	// Auto-assign vigilantes to incidents when they are deployed
	useEffect(() => {
		if (paused) return;
		const now = Date.now();
		const liveUnits = unitsRef.current;
		if (liveUnits.length === 0) return;

		const activeIncidents = incidents.filter(
			(incident) =>
				incident.status === "active" && now < incident.expiresAt,
		);
		if (activeIncidents.length === 0) return;

		// Find incidents that have deployed vigilantes but not yet assigned
		const incidentsWithDeployedVigilantes = activeIncidents.filter(
			(incident) => {
				const deployed = incident.deployedVigilanteIds ?? [];
				return deployed.length > 0;
			},
		);

		if (incidentsWithDeployedVigilantes.length === 0) return;

		const alreadyAssignedIncidentIds = new Set(
			liveUnits
				.map((unit) => unit.assignedIncidentId)
				.filter((id): id is string => !!id),
		);

		const availableUnits = liveUnits.filter(
			(unit) =>
				!unit.assignedIncidentId &&
				(unit.mode === "patrolling" || unit.mode === "rejoining") &&
				(!unit.cooldownUntilTs || now >= unit.cooldownUntilTs) &&
				!pendingResponseUnitIdsRef.current.has(unit.pinId),
		);

		if (availableUnits.length === 0) return;

		// For each incident, assign its deployed vigilantes to nearest available units
		for (const incident of incidentsWithDeployedVigilantes) {
			if (alreadyAssignedIncidentIds.has(incident.id)) continue;

			const deployedIds = incident.deployedVigilanteIds ?? [];
			if (deployedIds.length === 0) continue;

			// Find the nearest available vigilante from the deployed set
			let bestUnit: VigilanteUnit | null = null;
			let bestDistance = Infinity;

			for (const unit of availableUnits) {
				if (!deployedIds.includes(unit.pinId)) continue;

				const unitPos = getUnitPosition(unit, now);
				const d = distanceMeters(unitPos, [incident.lat, incident.lng]);

				if (d < bestDistance && d <= RESPONSE_RADIUS_METERS) {
					bestUnit = unit;
					bestDistance = d;
				}
			}

			if (bestUnit) {
				startResponseJob(bestUnit, incident);
				alreadyAssignedIncidentIds.add(incident.id);
				const idx = availableUnits.indexOf(bestUnit);
				if (idx > -1) availableUnits.splice(idx, 1);
			}
		}
	}, [incidents, units, paused]);

	const renderItems = useMemo<VigilanteRenderItem[]>(() => {
		const now = renderNow;

		return units.map((unit) => {
			const pos = getUnitPosition(unit, now);

			return {
				pinId: unit.pinId,
				name: unit.displayName,
				initial: unit.initial,
				portrait: unit.portrait,
				lat: pos[0],
				lng: pos[1],
				mode: unit.mode,
				visiblePath:
					unit.mode === "responding"
						? getRemainingVisiblePath(unit, now)
						: [],
				assignedIncidentId: unit.assignedIncidentId,
			};
		});
	}, [units, renderNow]);

	const etaItems = useMemo<VigilanteEtaItem[]>(() => {
		const now = renderNow;

		return units
			.filter((unit) => unit.assignedIncidentId)
			.map((unit) => ({
				unitId: unit.pinId,
				name: unit.displayName,
				incidentId: unit.assignedIncidentId as string,
				etaMs:
					unit.mode === "responding"
						? getRemainingEtaMs(unit, now)
						: 0,
			}))
			.filter((item) => item.etaMs >= 0);
	}, [units, renderNow]);

	useEffect(() => {
		onVigilanteRenderUpdate?.(renderItems);
	}, [renderItems, onVigilanteRenderUpdate]);

	useEffect(() => {
		onVigilanteEtaUpdate?.(etaItems);
	}, [etaItems, onVigilanteEtaUpdate]);

	// CHANGED: Notify parent when incidents complete resolution
	// This is called from the main component's effect that watches for incidents
	// moving from "resolving" to "resolved" status
	useEffect(() => {
		if (!onVigilanteResolveIncident) return;
		if (incidentsInResolutionRef.current.size === 0) return;

		const resolvingIds = Array.from(incidentsInResolutionRef.current);
		incidentsInResolutionRef.current.clear();

		for (const incidentId of resolvingIds) {
			onVigilanteResolveIncident(incidentId);
		}
	}, [units, onVigilanteResolveIncident]);

	const responseLines = useMemo(() => {
		return units
			.filter((unit) => unit.mode === "responding")
			.map((unit) => ({
				id: unit.pinId,
				path: getRemainingVisiblePath(unit, renderNow),
			}))
			.filter((item) => item.path.length >= 2);
	}, [units, renderNow]);

	return (
		<>
			{responseLines.map((line) => (
				<Polyline
					key={line.id}
					positions={line.path}
					interactive={false}
					pathOptions={{
						color: "#ef4444",
						weight: 5,
						opacity: 0.95,
					}}
				/>
			))}
		</>
	);
}
