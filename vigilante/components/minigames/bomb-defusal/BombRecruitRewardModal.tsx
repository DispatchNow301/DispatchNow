"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Gift, UserPlus, X } from "lucide-react";
import { vigilantes, type VigilanteSheet } from "@/app/components/data/vigilante";

type BombRecruitRewardModalProps = {
	open: boolean;
	incidentId: string | null;
	ownedVigilanteIds: string[];
	onClose: () => void;
	onConfirm: (vigilanteId: string) => void;
};

function hashString(input: string) {
	let hash = 0;
	for (let i = 0; i < input.length; i += 1) {
		hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
	}
	return hash;
}

// Pick a stable reward candidate for the same bomb incident.
function pickStableRewardVigilante(
	incidentId: string,
	candidates: VigilanteSheet[],
): VigilanteSheet | null {
	if (candidates.length === 0) return null;
	const seed = hashString(incidentId);
	return candidates[seed % candidates.length] ?? null;
}

function statRow(label: string, value: number) {
	return (
		<div className="flex items-center justify-between rounded-md border border-amber-900/30 bg-black/25 px-3 py-2">
			<span className="text-xs uppercase tracking-[0.18em] text-amber-400/70">
				{label}
			</span>
			<span className="text-sm font-semibold text-amber-100">{value}</span>
		</div>
	);
}

export default function BombRecruitRewardModal({
	open,
	incidentId,
	ownedVigilanteIds,
	onClose,
	onConfirm,
}: BombRecruitRewardModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!open) {
			setIsSubmitting(false);
		}
	}, [open]);

	const availableCandidates = useMemo(
		() => vigilantes.filter((v) => !ownedVigilanteIds.includes(v.id)),
		[ownedVigilanteIds],
	);

	const rewardVigilante = useMemo(() => {
		if (!incidentId) return null;
		return pickStableRewardVigilante(incidentId, availableCandidates);
	}, [availableCandidates, incidentId]);

	if (!open || !incidentId) return null;

	const handleConfirm = () => {
		if (!rewardVigilante || isSubmitting) return;
		setIsSubmitting(true);
		onConfirm(rewardVigilante.id);
	};

	return (
		<div
			className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/80 px-4"
			role="dialog"
			aria-modal="true"
			aria-label="Bomb recruit reward"
			onClick={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-900/40 bg-[#0d0c0e] shadow-2xl shadow-black/60">
				<div className="flex items-center justify-between border-b border-amber-900/30 px-5 py-4">
					<div>
						<div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
							<Gift className="h-4 w-4" />
							Bomb Defusal Reward
						</div>
						<h2
							className="mt-2 text-2xl font-bold tracking-tight text-amber-100"
							style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
						>
							Recruit Opportunity
						</h2>
						<p className="mt-2 text-sm text-amber-200/65">
							Bomb Defusal was completed successfully. You can recruit one new vigilante now.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-amber-900/40 bg-black/25 p-2 text-amber-200/70 transition hover:border-amber-700/40 hover:bg-amber-950/20 hover:text-amber-100"
						aria-label="Close reward modal"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="p-5">
					{rewardVigilante ? (
						<div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
							<div className="overflow-hidden rounded-xl border border-amber-900/35 bg-black/30">
								<div className="relative aspect-[3/4] w-full bg-black/20">
									<Image
										src={rewardVigilante.portrait}
										alt={rewardVigilante.alias}
										fill
										className="object-cover"
									/>
								</div>
							</div>

							<div className="flex min-h-full flex-col">
								<div>
									<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
										Reward Candidate
									</div>
									<h3 className="mt-2 text-2xl font-bold text-amber-100">
										{rewardVigilante.alias}
									</h3>
									<div className="mt-1 text-sm text-amber-200/60">
										{rewardVigilante.name} • {rewardVigilante.role}
									</div>

									<p className="mt-4 text-sm leading-6 text-amber-200/75">
										{rewardVigilante.bio ??
											"A new vigilante contact is ready to join after the successful operation."}
									</p>
								</div>

								<div className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)]">
									{statRow("Strength", rewardVigilante.stats.strength)}
									{statRow("Intelligence", rewardVigilante.stats.intelligence)}
									{statRow("Speed", rewardVigilante.stats.speed)}
								</div>

								<div className="mt-5 rounded-lg border border-amber-900/30 bg-black/25 px-4 py-3 text-sm text-amber-200/70">
									Confirming this reward will add the vigilante directly to your roster.
								</div>

								<div className="mt-auto flex gap-3 pt-6">
									<button
										type="button"
										onClick={onClose}
										className="flex-1 rounded-lg border border-amber-900/40 bg-black/25 px-4 py-3 text-sm text-amber-200/80 transition hover:bg-amber-950/20 hover:text-amber-100"
									>
										Close
									</button>

									<button
										type="button"
										onClick={handleConfirm}
										disabled={isSubmitting}
										className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-900/40 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<UserPlus className="h-4 w-4" />
										Recruit Vigilante
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="rounded-xl border border-amber-900/30 bg-black/25 px-5 py-8 text-center">
							<div className="text-lg font-semibold text-amber-100">
								No Recruit Reward Available
							</div>
							<p className="mt-3 text-sm leading-6 text-amber-200/70">
								All currently available vigilantes are already owned.
							</p>
							<div className="mt-6">
								<button
									type="button"
									onClick={onClose}
									className="rounded-lg border border-amber-900/40 bg-black/25 px-4 py-3 text-sm text-amber-200/80 transition hover:bg-amber-950/20 hover:text-amber-100"
								>
									Close
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
