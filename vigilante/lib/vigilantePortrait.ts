import type { StaticImageData } from "next/image";
import type { VigilanteSheet } from "@/app/components/data/vigilante";

/** Public URL or bundled image `src` (from `vigilante.ts` / `public/characters`). */
export function portraitToSrc(
	portrait: VigilanteSheet["portrait"],
): string | undefined {
	if (typeof portrait === "string") return portrait;
	if (
		portrait &&
		typeof portrait === "object" &&
		"src" in portrait &&
		typeof (portrait as StaticImageData).src === "string"
	) {
		return (portrait as StaticImageData).src;
	}
	return undefined;
}
