"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";

const STORAGE_KEY_VOLUME = "vigilante:volume";

/**
 * Default slider position (0–1) for first visit / reset.
 * Lower = quieter starting point.
 */
const DEFAULT_VOLUME = 0.55;

/**
 * Max output gain at slider = 1 (track is often mastered loud; tune 0.45–0.65).
 */
const PLAYBACK_GAIN_CAP = 0.52;

/**
 * Curve exponent (>1 = quieter at the same slider position, especially low end).
 * Tune ~1.2–1.6.
 */
const PLAYBACK_CURVE_EXPONENT = 1.35;

/** Maps UI slider 0–1 → HTMLAudioElement.volume (0–1). */
function sliderToPlaybackGain(slider: number): number {
	const clamped = Math.min(1, Math.max(0, slider));
	if (clamped <= 0) return 0;
	return Math.pow(clamped, PLAYBACK_CURVE_EXPONENT) * PLAYBACK_GAIN_CAP;
}

/** Public URL for the file in `public/audio/music/background music.ogg` */
export const BACKGROUND_MUSIC_SRC =
	"/audio/music/" + encodeURIComponent("background music.ogg");

type GameAudioContextValue = {
	/** UI slider level 0–1 (0 = silent). Playback uses a curve + gain cap. */
	volume: number;
	setVolume: (value: number) => void;
};

const GameAudioContext = createContext<GameAudioContextValue | null>(null);

export function useGameAudio() {
	const ctx = useContext(GameAudioContext);
	if (!ctx) {
		throw new Error("useGameAudio must be used within GameAudioProvider");
	}
	return ctx;
}

function clampVolume(value: number): number {
	if (Number.isNaN(value)) return DEFAULT_VOLUME;
	return Math.min(1, Math.max(0, value));
}

export function GameAudioProvider({ children }: { children: ReactNode }) {
	const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const setVolume = useCallback((value: number) => {
		setVolumeState(clampVolume(value));
	}, []);

	// Hydrate persisted volume after mount so SSR markup matches first client paint.
	useEffect(() => {
		/* eslint-disable react-hooks/set-state-in-effect -- one-time read from localStorage */
		const raw = localStorage.getItem(STORAGE_KEY_VOLUME);
		if (raw != null) {
			const n = parseFloat(raw);
			if (!Number.isNaN(n)) {
				setVolumeState(clampVolume(n));
			}
		}
		/* eslint-enable react-hooks/set-state-in-effect */
	}, []);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY_VOLUME, String(volume));
		document.documentElement.dataset.muted = volume === 0 ? "1" : "0";
	}, [volume]);

	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;
		el.volume = sliderToPlaybackGain(volume);
	}, [volume]);

	// Autoplay (may be blocked until user interacts — unlock on first pointer)
	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;

		const tryPlay = () => {
			void el.play().catch(() => {});
		};
		tryPlay();

		const unlock = () => {
			tryPlay();
			document.removeEventListener("pointerdown", unlock);
		};
		document.addEventListener("pointerdown", unlock);

		return () => document.removeEventListener("pointerdown", unlock);
	}, []);

	const value: GameAudioContextValue = { volume, setVolume };

	return (
		<GameAudioContext.Provider value={value}>
			<audio
				ref={audioRef}
				src={BACKGROUND_MUSIC_SRC}
				loop
				preload="auto"
				playsInline
				className="hidden"
				aria-hidden
			/>
			{children}
		</GameAudioContext.Provider>
	);
}
