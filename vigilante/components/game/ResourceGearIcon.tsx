"use client";

import {
	FaFireExtinguisher,
	FaMedkit,
	FaSyringe,
} from "react-icons/fa";
import {
	FaHandcuffs,
	FaRoadBarrier,
	FaSatellite,
	FaScrewdriverWrench,
	FaTruck,
	FaVest,
	FaWalkieTalkie,
} from "react-icons/fa6";

export type ResourceGearId =
	| "r1"
	| "r2"
	| "r3"
	| "r4"
	| "r5"
	| "r6"
	| "r7"
	| "r8"
	| "r9"
	| "r10";

type Props = {
	resourceId: string;
	className?: string;
};

/** Same icon mapping as the inventory Resources tab (gear tiles). */
export function ResourceGearIcon({ resourceId, className = "" }: Props) {
	switch (resourceId as ResourceGearId) {
		case "r1":
			return <FaMedkit className={className} aria-hidden />;
		case "r2":
			return <FaFireExtinguisher className={className} aria-hidden />;
		case "r3":
			return <FaWalkieTalkie className={className} aria-hidden />;
		case "r4":
			return <FaHandcuffs className={className} aria-hidden />;
		case "r5":
			return <FaSatellite className={className} aria-hidden />;
		case "r6":
			return <FaVest className={className} aria-hidden />;
		case "r7":
			return <FaRoadBarrier className={className} aria-hidden />;
		case "r8":
			return <FaSyringe className={className} aria-hidden />;
		case "r9":
			return <FaScrewdriverWrench className={className} aria-hidden />;
		case "r10":
			return <FaTruck className={className} aria-hidden />;
		default:
			return <FaTruck className={className} aria-hidden />;
	}
}
