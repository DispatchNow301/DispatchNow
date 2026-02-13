import { Tier } from "@/lib/types";

export const RoutePermissions: Record<string, Tier[]> = {
	"/test": [Tier.Citizen],
	"/assign": [Tier.Authority],
};

export function isAuthorized(path: string, tier: Tier) {
	for (const route in RoutePermissions) {
		if (path === route) {
			return RoutePermissions[route].includes(tier);
		}
	}
	return true;
}
