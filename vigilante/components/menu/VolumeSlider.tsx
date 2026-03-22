"use client";

import { useGameAudio } from "../../lib/gameAudioContext";

export const VOLUME_SLIDER_INPUT_ID = "vigilante-music-volume";

export default function VolumeSlider() {
	const { volume, setVolume } = useGameAudio();
	const pct = Math.round(volume * 100);

	/** Track fill — matches menu amber / black glass (border-amber-900/50, amber-200 accents) */
	const trackFill = `linear-gradient(to right, 
		rgb(251 191 36 / 0.55) 0%, 
		rgb(245 158 11 / 0.45) ${pct}%, 
		rgb(0 0 0 / 0.38) ${pct}%, 
		rgb(0 0 0 / 0.32) 100%)`;

	return (
		<div className="flex h-full min-h-0 w-[5.5rem] items-center sm:w-[6rem]">
			<label htmlFor={VOLUME_SLIDER_INPUT_ID} className="sr-only">
				Music volume
			</label>
			<div className="relative flex h-full w-full items-center">
				<input
					id={VOLUME_SLIDER_INPUT_ID}
					type="range"
					min={0}
					max={1}
					step={0.01}
					value={volume}
					onChange={(e) => setVolume(Number(e.target.value))}
					style={{ background: trackFill }}
					className="h-1 w-full cursor-pointer appearance-none rounded-full
						transition-[box-shadow,background] duration-200 ease-out
						shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)]
						focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/45 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0a0b]
						[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2
						[&::-webkit-slider-thumb]:-mt-[2px] [&::-webkit-slider-thumb]:rounded-full
						[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-amber-700/45
						[&::-webkit-slider-thumb]:bg-amber-200/85 [&::-webkit-slider-thumb]:shadow-[0_1px_2px_rgba(0,0,0,0.35)]
						[&::-webkit-slider-thumb]:transition-[transform,box-shadow] [&::-webkit-slider-thumb]:duration-200
						[&::-webkit-slider-thumb]:hover:scale-105 [&::-webkit-slider-thumb]:hover:border-amber-600/50
						[&::-webkit-slider-thumb]:active:scale-100
						[&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:rounded-full
						[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-amber-700/45
						[&::-moz-range-thumb]:bg-amber-200/85 [&::-moz-range-thumb]:shadow-[0_1px_2px_rgba(0,0,0,0.35)]
						[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={pct}
				/>
			</div>
		</div>
	);
}
