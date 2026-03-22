"use client";

import type { ReactNode } from "react";
import { GameAudioProvider } from "../lib/gameAudioContext";
import AudioControlsPopover from "./menu/AudioControlsPopover";

/**
 * Wraps the app with background music and pins the sound control top-right
 * (slider opens to the left of the button).
 */
export default function GlobalAudioUi({ children }: { children: ReactNode }) {
	return (
		<GameAudioProvider>
			{children}
			<div className="fixed top-4 right-4 z-10050 pointer-events-auto">
				<AudioControlsPopover />
			</div>
		</GameAudioProvider>
	);
}
