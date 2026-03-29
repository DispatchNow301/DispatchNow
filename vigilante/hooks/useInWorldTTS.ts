"use client";

import { useRef, useCallback, useEffect, useState } from "react";

export type TTSStatus = "idle" | "loading" | "speaking" | "error";

type QueueItem = {
	text: string;
	voiceId: string;
	resolve: () => void;
	reject: (reason?: unknown) => void;
};

type UseInWorldTTSReturn = {
	speak: (text: string, voiceId: string) => Promise<void>;
	stop: () => void;
	preload: () => void;
	status: React.MutableRefObject<TTSStatus>;
	/** True while any line is queued, fetching, or playing */
	isBusy: boolean;
};

/**
 * InWorld AI TTS integration
 * Uses the /api/tts/inworld endpoint which calls InWorld's TTS API
 */
export function useInWorldTTS(): UseInWorldTTSReturn {
	const statusRef = useRef<TTSStatus>("idle");
	const mountedRef = useRef(true);
	const fetchAbortRef = useRef<AbortController | null>(null);
	const queueRef = useRef<QueueItem[]>([]);
	const drainingRef = useRef(false);
	const [busyCount, setBusyCount] = useState(0);

	const bumpBusy = useCallback((delta: number) => {
		setBusyCount((c) => Math.max(0, c + delta));
	}, []);

	const stop = useCallback(() => {
		fetchAbortRef.current?.abort();
		fetchAbortRef.current = null;

		const pending = queueRef.current.splice(0);
		for (const item of pending) {
			item.resolve();
		}

		if (mountedRef.current) statusRef.current = "idle";
	}, []);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			stop();
		};
	}, [stop]);

	const runOne = useCallback(
		async (text: string, voiceId: string, signal: AbortSignal) => {
			if (signal.aborted) {
				throw new DOMException("Aborted", "AbortError");
			}
			if (!mountedRef.current) return;

			statusRef.current = "loading";

			const res = await fetch("/api/tts/inworld", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: text.trim(),
					voiceId,
					modelId: "inworld-tts-1.5-max",
				}),
				signal,
			});

			if (signal.aborted || !mountedRef.current) {
				throw new DOMException("Aborted", "AbortError");
			}

			if (!res.ok) {
				console.warn("[InWorld TTS] API error:", res.status, await res.text());
				if (mountedRef.current) statusRef.current = "error";
				return;
			}

			const blob = await res.blob();
			if (signal.aborted || !mountedRef.current) {
				throw new DOMException("Aborted", "AbortError");
			}

			const url = URL.createObjectURL(blob);
			const audio = new Audio();

			await new Promise<void>((resolve, reject) => {
				if (signal.aborted) {
					URL.revokeObjectURL(url);
					reject(new DOMException("Aborted", "AbortError"));
					return;
				}

				let settled = false;
				const cleanup = () => {
					if (settled) return;
					settled = true;
					signal.removeEventListener("abort", onAbort);
					URL.revokeObjectURL(url);
					if (mountedRef.current) statusRef.current = "idle";
				};

				const onAbort = () => {
					if (settled) return;
					audio.pause();
					audio.removeAttribute("src");
					cleanup();
					reject(new DOMException("Aborted", "AbortError"));
				};

				signal.addEventListener("abort", onAbort, { once: true });

				const finishOk = () => {
					if (settled) return;
					cleanup();
					resolve();
				};

				audio.onended = finishOk;
				audio.onerror = () => {
					if (mountedRef.current) statusRef.current = "error";
					finishOk();
				};

			statusRef.current = "speaking";
			audio.src = url;
			audio.volume = 1.0; // Ensure volume is max
			console.log("[InWorld TTS] Playing audio, volume:", audio.volume, "muted:", audio.muted, "src length:", url);
			void audio.play().then(() => {
				console.log("[InWorld TTS] Audio playback started successfully");
			}).catch((err) => {
				console.warn("[InWorld TTS] play failed:", err);
				if (mountedRef.current) statusRef.current = "error";
				finishOk();
			});
			});
		},
		[]
	);

	const drainQueue = useCallback(async () => {
		if (drainingRef.current) return;
		drainingRef.current = true;
		try {
			while (queueRef.current.length > 0 && mountedRef.current) {
				const item = queueRef.current.shift()!;
				const ac = new AbortController();
				fetchAbortRef.current = ac;
				try {
					await runOne(item.text, item.voiceId, ac.signal);
					item.resolve();
				} catch (err) {
					if (
						err instanceof DOMException &&
						err.name === "AbortError"
					) {
						item.resolve();
					} else {
						item.reject(err);
					}
				} finally {
					if (fetchAbortRef.current === ac) fetchAbortRef.current = null;
				}
			}
		} finally {
			drainingRef.current = false;
		}
	}, [runOne]);

	const speak = useCallback(
		(text: string, voiceId: string) => {
			const trimmed = text.trim();
			if (!trimmed) return Promise.resolve();

			return new Promise<void>((resolve, reject) => {
				bumpBusy(1);
				queueRef.current.push({
					text: trimmed,
					voiceId,
					resolve: () => {
						bumpBusy(-1);
						resolve();
					},
					reject: (e) => {
						bumpBusy(-1);
						reject(e);
					},
				});
				void drainQueue();
			});
		},
		[bumpBusy, drainQueue]
	);

	const preload = useCallback(() => {}, []);

	return {
		speak,
		stop,
		preload,
		status: statusRef,
		isBusy: busyCount > 0,
	};
}
