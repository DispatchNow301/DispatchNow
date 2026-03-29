"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Polyline } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import type {
	PoliceCharacterConfig,
	PoliceEtaItem,
	PoliceIncident,
	PoliceRenderItem,
	PoliceUnit,
} from "./policeTypes";
import {
	PATROL_ROUTE_DEFS,
	buildRejoinPatrolPaths,
	computeLeafletRoute,
	getPatrolLoopPath,
} from "./googleRoutes";
import {
	advanceUnit,
	distanceMeters,
	ensureClosedLoop,
	getPathDistanceMeters,
	getRemainingEtaMs,
	getRemainingVisiblePath,
	getUnitPosition,
	restartLoop,
	switchUnitToPath,
} from "./policeUtils";

type Props = {
	incidents: PoliceIncident[];
	onPoliceRenderUpdate?: (items: PoliceRenderItem[]) => void;
	onPoliceEtaUpdate?: (items: PoliceEtaItem[]) => void;
	onPoliceResolveIncident?: (incidentId: string) => void;
	paused?: boolean;
	timerSlowdownMultiplier?: number;
};

const RESPONSE_RADIUS_METERS = 3200;
const TICK_MS = 60;
const RENDER_TICK_MS = 1000 / 30;
const REASSIGN_COOLDOWN_MS = 1000;
const TARGET_PRE_EXPIRY_ARRIVAL_MS = 5000;
const RESPONSE_SPEED_MIN_MULTIPLIER = 0.75;
const RESPONSE_SPEED_MAX_MULTIPLIER = 10;

const POLICE_ROUTE_MIN_POINT_SPACING_METERS = 8;
const POLICE_ROUTE_HAIRPIN_RETURN_PROXIMITY_METERS = 40;
const POLICE_ROUTE_HAIRPIN_MIN_LEG_METERS = 40;
const POLICE_ROUTE_HAIRPIN_COS_THRESHOLD = -0.2;
const POLICE_ROUTE_DIRECT_SHORTCUT_MAX_DISTANCE_METERS = 420;
const POLICE_ROUTE_DIRECT_SHORTCUT_RATIO_THRESHOLD = 1.35;
const POLICE_ROUTE_HOOK_LOOKAHEAD_POINTS = 10;
const POLICE_ROUTE_HOOK_DETOUR_MIN_METERS = 30;
const POLICE_ROUTE_HOOK_RETURN_TO_START_METERS = 42;
const POLICE_ROUTE_HOOK_AWAY_FROM_TARGET_MARGIN_METERS = 14;
const POLICE_ROUTE_HOOK_MIN_REJOIN_GAP_METERS = 20;

/* Detect non-adjacent points that come back near each other, then remove the
   detour section between them. */
const POLICE_ROUTE_REVISIT_PROXIMITY_METERS = 30;
const POLICE_ROUTE_REVISIT_MIN_SKIPPED_POINTS = 2;
const POLICE_ROUTE_REVISIT_MIN_SAVED_METERS = 50;
const POLICE_ROUTE_REVISIT_SEARCH_AHEAD_POINTS = 20;

const LOCAL_PATROL_ANCHORS = {
	diaz: [
		[40.7129, -73.9998],
		[40.7147, -74.0012],
		[40.7137, -74.0046],
		[40.7112, -74.0031],
	] as LatLngTuple[],
	kim: [
		[40.7166, -74.01],
		[40.7188, -74.0108],
		[40.7196, -74.0076],
		[40.7169, -74.0068],
	] as LatLngTuple[],
	chief: [
		[40.7095, -74.0069],
		[40.7114, -74.0088],
		[40.7105, -74.0113],
		[40.7079, -74.0101],
	] as LatLngTuple[],
};

