import type { LatLngTuple } from "leaflet";

export type VigilanteMode = "patrolling" | "responding" | "holding" | "rejoining";

export type VigilanteUnit = {
  pinId: string;
  displayName: string;
  initial: string;
  portrait: string;
  patrolRouteId: string;
  speeds: {
    patrolMps: number;
    responseMps: number;
    rejoinMps: number;
  };
  holdMs: number;
  // Movement state
  mode: VigilanteMode;
  path: LatLngTuple[];
  segmentIndex: number;
  segmentStartedAt: number;
  segmentDurationMs: number;
  assignedIncidentId: string | null;
  isLooping: boolean;
  nextLoopPath: LatLngTuple[] | null;
  holdUntilTs: number | null;
  cooldownUntilTs: number | null;
  responseOverrideMps: number | null;
};

export type VigilanteIncidentStatus = "active" | "resolving" | "resolved";

export type VigilanteIncident = {
  id: string;
  lat: number;
  lng: number;
  status: "active" | "resolving" | "resolved";
  createdAt: number;
  expiresAt: number;
  deployedVigilanteIds?: string[];
};

export type VigilanteRenderItem = {
  pinId: string;
  name: string;
  initial: string;
  portrait: string;
  lat: number;
  lng: number;
  mode: VigilanteMode;
  visiblePath: LatLngTuple[];
  assignedIncidentId: string | null;
};

export type VigilanteEtaItem = {
  unitId: string;
  name: string;
  incidentId: string;
  etaMs: number;
};
