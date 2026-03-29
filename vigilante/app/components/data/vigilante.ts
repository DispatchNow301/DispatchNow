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
    joinedAt?: string;
    backgroundNote?: string;
    isUndercover?: boolean;
    trueIdentity?: string;
    stats: {
      strength: number;
      intelligence: number;
      speed: number;
    };
  };

const defaultStats = {
  strength: 1,
  intelligence: 1,
  speed: 1,
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
        bio: "Quiet freelancer with sparse records. Keeps answers brief and avoids discussing past crews.",
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          strength: 4,
          intelligence: 3,
          speed: 3,
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
        bio: "Measured, asks smart questions about crew structure. Paperwork checks out but overly focused on internal operations.",
        isUndercover: true,
        trueIdentity: "Detective Kim",
        stats: {
          strength: 3,
          intelligence: 4,
          speed: 4,
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
        bio: "Competent on paper but story is thin. More interested in crew roster than missions. Flag for monitoring.",
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          strength: 3,
          intelligence: 5,
          speed: 2,
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
        bio: "Polished presentation with an unnaturally clean employment history. Trained to blend in quickly. Needs deeper vetting.",
        isUndercover: true,
        trueIdentity: "Undercover Officer",
        stats: {
          strength: 1,
          intelligence: 5,
          speed: 4,
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
    bio: "Freelance infiltrator specializing in back entries and rooftops. Prefers working alone but joined for better gear and support.",
    stats: {
      strength: 2,
      intelligence: 4,
      speed: 5,
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
    bio: "Former private contractor who left after growing disillusioned. Cool under pressure, disciplined, and reliable in a crisis.",
    stats: {
      strength: 4,
      intelligence: 3,
      speed: 3,
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
    bio: "Jen came out of the city’s underground music and nightlife scene, learned gathering rumors and reading social dynamics. Adaptable and perceptive, excels at spotting traps.",
    stats: {
      strength: 2,
      intelligence: 4,
      speed: 4,
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
    bio: "Former lookout and courier for neighborhood crews. Calm, observant, and excellent at mapping exits. Keeps missions stable with quick reactions and good judgment on when to back off.",
    stats: {
      strength: 2,
      intelligence: 4,
      speed: 4,
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
    bio: "Veteran of armed escort and neighborhood protection. Blunt, intimidating, and built for confrontation. Takes responsibility seriously and won't abandon his own.",
    stats: {
      strength: 5,
      intelligence: 3,
      speed: 3,
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
    bio: "Zonaka made a name as a fast-moving solo operator specializing in recon and sabotage. Their style is modern and unconventional with careful planning. Excels at disruption, and hitting a target’s weak point before the fight has even properly started, making them one of the crew’s excels at disruption and infiltration.",
    stats: {
      strength: 2,
      intelligence: 4,
      speed: 4,
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
    bio: "Young recruit with years of experience running supplies through unstable zones. Moves fast, keeps clearheaded, and commits without hesitation. Fearless and energetic, though not the most polished planner.",
    stats: {
      strength: 3,
      intelligence: 2,
      speed: 4,
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
    bio: "Mysterious masked vigilante who worked alone. Moves like a ghost and fights with lethal efficiency. Joined because the crew's resources and reach finally match their capabilities.",
    stats: {
      strength: 4,
      intelligence: 4,
      speed: 5,
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
    bio: "Long-time solo watcher and courier. Guarded and intelligent, excels at observation and timing. Brings precision to the crew while maintaining self-reliance.",
    stats: {
      strength: 2,
      intelligence: 5,
      speed: 5,
    },
  },
];