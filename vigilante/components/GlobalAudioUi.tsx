"use client";

import type { ReactNode } from "react";
import { GameAudioProvider } from "../lib/gameAudioContext";

/**
 * Wraps the app with background music.
 */
export default function GlobalAudioUi({ children }: { children: ReactNode }) {
	return (
		<GameAudioProvider>
			{children}
		</GameAudioProvider>
	);
}