const POLICE_CHARACTERS: PoliceCharacterConfig[] = [
	{
		pinId: "cop-diaz",
		displayName: "Officer Diaz",
		initial: "D",
		patrolRouteId: "diaz",
		anchors: LOCAL_PATROL_ANCHORS.diaz,
		speeds: {
			patrolMps: 7.0,
			responseMps: 15.5,
			rejoinMps: 10.5,
		},
		holdMs: 4500,
	},
	{
		pinId: "cop-kim",
		displayName: "Detective Kim",
		initial: "K",
		patrolRouteId: "kim",
		anchors: LOCAL_PATROL_ANCHORS.kim,
		speeds: {
			patrolMps: 7.8,
			responseMps: 17.0,
			rejoinMps: 11.8,
		},
		holdMs: 5000,
	},
	{
		pinId: "chief-williams",
		displayName: "Chief Williams",
		initial: "C",
		patrolRouteId: "chief",
		anchors: LOCAL_PATROL_ANCHORS.chief,
		speeds: {
			patrolMps: 8.6,
			responseMps: 18.8,
			rejoinMps: 13.0,
		},
		holdMs: 5500,
	},
];

const CONFIG_BY_ID = new Map(
	POLICE_CHARACTERS.map((config) => [config.pinId, config]),
);

function getConfigById(pinId: PoliceUnit["pinId"]) {
	return CONFIG_BY_ID.get(pinId) ?? POLICE_CHARACTERS[0];
}

function getRouteDef(routeId: "diaz" | "kim" | "chief") {
	if (PATROL_ROUTE_DEFS && PATROL_ROUTE_DEFS[routeId]) {
		return PATROL_ROUTE_DEFS[routeId];
	}

	return {
		id: routeId,
		label:
			routeId === "diaz"
				? "Officer Diaz Patrol"
				: routeId === "kim"
					? "Detective Kim Patrol"
					: "Chief Williams Patrol",
		anchors: LOCAL_PATROL_ANCHORS[routeId],
	};
}

function getAdjustedExpiresAt(incident: PoliceIncident, slowdown: number): number {
    if (slowdown >= 1) return incident.expiresAt;  // ← flip > to 
    const duration = incident.expiresAt - incident.createdAt;
    return incident.createdAt + duration / slowdown;
}

function isActiveIncident(incident: PoliceIncident, now: number, slowdown = 1) {
	return incident.status === "active" && now < getAdjustedExpiresAt(incident, slowdown);
}

function getResponseArrivalBufferMs(remainingMs: number) {
	if (remainingMs <= 6000) return 600;
	if (remainingMs <= 10000) return 1000;
	if (remainingMs <= 16000) return 1600;
	if (remainingMs <= 24000) return 2200;
	return TARGET_PRE_EXPIRY_ARRIVAL_MS;
}

function getUrgencyBoost(remainingMs: number) {
	if (remainingMs <= 8000) return 1.2;
	if (remainingMs <= 14000) return 1.1;
	return 1;
}

