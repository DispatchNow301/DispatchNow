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
};

const RESPONSE_RADIUS_METERS = 3200;
const TICK_MS = 60;
const RENDER_TICK_MS = 1000 / 30;
const REASSIGN_COOLDOWN_MS = 1000;
const TARGET_PRE_EXPIRY_ARRIVAL_MS = 5000;
const RESPONSE_SPEED_MIN_MULTIPLIER = 0.75;
const RESPONSE_SPEED_MAX_MULTIPLIER = 2.35;

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

function isActiveIncident(incident: PoliceIncident, now: number) {
	return incident.status === "active" && now < incident.expiresAt;
}

export default function PoliceSystem({
	incidents,
	onPoliceRenderUpdate,
	onPoliceEtaUpdate,
	onPoliceResolveIncident,
	paused = false,
}: Props) {
	const [units, setUnits] = useState<PoliceUnit[]>([]);
	const [renderNow, setRenderNow] = useState(Date.now());

	const unitsRef = useRef<PoliceUnit[]>([]);
	const incidentsRef = useRef<PoliceIncident[]>(incidents);

	// Keep a ref so interval callbacks always see the latest paused value
	// without needing to be recreated every time paused flips.
	const pausedRef = useRef(paused);
	pausedRef.current = paused;

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

	// ── Render tick: frozen while paused ─────────────────────────────────────
	// Uses pausedRef so the interval itself never needs to be recreated.
	useEffect(() => {
		const id = window.setInterval(() => {
			if (pausedRef.current) return;
			setRenderNow(Date.now());
		}, RENDER_TICK_MS);

		return () => window.clearInterval(id);
	}, []); // intentionally [] — pausedRef handles the gate

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

		void (async () => {
			try {
				const route = await computeLeafletRoute(
					{ lat: currentPos[0], lng: currentPos[1] },
					{ lat: incident.lat, lng: incident.lng },
				);

				const finalPath =
					route.length >= 2
						? route
						: [currentPos, [incident.lat, incident.lng] as LatLngTuple];

				setUnits((prev) => {
					const idx = prev.findIndex((x) => x.pinId === unit.pinId);
					if (idx === -1) return prev;

					const now = Date.now();

					const latestIncident = incidentsRef.current.find(
						(x) => x.id === incident.id,
					);
					if (!latestIncident || !isActiveIncident(latestIncident, now)) {
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
					const remainingMs = Math.max(latestIncident.expiresAt - now, 0);
					const targetTravelMs = Math.max(
						remainingMs - TARGET_PRE_EXPIRY_ARRIVAL_MS,
						1200,
					);

					const desiredResponseMps =
						pathMeters > 0 ? pathMeters / (targetTravelMs / 1000) : 0;

					const baseResponseMps = currentUnit.speeds.responseMps;
					const minResponseMps =
						baseResponseMps * RESPONSE_SPEED_MIN_MULTIPLIER;
					const maxResponseMps =
						baseResponseMps * RESPONSE_SPEED_MAX_MULTIPLIER;

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

				const connectorPath =
					built.connectorPath.length >= 2
						? built.connectorPath
						: [currentPos, built.rotatedLoop[0] ?? currentPos];

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

	// ── Physics tick: frozen while paused ────────────────────────────────────
	// Uses pausedRef so the interval itself never needs to be recreated.
	useEffect(() => {
		const id = window.setInterval(() => {
			if (pausedRef.current) return; // ← the actual fix
			const now = Date.now();

			setUnits((prev) => {
				let changed = false;

				const next = prev.map((unit) => {
					if (unit.assignedIncidentId) {
						const stillExists = incidentsRef.current.some(
							(incident) =>
								incident.id === unit.assignedIncidentId &&
								isActiveIncident(incident, now),
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
	}, []); // intentionally [] — pausedRef handles the gate

	/**
	 * Police-centric assignment:
	 * each available police unit looks for the nearest active incident.
	 * This fits the case where incidents greatly outnumber police units.
	 */
	useEffect(() => {
		if (paused) return;
		const now = Date.now();
		const liveUnits = unitsRef.current;
		if (liveUnits.length === 0) return;

		const activeIncidents = incidents.filter((incident) =>
			isActiveIncident(incident, now),
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
		}> = [];

		for (const unit of availableUnits) {
			const unitPos = getUnitPosition(unit, now);

			for (const incident of candidateIncidents) {
				const d = distanceMeters(unitPos, [incident.lat, incident.lng]);

				if (d <= RESPONSE_RADIUS_METERS) {
					pairs.push({
						unit,
						incident,
						distance: d,
					});
				}
			}
		}

		if (pairs.length === 0) return;

		pairs.sort((a, b) => a.distance - b.distance);

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