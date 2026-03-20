"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type CharacterLike = {
	id: string;
	name: string;
	alias: string;
	role: string;
	portrait: string;
	age?: number;
	joinedAt?: string;
	backgroundNote?: string;
	traits?: string[];
	bio?: string;
	isUndercover?: boolean;
	trueIdentity?: string;
};

type Props = {
	open: boolean;
	character: CharacterLike | null;
	onClose: () => void;
	onApprove: () => void;
	onReject: () => void;
};

type VettingDocs = {
	idCard: {
		legalName: string;
		alias: string;
		role: string;
		age: string;
		issueDistrict: string;
		showVerifiedCopy: boolean;
		photo: string;
	};
	intakeSheet: {
		alias: string;
		joinedAt: string;
		background: string;
		referral: string;
		notes: string;
	};
};

function buildDocs(character: CharacterLike): VettingDocs {
	const base: VettingDocs = {
		idCard: {
			legalName: character.name,
			alias: character.alias,
			role: character.role,
			age: character.age ? String(character.age) : "Unknown",
			issueDistrict: "South Precinct Registry",
			showVerifiedCopy: true,
			photo: character.portrait,
		},
		intakeSheet: {
			alias: character.alias,
			joinedAt: character.joinedAt ?? "Joined recently",
			background: character.backgroundNote ?? "Background not provided.",
			referral: "Street referral",
			notes: character.bio ?? "No notes.",
		},
	};

	if (!character.isUndercover) return base;

	switch (character.id) {
		case "marcus":
			return {
				idCard: {
					...base.idCard,
					showVerifiedCopy: false,
				},
				intakeSheet: {
					...base.intakeSheet,
				},
			};

		case "robin":
			return {
				idCard: {
					...base.idCard,
				},
				intakeSheet: {
					...base.intakeSheet,
					background:
						"Claims prior work with the Larks and the East Lantern Crew. No corroboration found.",
				},
			};

		case "tom":
			return {
				idCard: {
					...base.idCard,
					photo: "/characters/FakeTom.png",
				},
				intakeSheet: {
					...base.intakeSheet,
				},
			};

		case "familiar-face":
			return {
				idCard: {
					...base.idCard,
				},
				intakeSheet: {
					...base.intakeSheet,
					notes:
						"He showed an interest in the crew itself not our cause. Notes feel too perfect, almost as if they were designed specifically for this.",
				},
			};

		default:
			return base;
	}
}

function PaperField({
	label,
	value,
	compact = false,
}: {
	label: string;
	value: string;
	compact?: boolean;
}) {
	return (
		<div className={compact ? "space-y-1" : "space-y-1.5"}>
			<div className="text-[10px] uppercase tracking-[0.22em] text-[#4e4029]/70">
				{label}
			</div>
			<div
				className={[
					"rounded-sm border border-black/10 bg-black/[0.035] px-2.5 py-2 text-[#241c12]",
					compact ? "text-xs leading-5" : "text-sm leading-6",
				].join(" ")}
			>
				{value}
			</div>
		</div>
	);
}