function getDispatchEstimate(
	distance: number,
	unit: PoliceUnit,
	incident: PoliceIncident,
	now: number,
	slowdown = 1,
) {
	const timeLeftMs = Math.max(getAdjustedExpiresAt(incident, slowdown) - now, 0);
	const urgencyBoost = getUrgencyBoost(timeLeftMs);
	const maxResponseMps =
		unit.speeds.responseMps *
		RESPONSE_SPEED_MAX_MULTIPLIER *
		urgencyBoost;
	const estimatedTravelMs =
		(distance / Math.max(maxResponseMps, 0.1)) * 1000;
	const slackMs = timeLeftMs - estimatedTravelMs;

	return {
		timeLeftMs,
		estimatedTravelMs,
		slackMs,
	};
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

function cosineBetweenSegments(
	a: LatLngTuple,
	b: LatLngTuple,
	c: LatLngTuple,
) {
	const v1 = meterVector(a, b);
	const v2 = meterVector(b, c);

	const mag1 = Math.hypot(v1.x, v1.y);
	const mag2 = Math.hypot(v2.x, v2.y);

	if (mag1 === 0 || mag2 === 0) return 1;

	return (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2);
}

function dedupeAdjacentPolicePath(path: LatLngTuple[]) {
	if (path.length <= 2) return path.slice();

	const result: LatLngTuple[] = [path[0]];

	for (let i = 1; i < path.length; i += 1) {
		const point = path[i];
		const last = result[result.length - 1];
		const isLastPoint = i === path.length - 1;

		if (
			distanceMeters(last, point) >= POLICE_ROUTE_MIN_POINT_SPACING_METERS
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

function isLocalHairpin(
	a: LatLngTuple,
	b: LatLngTuple,
	c: LatLngTuple,
) {
	const ab = distanceMeters(a, b);
	const bc = distanceMeters(b, c);
	const ac = distanceMeters(a, c);

	if (ab < POLICE_ROUTE_HAIRPIN_MIN_LEG_METERS) return false;
	if (bc < POLICE_ROUTE_HAIRPIN_MIN_LEG_METERS) return false;
	if (ac > POLICE_ROUTE_HAIRPIN_RETURN_PROXIMITY_METERS) return false;

	const cos = cosineBetweenSegments(a, b, c);
	return cos <= POLICE_ROUTE_HAIRPIN_COS_THRESHOLD;
}

function collapsePoliceHairpins(path: LatLngTuple[]) {
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

function collapsePoliceNearbyRevisits(path: LatLngTuple[]) {
	if (path.length < 4) return path.slice();

	let next = path.slice();
	let changed = true;

	while (changed) {
		changed = false;

		outer: for (let i = 0; i < next.length - 3; i += 1) {
			const maxJ = Math.min(
				next.length - 1,
				i + POLICE_ROUTE_REVISIT_SEARCH_AHEAD_POINTS,
			);

			for (
				let j = i + POLICE_ROUTE_REVISIT_MIN_SKIPPED_POINTS + 1;
				j <= maxJ;
				j += 1
			) {
				const revisitDistance = distanceMeters(next[i], next[j]);

				if (
					revisitDistance >
					POLICE_ROUTE_REVISIT_PROXIMITY_METERS
				) {
					continue;
				}

				const skippedDistance = getSubPathDistance(next, i, j);
				const savedDistance = skippedDistance - revisitDistance;

				if (savedDistance < POLICE_ROUTE_REVISIT_MIN_SAVED_METERS) {
					continue;
				}

				next = [
					...next.slice(0, i + 1),
					...next.slice(j),
				];
				changed = true;
				break outer;
			}
		}
	}

	return next.length >= 2 ? next : path.slice();
}

function ensurePoliceEndpoints(
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
	if (crowDistance > POLICE_ROUTE_DIRECT_SHORTCUT_MAX_DISTANCE_METERS) {
		return false;
	}

	const startToEndDistance = distanceMeters(start, end);
	const lookaheadEnd = Math.min(
		path.length - 1,
		POLICE_ROUTE_HOOK_LOOKAHEAD_POINTS,
	);

	for (let i = 1; i < lookaheadEnd; i += 1) {
		const detourPoint = path[i];
		const detourFromStart = distanceMeters(start, detourPoint);
		const detourToEnd = distanceMeters(detourPoint, end);

		if (detourFromStart < POLICE_ROUTE_HOOK_DETOUR_MIN_METERS) {
			continue;
		}

		if (
			detourToEnd <
			startToEndDistance + POLICE_ROUTE_HOOK_AWAY_FROM_TARGET_MARGIN_METERS
		) {
			continue;
		}

		for (let j = i + 1; j <= lookaheadEnd; j += 1) {
			const returnPoint = path[j];
			const returnToStart = distanceMeters(start, returnPoint);
			const gap = distanceMeters(detourPoint, returnPoint);
			const stillNeedsTravel = distanceMeters(returnPoint, end);

			if (
				returnToStart <= POLICE_ROUTE_HOOK_RETURN_TO_START_METERS &&
				gap >= POLICE_ROUTE_HOOK_MIN_REJOIN_GAP_METERS &&
				stillNeedsTravel > 8
			) {
				return true;
			}
		}
	}

	return false;
}

function maybeShortcutPoliceRoute(
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
		crowDistance <= POLICE_ROUTE_DIRECT_SHORTCUT_MAX_DISTANCE_METERS &&
		ratio >= POLICE_ROUTE_DIRECT_SHORTCUT_RATIO_THRESHOLD
	) {
		return [start, end];
	}

	return path;
}

function optimizePoliceRoutePath(
	rawPath: LatLngTuple[],
	start: LatLngTuple,
	end: LatLngTuple,
) {
	let path = rawPath.length >= 2 ? rawPath.slice() : [start, end];
	path = ensurePoliceEndpoints(path, start, end);
	path = dedupeAdjacentPolicePath(path);

	for (let i = 0; i < 4; i += 1) {
		const collapsedHairpins = collapsePoliceHairpins(path);
		const collapsedRevisits =
			collapsePoliceNearbyRevisits(collapsedHairpins);
		const deduped = dedupeAdjacentPolicePath(collapsedRevisits);

		if (deduped.length === path.length) {
			path = deduped;
			break;
		}

		path = deduped;
	}

	path = ensurePoliceEndpoints(path, start, end);
	path = maybeShortcutPoliceRoute(path, start, end);
	path = ensurePoliceEndpoints(path, start, end);

	return path.length >= 2 ? path : [start, end];
}

export default function PoliceSystem({
	incidents,
	onPoliceRenderUpdate,
	onPoliceEtaUpdate,
	onPoliceResolveIncident,
	paused = false,
	timerSlowdownMultiplier = 1,
}: Props) {
	const [units, setUnits] = useState<PoliceUnit[]>([]);
	const [renderNow, setRenderNow] = useState(Date.now());

	const unitsRef = useRef<PoliceUnit[]>([]);
	const incidentsRef = useRef<PoliceIncident[]>(incidents);

	const pausedRef = useRef(paused);
	pausedRef.current = paused;

	const timerSlowdownRef = useRef(timerSlowdownMultiplier);
    timerSlowdownRef.current = timerSlowdownMultiplier;

	const pendingResponseUnitIdsRef = useRef<Set<string>>(new Set());
	const pendingIncidentIdsRef = useRef<Set<string>>(new Set());
	const pendingRejoinUnitIdsRef = useRef<Set<string>>(new Set());
	const resolvedIncidentIdsRef = useRef<Set<string>>(new Set());

	const patrolLoopsRef = useRef<Record<string, LatLngTuple[]>>({
		diaz: ensureClosedLoop(LOCAL_PATROL_ANCHORS.diaz),
		kim: ensureClosedLoop(LOCAL_PATROL_ANCHORS.kim),
		chief: ensureClosedLoop(LOCAL_PATROL_ANCHORS.chief),
	});

	useEffect(() => {
		unitsRef.current = units;
	}, [units]);

	useEffect(() => {
		incidentsRef.current = incidents;
	}, [incidents]);

	useEffect(() => {
		const ts = Date.now();

		const initialUnits: PoliceUnit[] = POLICE_CHARACTERS.map((config) => {
			const patrolLoop = ensureClosedLoop(config.anchors);

			return switchUnitToPath({
				unit: {
					pinId: config.pinId,
					displayName: config.displayName,
					initial: config.initial,
					patrolRouteId: config.patrolRouteId,
					speeds: config.speeds,
					holdMs: config.holdMs,
					mode: "patrolling",
					path: patrolLoop,
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
				path: patrolLoop,
				mode: "patrolling",
				isLooping: true,
				nextLoopPath: null,
				assignedIncidentId: null,
				holdUntilTs: null,
				now: ts,
			});
		});

		unitsRef.current = initialUnits;
		setUnits(initialUnits);

		for (const config of POLICE_CHARACTERS) {
			void (async () => {
				try {
					const built = await getPatrolLoopPath(
						getRouteDef(config.patrolRouteId),
					);

					if (built.length < 2) return;

					patrolLoopsRef.current[config.patrolRouteId] =
						ensureClosedLoop(built);

					setUnits((prev) => {
						const idx = prev.findIndex(
							(unit) => unit.pinId === config.pinId,
						);
						if (idx === -1) return prev;

						const target = prev[idx];
						if (target.mode !== "patrolling") return prev;

						const next = [...prev];
						next[idx] = switchUnitToPath({
							unit: target,
							path: patrolLoopsRef.current[config.patrolRouteId],
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
					console.warn("Failed to build patrol loop:", error);
				}
			})();
		}
	}, []);

	useEffect(() => {
		const id = window.setInterval(() => {
			if (pausedRef.current) return;
			setRenderNow(Date.now());
		}, RENDER_TICK_MS);

		return () => window.clearInterval(id);
	}, []);

	function getPatrolLoop(unit: PoliceUnit) {
		return (
			patrolLoopsRef.current[unit.patrolRouteId] ??
			ensureClosedLoop(getConfigById(unit.pinId).anchors)
		);
	}

	function startResponseJob(unit: PoliceUnit, incident: PoliceIncident) {
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

				const finalPath = optimizePoliceRoutePath(
					route,
					currentPos,
					incidentPoint,
				);

				setUnits((prev) => {
					const idx = prev.findIndex((x) => x.pinId === unit.pinId);
					if (idx === -1) return prev;

					const now = Date.now();

					const latestIncident = incidentsRef.current.find(
						(x) => x.id === incident.id,
					);
					if (!latestIncident || !isActiveIncident(latestIncident, now, timerSlowdownRef.current)) {
						return prev;
					}

					const currentUnit = prev[idx];

					if (
						currentUnit.assignedIncidentId &&
						currentUnit.assignedIncidentId !== incident.id
					) {
						return prev;
					}

					const pathMeters = getPathDistanceMeters(finalPath);
					const remainingMs = Math.max(getAdjustedExpiresAt(latestIncident, timerSlowdownRef.current) - now, 0);
					const arrivalBufferMs = getResponseArrivalBufferMs(remainingMs);
					const targetTravelMs = Math.max(
						remainingMs - arrivalBufferMs,
						700,
					);

					const desiredResponseMps =
						pathMeters > 0 ? pathMeters / (targetTravelMs / 1000) : 0;

					const baseResponseMps = currentUnit.speeds.responseMps;
					const minResponseMps =
						baseResponseMps * RESPONSE_SPEED_MIN_MULTIPLIER;
					const urgencyBoost = getUrgencyBoost(remainingMs);
					const maxResponseMps =
						baseResponseMps *
						RESPONSE_SPEED_MAX_MULTIPLIER *
						urgencyBoost;

					const tunedResponseMps =
						desiredResponseMps > 0
							? Math.max(
								minResponseMps,
								Math.min(maxResponseMps, desiredResponseMps),
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
				console.warn("Police response route failed:", error);
			} finally {
				pendingResponseUnitIdsRef.current.delete(unit.pinId);
				pendingIncidentIdsRef.current.delete(incident.id);
			}
		})();
	}

	function startRejoinJob(unit: PoliceUnit) {
		if (pendingRejoinUnitIdsRef.current.has(unit.pinId)) return;

		pendingRejoinUnitIdsRef.current.add(unit.pinId);

		const currentPos = getUnitPosition(unit, Date.now());
		const patrolLoop = getPatrolLoop(unit);

		void (async () => {
			try {
				const built = await buildRejoinPatrolPaths(currentPos, patrolLoop);
				const patrolEntry = built.rotatedLoop[0] ?? currentPos;

				const connectorPath = optimizePoliceRoutePath(
					built.connectorPath,
					currentPos,
					patrolEntry,
				);

				const loopPath =
					built.rotatedLoop.length >= 2 ? built.rotatedLoop : patrolLoop;

				setUnits((prev) => {
					const idx = prev.findIndex((x) => x.pinId === unit.pinId);
					if (idx === -1) return prev;

					const currentUnit = prev[idx];
					const next = [...prev];

					next[idx] = switchUnitToPath({
						unit: currentUnit,
						path: connectorPath,
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
				console.warn("Police rejoin route failed:", error);
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
						const stillExists = incidentsRef.current.some(
							(incident) =>
								incident.id === unit.assignedIncidentId &&
								isActiveIncident(incident, now, timerSlowdownRef.current),
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
						const resolvedIncidentId = unit.assignedIncidentId;

						if (resolvedIncidentId) {
							resolvedIncidentIdsRef.current.add(resolvedIncidentId);
						}

						changed = true;
						return switchUnitToPath({
							unit: nextUnit,
							path: [arrivedAt],
							mode: "holding",
							isLooping: false,
							nextLoopPath: getPatrolLoop(nextUnit),
							assignedIncidentId: null,
							holdUntilTs: now + unit.holdMs,
							now,
						});
					}

					if (unit.mode === "rejoining") {
						const loopPath = unit.nextLoopPath ?? getPatrolLoop(unit);
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

	useEffect(() => {
		if (paused) return;
		const now = Date.now();
		const liveUnits = unitsRef.current;
		if (liveUnits.length === 0) return;

		const activeIncidents = incidents.filter((incident) =>
			isActiveIncident(incident, now, timerSlowdownRef.current),
		);
		if (activeIncidents.length === 0) return;

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

		const candidateIncidents = activeIncidents.filter(
			(incident) =>
				!alreadyAssignedIncidentIds.has(incident.id) &&
				!pendingIncidentIdsRef.current.has(incident.id),
		);

		if (candidateIncidents.length === 0) return;

		const pairs: Array<{
			unit: PoliceUnit;
			incident: PoliceIncident;
			distance: number;
			timeLeftMs: number;
			estimatedTravelMs: number;
			slackMs: number;
		}> = [];

		for (const unit of availableUnits) {
			const unitPos = getUnitPosition(unit, now);

			for (const incident of candidateIncidents) {
				const d = distanceMeters(unitPos, [incident.lat, incident.lng]);

				if (d <= RESPONSE_RADIUS_METERS) {
					const { timeLeftMs, estimatedTravelMs, slackMs } =
						getDispatchEstimate(d, unit, incident, now, timerSlowdownRef.current);

					pairs.push({
						unit,
						incident,
						distance: d,
						timeLeftMs,
						estimatedTravelMs,
						slackMs,
					});
				}
			}
		}

		if (pairs.length === 0) return;

		pairs.sort((a, b) => {
			const aCatchable = a.slackMs >= 0;
			const bCatchable = b.slackMs >= 0;

			if (aCatchable !== bCatchable) {
				return aCatchable ? -1 : 1;
			}

			if (aCatchable && bCatchable && a.slackMs !== b.slackMs) {
				return a.slackMs - b.slackMs;
			}

			if (!aCatchable && !bCatchable && a.slackMs !== b.slackMs) {
				return b.slackMs - a.slackMs;
			}

			if (a.timeLeftMs !== b.timeLeftMs) {
				return a.timeLeftMs - b.timeLeftMs;
			}

			return a.distance - b.distance;
		});

		const usedUnits = new Set<string>();
		const usedIncidents = new Set<string>();

		for (const pair of pairs) {
			if (usedUnits.has(pair.unit.pinId)) continue;
			if (usedIncidents.has(pair.incident.id)) continue;
			if (pendingResponseUnitIdsRef.current.has(pair.unit.pinId)) continue;
			if (pendingIncidentIdsRef.current.has(pair.incident.id)) continue;

			usedUnits.add(pair.unit.pinId);
			usedIncidents.add(pair.incident.id);

			startResponseJob(pair.unit, pair.incident);
		}
	}, [incidents, units, paused]);

	const renderItems = useMemo<PoliceRenderItem[]>(() => {
		const now = renderNow;

		return units.map((unit) => {
			const pos = getUnitPosition(unit, now);

			return {
				pinId: unit.pinId,
				name: unit.displayName,
				initial: unit.initial,
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

	const etaItems = useMemo<PoliceEtaItem[]>(() => {
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
		onPoliceRenderUpdate?.(renderItems);
	}, [renderItems, onPoliceRenderUpdate]);

	useEffect(() => {
		onPoliceEtaUpdate?.(etaItems);
	}, [etaItems, onPoliceEtaUpdate]);

	useEffect(() => {
		if (!onPoliceResolveIncident) return;
		if (resolvedIncidentIdsRef.current.size === 0) return;

		const resolvedIds = Array.from(resolvedIncidentIdsRef.current);
		resolvedIncidentIdsRef.current.clear();

		for (const incidentId of resolvedIds) {
			onPoliceResolveIncident(incidentId);
		}
	}, [units, onPoliceResolveIncident]);

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
						color: "#60a5fa",
						weight: 5,
						opacity: 0.95,
					}}
				/>
			))}
		</>
	);
}