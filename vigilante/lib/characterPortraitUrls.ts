/**
 * Portrait URLs that exist on disk:
 * - `public/npcs/` — map / story NPC faces (Old Man, police, etc.)
 * - `public/characters/` — vigilante roster (`vigilante.ts`) + stand-ins when no npc art
 */

/** Files in `public/npcs/` (dedicated NPC art) */
export const NPC_ART_URLS = {
	oldMan: "/npcs/OldMan.png",
	girl: "/npcs/Girl.png",
	woman: "/npcs/Woman.png",
	helper: "/npcs/Helper.png",
	officerDiaz: "/npcs/OfficerDiaz.png",
	detectiveKim: "/npcs/DetectiveKim.png",
	chiefWilliams: "/npcs/ChiefWilliams.png",
} as const;

/** Roster portraits from `public/characters/` (see `app/components/data/vigilante.ts`) */
export const CHARACTER_PORTRAIT_URLS = {
	adam: "/characters/Adam.png",
	kevin: "/characters/Kevin.png",
	jen: "/characters/Jen.png",
	iris: "/characters/Iris.png",
	bruce: "/characters/Bruce.png",
	zonaka: "/characters/Zonaka.png",
	ashley: "/characters/Ashley.png",
	z: "/characters/Z.png",
	parya: "/characters/Parya.png",
	marcus: "/characters/Marcus.png",
	disguisedKim: "/characters/DisguisedKim.png",
	robin: "/characters/Robin.png",
	tom: "/characters/Tom.png",
} as const;

/** Story roles → real files under `public/npcs` or `public/characters` */
export const NPC_PORTRAIT = {
	/** No `Dispatcher.png` in repo — radio operator stand-in */
	dispatcher: CHARACTER_PORTRAIT_URLS.kevin,
	citizenOldMan: NPC_ART_URLS.oldMan,
	citizenGirl: NPC_ART_URLS.girl,
	citizenWoman: NPC_ART_URLS.woman,
	citizenHelper: NPC_ART_URLS.helper,
	officerDiaz: NPC_ART_URLS.officerDiaz,
	detectiveKim: NPC_ART_URLS.detectiveKim,
	chiefWilliams: NPC_ART_URLS.chiefWilliams,
	bruce: CHARACTER_PORTRAIT_URLS.bruce,
	parya: CHARACTER_PORTRAIT_URLS.parya,
} as const;
