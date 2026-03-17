import Adam from "@/public/characters/Adam.png";
import Kevin from "@/public/characters/Kevin.png";
import Jen from "@/public/characters/Jen.png";
import Iris from "@/public/characters/Iris.png";
import Bruce from "@/public/characters/Bruce.png";
import Zonaka from "@/public/characters/Zonaka.png";
import Ashley from "@/public/characters/Ashley.png";
import Z from "@/public/characters/Z.png";
import Parya from "@/public/characters/Parya.png";

export type VigilanteSheet = {
    id: string;
    name: string;
    alias: string;
    role: string;
    portrait: any;
    age?: number;
    status?: string;
    heat?: number;
    bio?: string;
    traits?: string[];
    equipment?: string[];
    joinedAt?: string;
    backgroundNote?: string;
    isUndercover?: boolean;
    trueIdentity?: string;
    stats: {
      combat: number;
      stealth: number;
      tactics: number;
      nerve: number;
    };
  };

const defaultStats = {
  combat: 1,
  stealth: 1,
  tactics: 1,
  nerve: 1,
};

export const vigilantes: VigilanteSheet[] = [ //TODO add joined date for all. make full fledged bios and replace AI ones for undercover agents. 
    {
        id: "marcus",
        name: "Marcus",
        alias: "Marcus",
        role: "Field Operative",
        portrait: "/characters/Marcus.png",
        age: 34,
        status: "Available",
        heat: 1,
        joinedAt: "Joined 3 days ago",
        backgroundNote: "Claims freelance security and convoy work across state lines. Records are sparse.",
        bio: "Quiet, capable, and strangely polished for someone allegedly operating solo this long. Keeps answers short and avoids specifics about old crews.",
        traits: ["Disciplined", "Low-profile", "Reserved"],
        equipment: ["Radio earpiece", "Utility jacket", "Tactical gloves"],
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          combat: 1,
          stealth: 1,
          tactics: 1,
          nerve: 1,
        },
      },
      {
        id: "familiar-face",
        name: "Evan Vale",
        alias: "Vale",
        role: "Field Operative",
        portrait: "/characters/FamiliarFace(DisguisedKim).png",
        age: 31,
        status: "Available",
        heat: 1,
        joinedAt: "Joined 2 weeks ago",
        backgroundNote: "Background checks out on paper. Former investigator for private insurance fraud cases.",
        bio: "Keeps a measured tone, asks smart questions, and seems unusually interested in how your crew communicates. Nothing on the sheet is obviously wrong.",
        traits: ["Observant", "Collected", "Methodical"],
        equipment: ["Plain coat", "Burner phone", "Notebook"],
        isUndercover: true,
        trueIdentity: "Detective Kim",
        stats: {
          combat: 1,
          stealth: 1,
          tactics: 1,
          nerve: 1,
        },
      },
      {
        id: "robin",
        name: "Robin",
        alias: "Robin",
        role: "Field Operative",
        portrait: "/characters/Robin.png",
        age: 27,
        status: "Available",
        heat: 1,
        joinedAt: "Joined yesterday",
        backgroundNote: "Says she drifted in from another city after a crew breakup. No names given.",
        bio: "Competent enough on paper, but the story is thin and the timing is convenient. Seems more interested in your roster than the actual missions.",
        traits: ["Adaptable", "Calm", "Unreadable"],
        equipment: ["Light vest", "Messenger pouch", "Phone with cracked case"],
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          combat: 1,
          stealth: 1,
          tactics: 1,
          nerve: 1,
        },
      },
      {
        id: "tom",
        name: "Tom",
        alias: "Tom",
        role: "Field Operative",
        portrait: "/characters/Tom.png",
        age: 29,
        status: "Available",
        heat: 1,
        joinedAt: "Joined 5 days ago",
        backgroundNote: "Former warehouse guard. Says he knows how to stay out of sight. Employment history feels unusually neat.",
        bio: "Looks the part and says the right things, but the timeline is a little too tidy. Comes across like someone trained to blend in fast.",
        traits: ["Patient", "Steady hands", "Clean habits"],
        equipment: ["Leather jacket", "Chain necklace", "Pocket flashlight"],
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          combat: 1,
          stealth: 1,
          tactics: 1,
          nerve: 1,
        },
      },
      
  {
    id: "adam",
    name: "Adam",
    alias: "Adam",
    role: "Field Operative",
    portrait: Adam,
    age: 28,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
  {
    id: "kevin",
    name: "Kevin",
    alias: "Kevin",
    role: "Field Operative",
    portrait: Kevin,
    age: 35,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
  {
    id: "jen",
    name: "Jen",
    alias: "Jen",
    role: "Field Operative",
    portrait: Jen,
    age: 30,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
  {
    id: "iris",
    name: "Iris",
    alias: "Iris",
    role: "Field Operative",
    portrait: Iris,
    age: 27,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
  {
    id: "bruce",
    name: "Bruce",
    alias: "Bruce",
    role: "Field Operative",
    portrait: Bruce,
    age: 48,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
  {
    id: "zonaka",
    name: "Zonaka",
    alias: "Zonaka",
    role: "Field Operative",
    portrait: Zonaka,
    age: 28,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
  {
    id: "ashley",
    name: "Ashley",
    alias: "Ashley",
    role: "Field Operative",
    portrait: Ashley,
    age: 25,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
  {
    id: "z",
    name: "Z",
    alias: "Z",
    role: "Field Operative",
    portrait: Z,
    age: 999,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
  {
    id: "parya",
    name: "Parya",
    alias: "Parya",
    role: "Field Operative",
    portrait: Parya,
    age: 33,
    status: "Available",
    heat: 1,
    bio: "Backstory TBD.",
    traits: ["TBD"],
    equipment: ["TBD"],
    stats: { ...defaultStats },
  },
];