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

export const vigilantes: VigilanteSheet[] = [ 
    {
        id: "marcus",
        name: "Marcus",
        alias: "Marcus",
        role: "Field Operative",
        portrait: "/characters/Marcus.png",
        age: 34,
        status: "Available",
        joinedAt: "Joined 3 days ago",
        backgroundNote: "Claims freelance security and convoy work across state lines. Records are sparse.",
        bio: "Quiet, capable, and strangely polished for someone allegedly operating solo this long. Keeps answers short and avoids specifics about old crews.",
        traits: ["Disciplined", "Low-profile", "Reserved"],
        equipment: ["Radio earpiece", "Utility jacket", "Tactical gloves"],
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          combat: 4,
          stealth: 1,
          tactics: 3,
          nerve: 5,
        },
      },
      {
        id: "familiar-face",
        name: "Evan Vale",
        alias: "Vale",
        role: "Field Operative",
        portrait: "/characters/DisguisedKim.png",
        age: 31,
        status: "Available",
        joinedAt: "Joined 2 weeks ago",
        backgroundNote: "Background checks out on paper. Former investigator for private insurance fraud cases.",
        bio: "Keeps a measured tone, asks smart questions, and seems unusually interested in how your crew communicates. Nothing on the sheet is obviously wrong.",
        traits: ["Observant", "Collected", "Methodical"],
        equipment: ["Plain coat", "Burner phone", "Notebook"],
        isUndercover: true,
        trueIdentity: "Detective Kim",
        stats: {
          combat: 3,
          stealth: 3,
          tactics: 4,
          nerve: 4,
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
        joinedAt: "Joined yesterday",
        backgroundNote: "Says she drifted in from another city after a crew breakup. No names given.",
        bio: "Competent enough on paper, but the story is thin and the timing is convenient. Seems more interested in your roster than the actual missions.",
        traits: ["Adaptable", "Calm", "Unreadable"],
        equipment: ["Light vest", "Messenger pouch", "Phone with cracked case"],
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          combat: 3,
          stealth: 1,
          tactics: 5,
          nerve: 3,
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
        joinedAt: "Joined 5 days ago",
        backgroundNote: "Former warehouse guard. Says he knows how to stay out of sight. Employment history feels unusually neat.",
        bio: "Looks the part and says the right things, but the timeline is a little too tidy. Comes across like someone trained to blend in fast.",
        traits: ["Patient", "Steady hands", "Clean habits"],
        equipment: ["Leather jacket", "Chain necklace", "Pocket flashlight"],
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          combat: 1,
          stealth: 4,
          tactics: 5,
          nerve: 3,
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
    joinedAt: "Joined 4 months ago",
    bio: "Adam was a freelance infiltrator who built his reputation by ghosting through back entrances, rooftops, and service corridors that heavier crews never noticed. He has the look of someone who prefers silence to spectacle and spent years working alone because being tied to a team meant being slowed down. He finally agreed to join up after realizing your organization could give him what he never had before: real intel, better gear, and people who could capitalize on the openings he creates.",
    traits: ["Stealthy", "Independent", "Precise"],
    equipment: ["Tinted glasses", "Suppressed sidearm", "Lock bypass kit"],
    stats: {
      combat: 2,
      stealth: 5,
      tactics: 4,
      nerve: 3,
    },
  },
  {
    id: "kevin",
    name: "Kevin",
    alias: "Kevin",
    role: "Field Operative",
    portrait: Kevin,
    age: 35,
    status: "Available",
    joinedAt: "Joined 7 months ago",
    bio: "Kevin is a former private contractor who burned out on escort jobs and corporate protection work after realizing he was risking his life for people who treated whole neighborhoods like collateral. He is cool under pressure, physically capable, and carries himself like someone who has spent a long time in bad situations without panicking. Kevin is not especially subtle, but he is disciplined, reliable, and good at holding a line when a mission starts to collapse.",
    traits: ["Disciplined", "Reliable", "Composed"],
    equipment: ["Tactical vest", "Encrypted radio", "Flashlight baton"],
    stats: {
      combat: 4,
      stealth: 2,
      tactics: 3,
      nerve: 4,
    },
  },
  {
    id: "jen",
    name: "Jen",
    alias: "Jen",
    role: "Field Operative",
    portrait: Jen,
    age: 30,
    status: "Available",
    joinedAt: "Joined 5 months ago",
    bio: "Jen came out of the city’s underground music and nightlife scene, where she learned that people say far more than they mean to when they think nobody important is listening. She turned that into a talent for gathering rumors, reading shifting social dynamics, and moving easily between different circles without drawing too much suspicion. Jen is sharp, adaptable, and better at sensing a trap before it closes than most of the crew.",
    traits: ["Street-connected", "Perceptive", "Adaptive"],
    equipment: ["Signal headphones", "Messenger satchel", "Compact taser"],
    stats: {
      combat: 2,
      stealth: 3,
      tactics: 4,
      nerve: 3,
    },
  },
  {
    id: "iris",
    name: "Iris",
    alias: "Iris",
    role: "Field Operative",
    portrait: Iris,
    age: 27,
    status: "Available",
    joinedAt: "Joined 3 months ago",
    bio: "Iris used to run lookout and courier work for neighborhood crews before deciding she was tired of helping the wrong people stay one step ahead of everyone else. She is calm, observant, and very good at looking harmless right up until she has already mapped out every exit in the room. Iris is the kind of operative who keeps missions stable: quick enough to react, quiet enough to avoid notice, and smart enough to know when the crew should back off.",
    traits: ["Observant", "Calm", "Quick-thinking"],
    equipment: ["Goggles", "Utility harness", "Compact med pouch"],
    stats: {
      combat: 2,
      stealth: 4,
      tactics: 4,
      nerve: 3,
    },
  },
  {
    id: "bruce",
    name: "Bruce",
    alias: "Bruce",
    role: "Field Operative",
    portrait: Bruce,
    age: 48,
    status: "Available",
    joinedAt: "Joined 1 year ago",
    bio: "Bruce is an old hand by vigilante standards, a hard-bitten survivor who has seen too many crews rise and fall because they confused aggression with discipline. He used to work armed escort and neighborhood protection jobs before city corruption and gang money made that line impossible to walk cleanly. Bruce is blunt, intimidating, and built for direct confrontation, but behind the rough edges is someone who takes responsibility seriously and refuses to abandon people once he has decided they are his own.",
    traits: ["Intimidating", "Experienced", "Protective"],
    equipment: ["Heavy radio", "Reinforced jacket", "Combat knife"],
    stats: {
      combat: 5,
      stealth: 1,
      tactics: 3,
      nerve: 5,
    },
  },
  {
    id: "zonaka",
    name: "Zonaka",
    alias: "Zonaka",
    role: "Field Operative",
    portrait: Zonaka,
    age: 28,
    status: "Available",
    joinedAt: "Joined 2 months ago",
    bio: "Zonaka made a name as a fast-moving solo operator who specialized in recon, sabotage, and getting into places where nobody expected trouble to come from. Their style is modern, unconventional, and a little theatrical, but that only hides how careful they actually are. Zonaka thrives on mobility, misdirection, and hitting a target’s weak point before the fight has even properly started, making them one of the crew’s best picks for disruption and infiltration.",
    traits: ["Stylish", "Unpredictable", "Tech-savvy"],
    equipment: ["Purple-lens glasses", "Signal scrambler", "Slim blade"],
    stats: {
      combat: 2,
      stealth: 4,
      tactics: 4,
      nerve: 4,
    },
  },
  {
    id: "ashley",
    name: "Ashley",
    alias: "Ashley",
    role: "Field Operative",
    portrait: Ashley,
    age: 25,
    status: "Available",
    joinedAt: "Joined 6 months ago",
    bio: "Ashley is one of the younger recruits but does not carry herself like someone unsure of her place. She spent years running messages, supplies, and people across unstable parts of the city, which taught her how to move fast, keep her head clear, and commit without hesitation when the moment finally came. Ashley brings energy and adaptability to the group, and while she is not the most polished planner, she is fearless enough to make bold plays when others start second-guessing themselves.",
    traits: ["Fearless", "Fast", "Resourceful"],
    equipment: ["Aviator goggles", "Layered hoodie", "Grip gloves"],
    stats: {
      combat: 3,
      stealth: 3,
      tactics: 2,
      nerve: 4,
    },
  },
  {
    id: "z",
    name: "Z",
    alias: "Z",
    role: "Field Operative",
    portrait: Z,
    status: "Available",
    joinedAt: "Joined 3 weeks ago",
    bio: "Z is an unknown vigilante who worked alone but is now willing to join the group because your operation finally has the reach and resources to matter. Almost nothing verifiable exists about where Z came from, who trained them, or how long they have really been active, only scattered reports of a masked figure appearing in places where people much more dangerous suddenly stopped feeling untouchable. Not much else is known about this enigmatic vigilante, but everyone who has crossed paths with Z agrees on one thing: they move like a ghost and fight like someone who expects no second chances.",
    traits: ["Enigmatic", "Ghostlike", "Lethal"],
    equipment: ["Skull mask", "Red signal scarf", "Concealed blades"],
    stats: {
      combat: 4,
      stealth: 5,
      tactics: 4,
      nerve: 5,
    },
  },
  {
    id: "parya",
    name: "Parya",
    alias: "Parya",
    role: "Field Operative",
    portrait: Parya,
    age: 33,
    status: "Available",
    joinedAt: "Joined 1 year 2 months ago",
    bio: "Parya worked alone for years as a watcher, courier, and occasional fixer, building a reputation for showing up where she was needed and disappearing before anyone could ask too many questions. She is guarded, intelligent, and more comfortable dealing in observation and timing than brute force, which makes her especially valuable in a crew that increasingly needs precision over chaos. Parya joined because the group gives her access to information, logistics, and protection she could never maintain by herself, but she still carries the instincts of someone used to relying on nobody but her own judgment.",
    traits: ["Guarded", "Perceptive", "Self-reliant"],
    equipment: ["Face wrap", "Silent boots", "Compact radio"],
    stats: {
      combat: 2,
      stealth: 5,
      tactics: 5,
      nerve: 4,
    },
  },
];