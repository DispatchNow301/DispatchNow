"use client";

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Shield, Eye, Swords, Brain, HeartPulse } from "lucide-react";

export type VigilanteSheet = {
	id: string;
	name: string;
	alias: string;
	role: string;
	portrait: string | StaticImageData;
	age?: number;
	status?: string;
	heat?: number;
	bio?: string;
	traits?: string[];
	equipment?: string[];
	stats: {
		combat: number;
		stealth: number;
		tactics: number;
		nerve: number;
	};
};

type Props = {
	open: boolean;
	character: VigilanteSheet | null;
	onClose: () => void;
	onDispatch?: (id: string) => void;
};

function StatBar({
	label,
	value,
	icon,
}: {
	label: string;
	value: number;
	icon: React.ReactNode;
}) {
	const width = `${Math.max(0, Math.min(100, value * 10))}%`;

	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-amber-200/65">
				<div className="flex items-center gap-2">
					<span className="text-amber-300/70">{icon}</span>
					<span>{label}</span>
				</div>
				<span>{value}/10</span>
			</div>
			<div className="h-2 overflow-hidden rounded-full bg-black/40 ring-1 ring-amber-900/35">
				<div
					className="h-full rounded-full bg-linear-to-r from-amber-700/80 via-amber-500/75 to-amber-300/80"
					style={{ width }}
				/>
			</div>
		</div>
	);
}

export default function VigilanteDossierCard({
	open,
	character,
	onClose,
	onDispatch,
}: Props) {
	return (
		<AnimatePresence>
			{open && character ? (
				<>
					<motion.div
						className="fixed inset-0 z-[2100] bg-black/50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<div className="fixed inset-0 z-[2110] flex items-center justify-center px-6 py-6 pointer-events-none">
						<motion.aside
							initial={{ opacity: 0, y: 20, scale: 0.985 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.985 }}
							transition={{ duration: 0.22, ease: "easeOut" }}
							className="pointer-events-auto w-[min(42vw,560px)] min-w-[420px] max-h-[88vh] overflow-hidden rounded-2xl border border-amber-900/40 bg-black/70 text-amber-100 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md"
						>
							<div
								className="absolute inset-0 opacity-70"
								aria-hidden
								style={{
									background:
										"radial-gradient(600px circle at 20% 15%, rgba(180,140,80,0.12), transparent 40%), radial-gradient(500px circle at 80% 85%, rgba(120,20,20,0.10), transparent 42%)",
								}}
							/>

							<div className="relative flex h-full max-h-[88vh] flex-col">
								<div className="flex items-start justify-between border-b border-amber-900/30 px-5 py-4">
									<div>
										<div className="text-[11px] uppercase tracking-[0.28em] text-amber-400/70">
											Vigilante Dossier
										</div>
										<h2
											className="mt-2 text-2xl font-bold text-amber-100"
											style={{
												fontFamily: "Georgia, 'Times New Roman', serif",
											}}
										>
											{character.alias}
										</h2>
										<div className="mt-1 text-sm text-amber-200/60">
											{character.name} • {character.role}
										</div>
									</div>

									<button
										type="button"
										onClick={onClose}
										className="rounded-lg border border-amber-900/35 bg-black/30 p-2 text-amber-200/70 transition hover:bg-amber-950/20 hover:text-amber-100"
										aria-label="Close dossier"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<div className="flex-1 overflow-y-auto px-5 py-4 vigilante-hide-scrollbar">
									<div className="grid grid-cols-[132px_1fr] gap-4">
										<div className="relative h-[172px] overflow-hidden rounded-xl border border-amber-900/35 bg-black/20">
											<Image
												src={character.portrait}
												alt={character.alias}
												fill
												className="object-cover object-center brightness-100 contrast-100 saturate-100"
												sizes="172px"
												unoptimized
											/>
										</div>

										<div className="space-y-3">
											<div className="flex flex-wrap gap-2">
												{character.status ? (
													<span className="rounded-full border border-amber-900/35 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-amber-200/75">
														{character.status}
													</span>
												) : null}
												{typeof character.heat === "number" ? (
													<span className="rounded-full border border-red-900/35 bg-red-950/20 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-red-300/75">
														Heat {character.heat}
													</span>
												) : null}
												{typeof character.age === "number" ? (
													<span className="rounded-full border border-amber-900/35 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-amber-200/75">
														Age {character.age}
													</span>
												) : null}
											</div>

											<p className="text-sm leading-6 text-amber-100/78">
												{character.bio ?? "No dossier notes entered yet."}
											</p>
										</div>
									</div>

									<div className="mt-6 space-y-4">
										<StatBar
											label="Combat"
											value={character.stats.combat}
											icon={<Swords className="h-3.5 w-3.5" />}
										/>
										<StatBar
											label="Stealth"
											value={character.stats.stealth}
											icon={<Eye className="h-3.5 w-3.5" />}
										/>
										<StatBar
											label="Tactics"
											value={character.stats.tactics}
											icon={<Brain className="h-3.5 w-3.5" />}
										/>
										<StatBar
											label="Nerve"
											value={character.stats.nerve}
											icon={<HeartPulse className="h-3.5 w-3.5" />}
										/>
									</div>

									<div className="mt-6 grid gap-4">
										<div className="rounded-xl border border-amber-900/30 bg-black/25 p-4">
											<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
												Traits
											</div>
											<div className="mt-3 flex flex-wrap gap-2">
												{(character.traits ?? []).length > 0 ? (
													character.traits?.map((trait) => (
														<span
															key={trait}
															className="rounded-full border border-amber-900/30 bg-black/30 px-3 py-1 text-xs text-amber-100/80"
														>
															{trait}
														</span>
													))
												) : (
													<span className="text-sm text-amber-200/45">
														No listed traits.
													</span>
												)}
											</div>
										</div>

										<div className="rounded-xl border border-amber-900/30 bg-black/25 p-4">
											<div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
												<Shield className="h-3.5 w-3.5" />
												Equipment
											</div>
											<ul className="mt-3 space-y-2 text-sm text-amber-100/75">
												{(character.equipment ?? []).length > 0 ? (
													character.equipment?.map((item) => (
														<li key={item}>• {item}</li>
													))
												) : (
													<li className="text-amber-200/45">
														No recorded equipment.
													</li>
												)}
											</ul>
										</div>
									</div>
								</div>

								<div className="border-t border-amber-900/30 px-5 py-4">
									<div className="flex items-center justify-between gap-3">
										<button
											type="button"
											onClick={onClose}
											className="rounded-xl border border-amber-900/35 bg-black/30 px-4 py-3 text-sm text-amber-200/80 transition hover:bg-amber-950/20"
										>
											Close File
										</button>

										<button
											type="button"
											onClick={() => {
												onClose();
												onDispatch?.(character.id);
											}}
											className="rounded-xl border border-amber-700/40 bg-amber-950/30 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-900/35"
										>
											Hire Vigilante
										</button>
									</div>
								</div>
							</div>
						</motion.aside>
					</div>
				</>
			) : null}
		</AnimatePresence>
	);
}