export default function VettingMinigameModal({
	open,
	character,
	onClose,
	onApprove,
	onReject,
}: Props) {
	const docs = character ? buildDocs(character) : null;

	return (
		<AnimatePresence>
			{open && character && docs ? (
				<>
					<motion.div
						className="absolute inset-0 z-[2600] bg-black/60"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<motion.div
						initial={{ opacity: 0, y: 18, scale: 0.985 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.985 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="absolute right-[4vw] top-1/2 z-[2610] w-[min(64vw,1180px)] min-w-[980px] -translate-y-1/2 overflow-hidden rounded-2xl border border-amber-900/35 bg-[#0f0c09]/95 text-amber-100 shadow-[0_24px_90px_rgba(0,0,0,0.62)] backdrop-blur-md"
					>
						<div className="flex items-start justify-between border-b border-amber-900/25 px-6 py-4">
							<div>
								<div className="text-[11px] uppercase tracking-[0.3em] text-amber-400/65">
									Vetting Desk
								</div>
								<div className="mt-2 text-2xl font-bold text-amber-100">
									Applicant Verification
								</div>
								<div className="mt-1 text-sm text-amber-200/55">
									Check the recruit dossier against submitted paperwork before approving.
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								className="rounded-lg border border-amber-900/35 bg-black/30 p-2 text-amber-200/70 hover:bg-amber-950/20 hover:text-amber-100 transition"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<div className="grid grid-cols-[360px_1fr] gap-5 p-6">
							<div className="rounded-2xl border border-[#8f7447]/35 bg-[#d8c29a] px-5 py-5 text-[#241c12] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
								<div className="mb-4 flex items-start justify-between">
									<div>
										<div className="text-[11px] uppercase tracking-[0.24em] text-[#5c4b30]/70">
											Identification Card
										</div>
										<div className="mt-1 text-lg font-bold text-[#1e1710]">
											City Registry Access Pass
										</div>
									</div>
									{docs.idCard.showVerifiedCopy ? (
										<div className="rounded-md border border-black/10 bg-black/[0.05] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#5c4b30]">
											Verified Copy
										</div>
									) : null}
								</div>

								<div className="mb-4 flex items-start gap-4">
									<div className="relative h-[112px] w-[86px] overflow-hidden rounded-md border border-black/10 bg-black/[0.06]">
										<Image
											src={docs.idCard.photo}
											alt={character.alias}
											fill
											className="object-cover object-center"
											sizes="86px"
										/>
									</div>

									<div className="min-w-0 flex-1 space-y-3">
										<PaperField label="Legal Name" value={docs.idCard.legalName} compact />
										<PaperField label="Registered Alias" value={docs.idCard.alias} compact />
									</div>
								</div>

								<div className="space-y-3">
									<PaperField label="Role" value={docs.idCard.role} compact />
									<PaperField label="Age" value={docs.idCard.age} compact />
									<PaperField label="Issuing District" value={docs.idCard.issueDistrict} compact />
								</div>

								<div className="mt-4 border-t border-black/10 pt-3 text-[10px] uppercase tracking-[0.2em] text-[#5c4b30]/70">
									Keep visible while cross-checking.
								</div>
							</div>

							<div className="rounded-2xl border border-[#8f7447]/35 bg-[#eadab8] px-5 py-5 text-[#241c12] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
								<div className="mb-4 flex items-start justify-between">
									<div>
										<div className="text-[11px] uppercase tracking-[0.24em] text-[#5c4b30]/70">
											Recruit Intake Sheet
										</div>
										<div className="mt-1 text-lg font-bold text-[#1e1710]">
											Field Admission Record
										</div>
									</div>
									<div className="rounded-md border border-black/10 bg-black/[0.05] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#5c4b30]">
										Intake Office
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<PaperField label="Filed Alias" value={docs.intakeSheet.alias} />
									<PaperField label="Joined" value={docs.intakeSheet.joinedAt} />
								</div>

								<div className="mt-3 grid grid-cols-2 gap-3">
									<PaperField label="Referral Source" value={docs.intakeSheet.referral} />
									<PaperField label="Background Summary" value={docs.intakeSheet.background} />
								</div>

								<div className="mt-3">
									<PaperField label="Intake Notes" value={docs.intakeSheet.notes} />
								</div>

								<div className="mt-4 border-t border-black/10 pt-3 text-[10px] uppercase tracking-[0.2em] text-[#5c4b30]/70">
									Compare against dossier details before clearing hire.
								</div>
							</div>
						</div>

						<div className="border-t border-amber-900/25 px-6 py-4">
							<div className="mb-3 text-xs text-amber-200/55">
								The dossier on the left stays visible. Look for inconsistencies in aliases, dates, ages, and background details.
							</div>

							<div className="flex items-center justify-between gap-3">
								<button
									type="button"
									onClick={onReject}
									className="rounded-xl border border-red-900/35 bg-red-950/20 px-5 py-3 text-sm font-semibold text-red-200/85 hover:bg-red-950/30 transition"
								>
									Flag Applicant
								</button>

								<div className="flex items-center gap-3">
									<button
										type="button"
										onClick={onClose}
										className="rounded-xl border border-amber-900/35 bg-black/30 px-4 py-3 text-sm text-amber-200/80 hover:bg-amber-950/20 transition"
									>
										Back
									</button>
									<button
										type="button"
										onClick={onApprove}
										className="rounded-xl border border-amber-700/40 bg-amber-950/30 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-900/35 transition"
									>
										Clear For Hire
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				</>
			) : null}
		</AnimatePresence>
	);
}