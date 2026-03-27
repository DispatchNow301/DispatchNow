export type MarkerKind = "incident" | "theft" | "hire";
export type MultiplayerSessionStatus = "lobby" | "active" | "finished";
export type MultiplayerMarkerStatus = "active" | "resolved" | "failed";

export type MapMarker = {
	id: string;
	kind: MarkerKind;
	x: number; // 0..1 map space
	y: number; // 0..1 map space
	title: string;
	details: string;
	createdAt: number;
	expiresAt?: number;
};

export type MultiplayerSession = {
	id: number;
	join_code: string;
	host_user_id: string;
	created_at: string;
	status: MultiplayerSessionStatus;
	save_scope: "local" | "cloud";
	save_slot: number;
};

export type MultiplayerPlayer = {
	id: number;
	session_id: number;
	user_id: string;
	joined_at: string;
	is_host: boolean;
	is_connected: boolean;
};

export type AssignedResource = {
	playerId: string;
	resource: string;
	assignedAt: string;
};

export type MultiplayerMarkerRow = {
	id: number;
	session_id: number;
	marker_id: string;
	kind: MarkerKind;
	x: number;
	y: number;
	title: string;
	details: string;
	created_at: string;
	expires_at: string | null;
	status: MultiplayerMarkerStatus;
	assigned_resources: AssignedResource[];
};

export type MultiplayerMarker = {
	id: string;
	kind: MarkerKind;
	x: number;
	y: number;
	title: string;
	details: string;
	createdAt: number;
	expiresAt?: number;
	status: MultiplayerMarkerStatus;
};

export function dbMarkerToGameMarker(row: MultiplayerMarkerRow): MultiplayerMarker {
	return {
		id: row.marker_id,
		kind: row.kind,
		x: row.x,
		y: row.y,
		title: row.title,
		details: row.details,
		createdAt: new Date(row.created_at).getTime(),
		expiresAt: row.expires_at ? new Date(row.expires_at).getTime() : undefined,
		status: row.status,
	};
}

/**
 * Achievement tracking state stored in GameState
 */
export type UnlockedAchievement = {
	achievementId: string;
	unlockedAt: number;
};

export type AchievementProgress = {
	/** Total credits earned (cumulative) */
	totalCreditsEarned: number;
	/** Highest single dispatch credit payout */
	highestSinglePayout: number;
	/** Current dispatch streak (consecutive successes without failure) */
	currentStreak: number;
	/** Best dispatch streak ever */
	bestStreak: number;
	/** Timestamps of recent incident resolutions for quick response tracking */
	recentResolutions: number[];
	/** Number of dispatches started (for tracking quick response) */
	dispatchesStarted: number;
	/** Track incident types resolved */
	incidentsByArchetype: Record<string, number>;
	/** Resources currently owned (highest counts) */
	maxResourceInventory: Record<string, number>;
	/** Vigilantes ever owned */
	uniqueVigilantesOwned: Set<string>;
	/** Vigilante injuries count */
	vigilanteInjuries: number;
	/** Total playtime in milliseconds */
	totalPlaytimeMs: number;
	/** Session start time for tracking playtime */
	sessionStartTime: number | null;
};

export const DEFAULT_ACHIEVEMENT_PROGRESS: AchievementProgress = {
	totalCreditsEarned: 0,
	highestSinglePayout: 0,
	currentStreak: 0,
	bestStreak: 0,
	recentResolutions: [],
	dispatchesStarted: 0,
	incidentsByArchetype: {},
	maxResourceInventory: {},
	uniqueVigilantesOwned: new Set(),
	vigilanteInjuries: 0,
	totalPlaytimeMs: 0,
	sessionStartTime: null,
};

// Complete GameState type (used across the application)
export type CareerStats = {
	dispatchesCompleted: number;
	incidentsResolvedSuccess: number;
	incidentsResolvedFailure: number;
	incidentsExpired: number;
	vigilantesRecruited: number;
};

export type GameState = {
	level: number;
	selectedIncidentId: string | null;
	incidents: any[];
	showIncidentPanel: boolean;
	showMinigamePanel: boolean;
	showPolicePanel: boolean;
	showInventoryPanel: boolean;
	inventoryTab: "vigilantes" | "resources" | "buffs";
	ownedVigilanteIds: string[];
	recruitLeads: any[];
	resourcePool: Record<string, any>;
	credits: number;
	purchasedUpgradeIds: string[];
	vigilanteInjuryUntil: Record<string, number>;
	careerStats: CareerStats;
	purchasedBuffIds: string[];
	unlockedAchievementIds: UnlockedAchievement[];
	achievementProgress: AchievementProgress;
};