"use client";

import React, {
	useState,
	useMemo,
	useCallback,
	useRef,
	useEffect,
} from "react";

// ── Difficulty [0–10] ─────────────────────────────────────────────────
// Difficulty calculations moved to component

// ── Seeded RNG (Mulberry32) ───────────────────────────────────────────
function makeRng(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// ── Word bank ─────────────────────────────────────────────────────────
const WORD_BANK = [
	...new Set([
		"ARCH",
		"BOOT",
		"BYTE",
		"CAGE",
		"CHIP",
		"CLAN",
		"CODE",
		"CORE",
		"DATA",
		"DARK",
		"DUSK",
		"ECHO",
		"EDGE",
		"FLAW",
		"FLUX",
		"FORK",
		"GATE",
		"GRID",
		"HACK",
		"HASH",
		"HELM",
		"HIVE",
		"HOST",
		"HULL",
		"HUNT",
		"ICON",
		"IRIS",
		"JOLT",
		"JUMP",
		"KEEP",
		"KILL",
		"LANE",
		"LAST",
		"LINK",
		"LOCK",
		"LOOP",
		"LORE",
		"LURE",
		"LURK",
		"MASK",
		"MESH",
		"MODE",
		"MOLE",
		"NODE",
		"NOVA",
		"NULL",
		"OATH",
		"OPEN",
		"PACK",
		"PAGE",
		"PATH",
		"PING",
		"PIPE",
		"PLOT",
		"PORT",
		"PREY",
		"PULL",
		"PUSH",
		"RACK",
		"RAID",
		"RANK",
		"READ",
		"RIFT",
		"ROOT",
		"RULE",
		"RUSE",
		"SALT",
		"SCAN",
		"SEAL",
		"SEED",
		"SIGN",
		"SINK",
		"SLOT",
		"SNAP",
		"SORT",
		"SPAN",
		"SPEC",
		"SPIN",
		"SYNC",
		"TAIL",
		"TASK",
		"TIDE",
		"TIER",
		"TOLL",
		"TRAP",
		"TREK",
		"TRIM",
		"TRUE",
		"TUNE",
		"TURN",
		"TYPE",
		"UNIT",
		"USER",
		"VEIL",
		"VOID",
		"VOLT",
		"WAKE",
		"WALL",
		"WARD",
		"WARP",
		"WIRE",
		"WOLF",
		"WORM",
		"WRAP",
		"ZONE",
		"AGENT",
		"ALARM",
		"ALIAS",
		"ARRAY",
		"ATLAS",
		"AUDIT",
		"BADGE",
		"BATCH",
		"BLAST",
		"BLIND",
		"BLOCK",
		"BOARD",
		"BOUND",
		"BREAK",
		"BRIEF",
		"BUILD",
		"BURST",
		"CACHE",
		"CARGO",
		"CHAIN",
		"CHECK",
		"CHUNK",
		"CLAIM",
		"CLASH",
		"CLASS",
		"CLEAN",
		"CLEAR",
		"CLONE",
		"CLOUD",
		"CODEC",
		"COUNT",
		"CRAFT",
		"CRASH",
		"CRAWL",
		"CRYPT",
		"CYCLE",
		"DELTA",
		"DEPTH",
		"DEPOT",
		"DRAIN",
		"DRAFT",
		"DRIVE",
		"DRONE",
		"EPOCH",
		"ERROR",
		"EVENT",
		"EXILE",
		"FAULT",
		"FETCH",
		"FIELD",
		"FLASH",
		"FLEET",
		"FLOOD",
		"FORCE",
		"FORGE",
		"FRAME",
		"FRONT",
		"FROST",
		"GHOST",
		"GLYPH",
		"GRANT",
		"GRAPH",
		"GUARD",
		"GUIDE",
		"GUILD",
		"HAUNT",
		"HAVEN",
		"INPUT",
		"INDEX",
		"INFER",
		"INTEL",
		"ISSUE",
		"LABEL",
		"LASER",
		"LATCH",
		"LAYER",
		"LEVEL",
		"LIGHT",
		"LIMIT",
		"LOCAL",
		"LOGIC",
		"MACRO",
		"MAGIC",
		"MAKER",
		"MARCH",
		"MATCH",
		"MEDIA",
		"MERGE",
		"MICRO",
		"MIMIC",
		"MODEL",
		"MODEM",
		"MOUNT",
		"MUTEX",
		"NERVE",
		"NEXUS",
		"NIGHT",
		"NOTCH",
		"NOVEL",
		"OCCUR",
		"OFFSET",
		"ONSET",
		"ORBIT",
		"ORDER",
		"PANEL",
		"PARSE",
		"PATCH",
		"PAUSE",
		"PHASE",
		"PILOT",
		"PIXEL",
		"PLACE",
		"PLANE",
		"PLANT",
		"PLATE",
		"POINT",
		"PRIME",
		"PRINT",
		"PROBE",
		"PROXY",
		"PULSE",
		"PURGE",
		"QUERY",
		"QUEUE",
		"RADAR",
		"RADIO",
		"RANGE",
		"RELAY",
		"RESET",
		"RIDGE",
		"ROGUE",
		"ROUTE",
		"ROVER",
		"SCOPE",
		"SCORE",
		"SCOUT",
		"SENSE",
		"SERVE",
		"SETUP",
		"SHARD",
		"SHARE",
		"SHARP",
		"SHIFT",
		"SHELL",
		"SIGMA",
		"SLICE",
		"SMASH",
		"SOLID",
		"SOLVE",
		"SPAWN",
		"SPEED",
		"SPIKE",
		"SPLIT",
		"SQUAD",
		"STACK",
		"STAGE",
		"STAND",
		"START",
		"STATE",
		"STEEL",
		"STORM",
		"SURGE",
		"SWEEP",
		"SWIFT",
		"SWORD",
		"TABLE",
		"TEMPO",
		"TOKEN",
		"TOTAL",
		"TOUCH",
		"TOWER",
		"TOXIC",
		"TRACE",
		"TRACK",
		"TRADE",
		"TRAIL",
		"TRAIN",
		"TRICK",
		"TRUNK",
		"TRUST",
		"ULTRA",
		"UPPER",
		"VALID",
		"VALUE",
		"VAULT",
		"VIRAL",
		"VIRUS",
		"WATCH",
		"WEDGE",
		"WORLD",
		"XENON",
		"YIELD",
		"ZEBRA",
		"ACCESS",
		"ANCHOR",
		"BACKUP",
		"BEACON",
		"BINARY",
		"BREACH",
		"BRIDGE",
		"BUFFER",
		"BYPASS",
		"CIPHER",
		"COBALT",
		"COVERT",
		"DAEMON",
		"DECODE",
		"DEFRAG",
		"DELETE",
		"DEPLOY",
		"DETECT",
		"DEVICE",
		"DOMAIN",
		"DRIVER",
		"ENABLE",
		"ENCODE",
		"ENGAGE",
		"ESCAPE",
		"EXPORT",
		"EXPOSE",
		"FILTER",
		"FROZEN",
		"FUSION",
		"GLITCH",
		"HAZARD",
		"HIDDEN",
		"HYBRID",
		"IGNORE",
		"IMPORT",
		"INJECT",
		"LAUNCH",
		"LINEAR",
		"LOOKUP",
		"MALLOC",
		"MANUAL",
		"MARKER",
		"MATRIX",
		"MIRROR",
		"MODULE",
		"MOTION",
		"NATIVE",
		"NEURAL",
		"NOTIFY",
		"OBJECT",
		"OUTPUT",
		"PACKET",
		"PERMIT",
		"PHRASE",
		"PILLAR",
		"PLASMA",
		"POLICY",
		"PORTAL",
		"PRESET",
		"PROMPT",
		"PUBLIC",
		"RANDOM",
		"REBOOT",
		"RECALL",
		"RECORD",
		"REMOTE",
		"REMOVE",
		"RENDER",
		"REPAIR",
		"REPLAY",
		"RESCUE",
		"RESIST",
		"RESUME",
		"RETAIN",
		"RETURN",
		"REVEAL",
		"REVERT",
		"REVIEW",
		"REVOKE",
		"REWIND",
		"RUNNER",
		"SCRIPT",
		"SEARCH",
		"SECURE",
		"SELECT",
		"SENSOR",
		"SERVER",
		"SIGNAL",
		"SOCKET",
		"SOURCE",
		"STASIS",
		"STATIC",
		"STATUS",
		"STRIKE",
		"SUBMIT",
		"SWITCH",
		"SYNTAX",
		"SYSTEM",
		"TACTIC",
		"TARGET",
		"THREAD",
		"TRACER",
		"TUNNEL",
		"UNLOCK",
		"UPDATE",
		"UPLOAD",
		"VECTOR",
		"VENDOR",
		"VERIFY",
		"VERTEX",
		"WARDEN",
		"WORKER",
		"ZOMBIE",
		"ARCHIVE",
		"ASSAULT",
		"BARRIER",
		"CHANNEL",
		"CLUSTER",
		"COMMAND",
		"COMPILE",
		"CONNECT",
		"CONTROL",
		"CORRUPT",
		"COUNTER",
		"CRAWLER",
		"DECRYPT",
		"DEFAULT",
		"DISABLE",
		"EXPLOIT",
		"EXTRACT",
		"FAILURE",
		"FLATTEN",
		"FORWARD",
		"GENESIS",
		"INCLUDE",
		"INSTALL",
		"ISOLATE",
		"LIBRARY",
		"MONITOR",
		"NETWORK",
		"OPERATE",
		"PAYLOAD",
		"PHANTOM",
		"POINTER",
		"PROCESS",
		"PROFILE",
		"PROGRAM",
		"PROTECT",
		"RECEIVE",
		"RECOVER",
		"REPLACE",
		"RESOLVE",
		"RESTART",
		"RESTORE",
		"RUNTIME",
		"SESSION",
		"SHELTER",
		"SILENCE",
		"STEALTH",
		"STORAGE",
		"SUSPEND",
		"TIMEOUT",
		"TRIGGER",
		"UPGRADE",
		"VERBOSE",
		"VIRTUAL",
		"WARRANT",
		"WRAPPER",
		"ASSEMBLY",
		"CALLBACK",
		"CODEBASE",
		"COMPILER",
		"DATABASE",
		"DEADLOCK",
		"DEBUGGER",
		"ENDPOINT",
		"FIREWALL",
		"FIRMWARE",
		"FRAGMENT",
		"FUNCTION",
		"HARDWARE",
		"INCIDENT",
		"INTEGRAL",
		"ITERATOR",
		"MANIFEST",
		"METADATA",
		"OVERHEAD",
		"OVERRIDE",
		"PIPELINE",
		"PLATFORM",
		"PROTOCOL",
		"REDIRECT",
		"REGISTER",
		"ROLLBACK",
		"SHUTDOWN",
		"SKELETON",
		"SNAPSHOT",
		"TEMPLATE",
		"TERMINAL",
		"THROTTLE",
		"TOPOLOGY",
		"TRANSMIT",
		"WORKFLOW",
	]),
];

// ── Glyph paths ───────────────────────────────────────────────────────
const GLYPH_PATHS = [
	"M5 1 L5 9",
	"M1 5 L9 5",
	"M2 8 L8 2",
	"M2 2 L8 8",
	"M5 1 L5 9 M1 5 L9 5",
	"M2 2 L8 8 M2 8 L8 2",
	"M5 5 m-3.5 0 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0",
	"M2 2 L8 2 L8 8 L2 8 Z",
	"M5 1 L9 9 L1 9 Z",
	"M5 1 L8.5 3.5 L8.5 6.5 L5 9 L1.5 6.5 L1.5 3.5 Z",
	"M5 5 m-3.5 0 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M5 1.5 L5 8.5 M1.5 5 L8.5 5",
	"M2 2 L8 2 L8 8 L2 8 Z M5 2 L5 8 M2 5 L8 5",
	"M5 5 m-3.5 0 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M5 4.5 m-0.5 0 a0.5 0.5 0 1 0 1 0 a0.5 0.5 0 1 0 -1 0",
	"M1 5 Q5 1 9 5",
	"M1 5 Q5 9 9 5",
	"M5 1 L5 5 L9 5",
	"M1 5 L5 5 L5 9",
	"M2 2 L2 8 M2 5 L8 5",
	"M8 2 L8 8 M2 5 L8 5",
	"M2 9 L2 1 M2 1 L8 1",
	"M2 9 L2 1 M2 9 L8 9",
	"M1 3 L9 3 M1 5 L9 5 M1 7 L9 7",
	"M2 2 L8 2 L2 8 L8 8",
	"M5 1 L6.2 4 L9.5 4 L7 6.2 L8 9.5 L5 7.5 L2 9.5 L3 6.2 L0.5 4 L3.8 4 Z",
	"M2 5 L5 1 L8 5 L6.5 5 L6.5 9 L3.5 9 L3.5 5 Z",
	"M5 1 L9 5 L5 9 L1 5 Z",
];

type GlyphState = "default" | "revealed" | "selected";

function GlyphSVG({
	pathIndex,
	size = 26,
	state = "default",
}: {
	pathIndex: number;
	size?: number;
	state?: GlyphState;
}) {
	const stroke = {
		default: "rgba(103,232,249,0.35)",
		revealed: "rgba(52,211,153,0.90)",
		selected: "rgba(103,232,249,0.85)",
	}[state];
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 10 10"
			style={{ display: "block", flexShrink: 0 }}
		>
			<path
				d={GLYPH_PATHS[pathIndex % GLYPH_PATHS.length]}
				fill="none"
				stroke={stroke}
				strokeWidth={1.3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

// ── Puzzle ────────────────────────────────────────────────────────────
interface Puzzle {
	phrase: string;
	words: string[];
	uniqueLetters: string[];
	letterToGlyph: Record<string, number>;
	preRevealed: Set<string>;
}

function buildPuzzle(pre_reveal: number, seed: number): Puzzle {
	const rng = makeRng(seed);
	const pool = [...WORD_BANK];
	const words: string[] = [];
	for (let i = 0; i < 3; i++) {
		const idx = Math.floor(rng() * pool.length);
		words.push(pool.splice(idx, 1)[0]);
	}
	const phrase = words.join(" ");
	const uniqueLetters = [
		...new Set(phrase.replace(/ /g, "").split("")),
	].sort();
	const glyphPool = [...Array(26).keys()];
	for (let i = glyphPool.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[glyphPool[i], glyphPool[j]] = [glyphPool[j], glyphPool[i]];
	}
	const letterToGlyph: Record<string, number> = {};
	uniqueLetters.forEach((l, i) => {
		letterToGlyph[l] = glyphPool[i];
	});

	const byFreq = [...uniqueLetters].sort(
		(a, b) => phrase.split(b).length - 1 - (phrase.split(a).length - 1),
	);
	const preRevealed = new Set(
		byFreq.slice(0, Math.max(1, Math.min(pre_reveal, byFreq.length))),
	);

	return { phrase, words, uniqueLetters, letterToGlyph, preRevealed };
}

function formatTime(s: number) {
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

// ── Colour palette ────────────────────────────────────────────────────
const C = {
	border: "rgba(22,78,99,0.55)",
	borderHover: "rgba(6,182,212,0.55)",
	panelBg: "rgba(0,0,0,0.55)",
	headerLabel: "rgba(103,232,249,0.80)",
	bodyText: "rgba(103,232,249,0.60)",
	dimText: "rgba(103,232,249,0.30)",
	revealedFg: "rgba(52,211,153,0.90)",
	revealedBg: "rgba(4,47,29,0.60)",
	revealedBorder: "rgba(6,78,59,0.70)",
	hintFg: "rgba(167,139,250,0.90)",
	hintBg: "rgba(30,14,60,0.55)",
	hintBorder: "rgba(76,29,149,0.65)",
	selectedBg: "rgba(8,31,44,0.80)",
	selectedBorder: "rgba(6,182,212,0.60)",
	errorBorder: "rgba(127,29,29,0.60)",
	flashBg: "rgba(4,47,29,0.80)",
	btnBg: "rgba(8,47,55,0.55)",
	btnBorder: "rgba(22,78,99,0.70)",
	btnText: "rgba(103,232,249,0.90)",
	inputBorder: "rgba(6,182,212,0.55)",
	freqBg: "rgba(4,10,14,0.70)",
	freqBorder: "rgba(22,78,99,0.40)",
	iconBg: "rgba(8,47,55,0.35)",
	iconBorder: "rgba(22,78,99,0.55)",
	iconText: "rgba(103,232,249,0.80)",
	winColor: "rgba(134,239,172,0.90)",
	winBg: "rgba(21,128,61,0.25)",
	winBorder: "rgba(21,128,61,0.70)",
	losColor: "rgba(252,165,165,0.90)",
	losBg: "rgba(153,27,27,0.25)",
	losBorder: "rgba(153,27,27,0.70)",
	timerWarn: "rgba(251,191,36,0.90)",
	timerCrit: "rgba(252,165,165,0.90)",
};

// ── Component ─────────────────────────────────────────────────────────
interface Props {
	seed?: number;
	difficulty?: number;
	onSuccess?: () => void;
	onFailure?: () => void;
}

export default function HackMinigame({ seed, difficulty = 0, onSuccess, onFailure }: Props) {
	const [resolvedSeed] = useState(
		() => seed ?? (Math.random() * 0xffffff) | 0,
	);
	const onSuccessRef = useRef(onSuccess);
	const onFailureRef = useRef(onFailure);
	onSuccessRef.current = onSuccess;
	onFailureRef.current = onFailure;

	const TIME_LIMIT_S = Math.round(120 - difficulty * 6); // 120s → 60s
	const MAX_WRONG = Math.round(6 - difficulty * 0.3); // 6 → 3
	const PRE_REVEAL_COUNT = Math.round(4 - difficulty * 0.3); // 4 → 1
	const puzzle = useMemo(() => buildPuzzle(PRE_REVEAL_COUNT, resolvedSeed), [resolvedSeed]);

	const [phase, setPhase] = useState<"ready" | "playing">("ready");
	const [revealed, setRevealed] = useState<Set<string>>(
		new Set(puzzle.preRevealed),
	);
	const [wordHints, setWordHints] = useState<Record<number, Set<string>>>({});
	const [selectedWord, setSelectedWord] = useState<number | null>(null);
	const [inputValue, setInputValue] = useState("");
	const [wrongCount, setWrongCount] = useState(0);
	const [shakingWord, setShakingWord] = useState<number | null>(null);
	const [flashWords, setFlashWords] = useState<Set<number>>(new Set());
	const [errorWords, setErrorWords] = useState<Set<number>>(new Set());
	const [result, setResult] = useState<"win" | "lose" | null>(null);
	const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_S);
	const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
		undefined,
	);
	const inputRef = useRef<HTMLInputElement>(null);

	// Timer
	useEffect(() => {
		if (phase !== "playing") return;
		setTimeLeft(TIME_LIMIT_S);
		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timerRef.current);
					setResult("lose");
					setTimeout(() => onFailureRef.current?.(), 1800);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, [phase]);

	useEffect(() => {
		if (result) clearInterval(timerRef.current);
	}, [result]);

	// Reset on entering play phase
	useEffect(() => {
		if (phase === "playing") {
			setRevealed(new Set(puzzle.preRevealed));
			setWordHints({});
			setSelectedWord(null);
			setInputValue("");
			setWrongCount(0);
			setErrorWords(new Set());
			setFlashWords(new Set());
			setResult(null);
		}
	}, [phase, puzzle.preRevealed]);

	const allLetters = useMemo(
		() => new Set(puzzle.phrase.replace(/ /g, "").split("")),
		[puzzle.phrase],
	);
	const isWordSolved = useCallback(
		(wi: number) => [...puzzle.words[wi]].every((l) => revealed.has(l)),
		[puzzle.words, revealed],
	);

	const handleWordClick = (wi: number) => {
		if (result || isWordSolved(wi)) return;
		setSelectedWord(wi);
		setInputValue("");
		setTimeout(() => inputRef.current?.focus(), 30);
	};

	const submitGuess = useCallback(() => {
		if (selectedWord === null || result) return;
		const guess = inputValue
			.trim()
			.toUpperCase()
			.replace(/[^A-Z]/g, "");
		const target = puzzle.words[selectedWord];
		if (!guess) return;

		if (guess === target) {
			// Correct — reveal all letters in this word globally
			const next = new Set(revealed);
			[...target].forEach((l) => next.add(l));
			setRevealed(next);
			setWordHints((prev) => {
				const s = { ...prev };
				delete s[selectedWord];
				return s;
			});
			const wi = selectedWord;
			setFlashWords((prev) => new Set([...prev, wi]));
			setTimeout(
				() =>
					setFlashWords((prev) => {
						const s = new Set(prev);
						s.delete(wi);
						return s;
					}),
				800,
			);
			setErrorWords((prev) => {
				const s = new Set(prev);
				s.delete(wi);
				return s;
			});
			setSelectedWord(null);
			setInputValue("");
			if ([...allLetters].every((l) => next.has(l))) {
				setResult("win");
				setTimeout(() => onSuccessRef.current?.(), 1800);
			}
		} else {
			// Wrong — partially reveal exact-position matches
			const next = new Set(revealed);
			for (let i = 0; i < Math.min(guess.length, target.length); i++) {
				if (guess[i] === target[i]) next.add(target[i]);
			}
			if (next.size > revealed.size) setRevealed(next);

			// Track letters present somewhere in the word but not yet revealed
			const targetSet = new Set(target);
			setWordHints((prev) => {
				const updated = new Set(prev[selectedWord] ?? []);
				for (const l of guess)
					if (targetSet.has(l) && !next.has(l)) updated.add(l);
				for (const l of updated) if (next.has(l)) updated.delete(l);
				return { ...prev, [selectedWord]: updated };
			});

			const nextWrong = wrongCount + 1;
			setWrongCount(nextWrong);
			setErrorWords((prev) => new Set([...prev, selectedWord]));
			setShakingWord(selectedWord);
			setTimeout(() => setShakingWord(null), 450);
			setInputValue("");

			if ([...allLetters].every((l) => next.has(l))) {
				setResult("win");
				setTimeout(() => onSuccessRef.current?.(), 1800);
				return;
			}
			if (nextWrong >= MAX_WRONG) {
				setResult("lose");
				setTimeout(() => onFailureRef.current?.(), 1800);
			}
		}
	}, [
		selectedWord,
		inputValue,
		puzzle,
		revealed,
		wrongCount,
		result,
		allLetters,
	]);

	// Cipher key sorted by glyph frequency (most common first)
	const sortedUniqueLetters = useMemo(() => {
		const freq: Record<number, number> = {};
		for (const l of puzzle.phrase.replace(/ /g, "")) {
			const g = puzzle.letterToGlyph[l];
			freq[g] = (freq[g] ?? 0) + 1;
		}
		return [...puzzle.uniqueLetters].sort(
			(a, b) =>
				(freq[puzzle.letterToGlyph[b]] ?? 0) -
				(freq[puzzle.letterToGlyph[a]] ?? 0),
		);
	}, [puzzle]);

	const attemptsLeft = MAX_WRONG - wrongCount;
	const timerFrac = timeLeft / TIME_LIMIT_S;
	const timerColor =
		timerFrac > 0.4
			? C.headerLabel
			: timerFrac > 0.2
				? C.timerWarn
				: C.timerCrit;

	return (
		<>
			<style>{`
        @keyframes hack-pulse {
          0%  { box-shadow: 0 0 0 0    rgba(6,182,212,0.35); }
          60% { box-shadow: 0 0 0 10px rgba(6,182,212,0);    }
          100%{ box-shadow: 0 0 0 12px rgba(6,182,212,0);    }
        }
        .icon-pulse { animation: hack-pulse 2.2s cubic-bezier(.25,.1,.25,1) infinite; }
        @keyframes shake {
          0%,100%{ transform:translateX(0); }
          20%    { transform:translateX(-5px); }
          40%    { transform:translateX(5px); }
          60%    { transform:translateX(-3px); }
          80%    { transform:translateX(3px); }
        }
        @keyframes timer-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

			<div
				className="fixed inset-0 z-[3000] flex items-center justify-center select-none"
				style={{ background: "rgba(0,0,0,0.80)" }}
			>
				<div
					className="flex flex-col rounded-xl"
					style={{
						background: C.panelBg,
						border: `1px solid ${C.border}`,
						backdropFilter: "blur(12px)",
						WebkitBackdropFilter: "blur(12px)",
						width: 620,
						maxWidth: "calc(100vw - 32px)",
						maxHeight: "calc(100vh - 48px)",
						overflowY: "auto",
					}}
				>
					{/* Header */}
					<div
						className="flex items-center gap-3 px-5 py-3"
						style={{ borderBottom: `1px solid ${C.border}` }}
					>
						<div
							className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0${phase === "playing" ? " icon-pulse" : ""}`}
							style={{
								border: `1px solid ${C.iconBorder}`,
								background: C.iconBg,
								color: C.iconText,
							}}
						>
							//
						</div>
						<div
							className="text-xs font-semibold uppercase tracking-[0.18em]"
							style={{ color: C.headerLabel }}
						>
							Shelter Registry Hack
						</div>
						<div
							className="ml-auto text-[9px] tracking-[0.08em]"
							style={{ color: C.dimText }}
						>
							#
							{resolvedSeed
								.toString(16)
								.toUpperCase()
								.padStart(6, "0")}
						</div>
					</div>

					{/* ── READY SCREEN ── */}
					{phase === "ready" && (
						<div className="flex flex-col gap-5 px-5 py-5">
							<div
								className="text-[11px] leading-relaxed"
								style={{ color: C.bodyText }}
							>
								A shelter registry system is blocking intake for
								unregistered civilians. Decrypt the intercepted
								access keywords to push through a ghost entry.
							</div>

							<div className="flex flex-col gap-2.5">
								{(
									[
										{
											label: "CLICK",
											col: C.headerLabel,
											text: "Select any encoded word to attempt it.",
										},
										{
											label: "TYPE",
											col: C.headerLabel,
											text: "Enter your full word guess and press Enter.",
										},
										{
											label: "CASCADE",
											col: C.revealedFg,
											text: "A correct guess reveals all matching letters across the entire cipher at once.",
										},
										{
											label: "HINTS",
											col: C.hintFg,
											text: "Wrong guess but some letters exist in that word — they appear as violet badges. No position info, just confirmation they're in there.",
										},
										{
											label: "PARTIAL",
											col: C.revealedFg,
											text: "Letters you guessed in the exact right position are revealed immediately, even on a wrong guess.",
										},
										{
											label: "KEY",
											col: "rgba(251,191,36,0.85)",
											text: "The cipher key shows every letter in the puzzle sorted by frequency. Glyphs stay hidden until revealed — use the letter list to plan your approach.",
										},
										{
											label: "TIMER",
											col: C.timerCrit,
											text: `You have ${formatTime(TIME_LIMIT_S)} to complete the decryption. ${MAX_WRONG} wrong guesses also locks the system.`,
										},
									] as {
										label: string;
										col: string;
										text: string;
									}[]
								).map(({ label, col, text }) => (
									<div
										key={label}
										className="flex items-start gap-2.5"
									>
										<span
											className="text-[10px] font-bold uppercase tracking-[0.14em] flex-shrink-0 pt-0.5"
											style={{ color: col, minWidth: 58 }}
										>
											{label}
										</span>
										<span
											className="text-[11px] leading-snug"
											style={{ color: C.bodyText }}
										>
											{text}
										</span>
									</div>
								))}
							</div>

							<div
								className="h-[3px] w-full rounded-full overflow-hidden"
								style={{ background: "rgba(22,78,99,0.35)" }}
							>
								<div
									className="h-full rounded-full"
									style={{
										width: "40%",
										background: "rgba(6,182,212,0.55)",
									}}
								/>
							</div>

							<button
								onClick={() => setPhase("playing")}
								className="w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.18em] cursor-pointer"
								style={{
									background: C.btnBg,
									border: `1px solid ${C.btnBorder}`,
									color: C.btnText,
								}}
								onMouseEnter={(e) => {
									const b = e.currentTarget;
									b.style.borderColor = C.borderHover;
									b.style.background = "rgba(8,60,72,0.65)";
								}}
								onMouseLeave={(e) => {
									const b = e.currentTarget;
									b.style.borderColor = C.btnBorder;
									b.style.background = C.btnBg;
								}}
							>
								Begin Intrusion
							</button>
						</div>
					)}

					{/* ── PLAYING SCREEN ── */}
					{phase === "playing" && (
						<div className="flex flex-col gap-5 px-5 py-5">
							{/* Timer bar */}
							<div className="flex items-center gap-3">
								<div
									className="flex-1 h-[3px] rounded-full overflow-hidden"
									style={{
										background: "rgba(22,78,99,0.30)",
									}}
								>
									<div
										className="h-full rounded-full"
										style={{
											width: `${(timeLeft / TIME_LIMIT_S) * 100}%`,
											background: timerColor,
											transition:
												"width 1s linear, background 0.5s",
										}}
									/>
								</div>
								<span
									className="text-[11px] font-bold tabular-nums flex-shrink-0"
									style={{
										color: timerColor,
										minWidth: 34,
										textAlign: "right",
										animation:
											timerFrac < 0.2
												? "timer-pulse 0.8s ease-in-out infinite"
												: "none",
									}}
								>
									{formatTime(timeLeft)}
								</span>
							</div>

							{/* Encoded words */}
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 10,
								}}
							>
								{puzzle.words.map((word, wi) => {
									const solved = isWordSolved(wi);
									const isSelected = selectedWord === wi;
									const activeHints = [
										...(wordHints[wi] ?? []),
									]
										.filter((l) => !revealed.has(l))
										.sort();

									return (
										<div
											key={wi}
											style={{
												display: "flex",
												alignItems: "center",
												gap: 10,
											}}
										>
											{/* Word tile */}
											<div
												onClick={() =>
													handleWordClick(wi)
												}
												style={{
													display: "flex",
													gap: 6,
													alignItems: "flex-end",
													padding: "10px 12px",
													borderRadius: 8,
													border: `1px solid ${isSelected ? C.selectedBorder : solved ? C.revealedBorder : errorWords.has(wi) ? C.errorBorder : C.freqBorder}`,
													background: flashWords.has(
														wi,
													)
														? C.flashBg
														: isSelected
															? C.selectedBg
															: solved
																? C.revealedBg
																: C.freqBg,
													cursor: solved
														? "default"
														: "pointer",
													transition:
														"border-color 0.15s, background 0.15s",
													animation:
														shakingWord === wi
															? "shake 0.4s ease"
															: "none",
													flexWrap: "wrap",
													flex: "0 0 auto",
												}}
											>
												{[...word].map((letter, li) => {
													const isRevealed =
														revealed.has(letter);
													return (
														<div
															key={li}
															style={{
																display: "flex",
																flexDirection:
																	"column",
																alignItems:
																	"center",
																gap: 4,
															}}
														>
															<GlyphSVG
																pathIndex={
																	puzzle
																		.letterToGlyph[
																		letter
																	]
																}
																size={28}
																state={
																	isRevealed
																		? "revealed"
																		: isSelected
																			? "selected"
																			: "default"
																}
															/>
															<div
																style={{
																	width: 16,
																	height: 2,
																	borderRadius: 1,
																	background:
																		isRevealed
																			? "rgba(52,211,153,0.70)"
																			: "rgba(22,78,99,0.40)",
																}}
															/>
															<span
																style={{
																	fontSize: 11,
																	fontWeight: 700,
																	minHeight: 14,
																	lineHeight: 1,
																	color: isRevealed
																		? C.revealedFg
																		: "transparent",
																}}
															>
																{isRevealed
																	? letter
																	: "\u00a0"}
															</span>
														</div>
													);
												})}
											</div>

											{/* Hint badges */}
											{activeHints.length > 0 && (
												<div
													style={{
														display: "flex",
														flexDirection: "column",
														gap: 3,
													}}
												>
													<span
														style={{
															fontSize: 8,
															color: C.dimText,
															textTransform:
																"uppercase",
															letterSpacing:
																"0.1em",
														}}
													>
														in word
													</span>
													<div
														style={{
															display: "flex",
															gap: 4,
															flexWrap: "wrap",
														}}
													>
														{activeHints.map(
															(l) => (
																<span
																	key={l}
																	style={{
																		fontSize: 12,
																		fontWeight: 800,
																		fontFamily:
																			"monospace",
																		color: C.hintFg,
																		background:
																			C.hintBg,
																		border: `1px solid ${C.hintBorder}`,
																		borderRadius: 4,
																		padding:
																			"2px 6px",
																		letterSpacing:
																			"0.06em",
																	}}
																>
																	{l}
																</span>
															),
														)}
													</div>
												</div>
											)}
										</div>
									);
								})}
							</div>

							{/* Input row */}
							{selectedWord !== null && !result && (
								<div style={{ display: "flex", gap: 6 }}>
									<input
										ref={inputRef}
										value={inputValue}
										onChange={(e) =>
											setInputValue(
												e.target.value.replace(
													/[^a-zA-Z]/g,
													"",
												),
											)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												submitGuess();
											}
											if (e.key === "Escape") {
												setSelectedWord(null);
												setInputValue("");
											}
										}}
										placeholder={`Word ${selectedWord + 1} of ${puzzle.words.length}…`}
										maxLength={
											puzzle.words[selectedWord].length
										}
										style={{
											flex: 1,
											background: "rgba(4,10,14,0.80)",
											border: `1px solid ${C.inputBorder}`,
											borderRadius: 6,
											color: "rgba(103,232,249,0.90)",
											fontFamily: "monospace",
											fontSize: 13,
											padding: "9px 14px",
											outline: "none",
											textTransform: "uppercase",
										}}
									/>
									<button
										onClick={submitGuess}
										style={{
											background: C.btnBg,
											border: `1px solid ${C.btnBorder}`,
											borderRadius: 6,
											color: C.btnText,
											fontFamily: "monospace",
											fontWeight: 700,
											fontSize: 16,
											padding: "9px 16px",
											cursor: "pointer",
										}}
									>
										↵
									</button>
								</div>
							)}

							{selectedWord === null && !result && (
								<div
									className="text-[10px] text-center tracking-[0.06em]"
									style={{ color: C.dimText }}
								>
									Click a word to begin decryption
								</div>
							)}

							{/* Attempts */}
							<div className="flex justify-between items-center">
								<div className="flex gap-1.5">
									{Array.from({ length: MAX_WRONG }).map(
										(_, i) => (
											<div
												key={i}
												style={{
													width: 9,
													height: 9,
													borderRadius: "50%",
													background:
														i < attemptsLeft
															? "rgba(6,182,212,0.75)"
															: "rgba(22,78,99,0.30)",
												}}
											/>
										),
									)}
								</div>
								<span
									className="text-[10px]"
									style={{ color: C.dimText }}
								>
									{attemptsLeft} attempt
									{attemptsLeft !== 1 ? "s" : ""} left
								</span>
							</div>

							{/* ── Cipher key ────────────────────────────────────────────────
                  Letters always visible (sorted by frequency).
                  The glyph is only revealed once the player has solved that letter —
                  hiding the symbol mapping removes the trivial symbol-matching shortcut.
              ─────────────────────────────────────────────────────────────── */}
							<div
								style={{
									borderTop: `1px solid ${C.border}`,
									paddingTop: 14,
								}}
							>
								<div
									className="text-[10px] uppercase tracking-[0.12em] mb-3"
									style={{ color: C.dimText }}
								>
									Cipher key · {puzzle.uniqueLetters.length}{" "}
									letters in phrase
								</div>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: 6,
									}}
								>
									{sortedUniqueLetters.map((letter) => {
										const known = revealed.has(letter);
										return (
											<div
												key={letter}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													gap: 3,
													padding: "7px 7px",
													borderRadius: 6,
													minWidth: 42,
													background: known
														? "rgba(4,47,29,0.50)"
														: C.freqBg,
													border: `1px solid ${known ? C.revealedBorder : C.freqBorder}`,
												}}
											>
												{/* Glyph: shown only after the letter has been revealed */}
												{known ? (
													<GlyphSVG
														pathIndex={
															puzzle
																.letterToGlyph[
																letter
															]
														}
														size={22}
														state="revealed"
													/>
												) : (
													<div
														style={{
															width: 22,
															height: 22,
															borderRadius: 4,
															border: "1px dashed rgba(22,78,99,0.40)",
															background:
																"rgba(4,10,14,0.50)",
														}}
													/>
												)}
												{/* Letter always visible */}
												<span
													style={{
														fontSize: 13,
														fontWeight: 700,
														minHeight: 16,
														lineHeight: 1,
														letterSpacing: "0.04em",
														color: known
															? C.revealedFg
															: C.bodyText,
													}}
												>
													{letter}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}

					{/* Result banner */}
					{result && (
						<div
							className="px-5 py-3 flex items-center gap-2.5"
							style={{ borderTop: `1px solid ${C.border}` }}
						>
							<div
								className="h-5 w-5 rounded-full border flex items-center justify-center text-[11px] font-bold flex-shrink-0"
								style={{
									borderColor:
										result === "win"
											? C.winBorder
											: C.losBorder,
									background:
										result === "win" ? C.winBg : C.losBg,
									color:
										result === "win"
											? C.winColor
											: C.losColor,
								}}
							>
								{result === "win" ? "✓" : "✕"}
							</div>
							<span
								className="text-xs font-semibold uppercase tracking-[0.18em]"
								style={{
									color:
										result === "win"
											? C.winColor
											: C.losColor,
								}}
							>
								{result === "win"
									? "Access Granted"
									: "System Locked"}
							</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
