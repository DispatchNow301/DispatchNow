export enum Tier {
	Citizen = 1,
	Volunteer = 2,
	Authority = 3,
}

export const RoutePermissions: Record<string, Tier[]> = {
	"/test": [Tier.Authority], // only authorities
};

export function isAuthorized(path: string, tier: Tier) {
	for (const route in RoutePermissions) {
		if (path === route) {
			return RoutePermissions[route].includes(tier);
		}
	}
	return true; // default public if not listed
}
