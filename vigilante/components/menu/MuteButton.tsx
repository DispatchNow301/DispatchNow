"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "vigilante:muted";

export default function MuteButton() {
	const [muted, setMuted] = useState(false);

	useEffect(() => {
		setMuted(localStorage.getItem(STORAGE_KEY) === "1");
	}, []);

	useEffect(() => {
		document.documentElement.dataset.muted = muted ? "1" : "0";
		localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
	}, [muted]);

	const toggle = useCallback(() => {
		setMuted((m) => !m);
	}, []);

	return (
		<button
			type="button"
			onClick={toggle}
			className="flex items-center justify-center w-10 h-10 rounded-lg border border-amber-900/40 bg-black/30 text-amber-200/90 hover:bg-amber-950/30 hover:border-amber-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0b] cursor-pointer"
			aria-label={muted ? "Unmute" : "Mute"}
		>
			{muted ? (
				<VolumeX className="w-5 h-5" aria-hidden />
			) : (
				<Volume2 className="w-5 h-5" aria-hidden />
			)}
		</button>
	);
}

