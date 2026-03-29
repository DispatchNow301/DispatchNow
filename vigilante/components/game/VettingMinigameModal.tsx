"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Shield } from "lucide-react";
import { IncidentTimerBar } from "./IncidentTimerBar";

type CharacterLike = {
	id: string;
	name: string;
	alias: string;
	role: string;
	portrait: string;
	age?: number;
	status?: string;
	joinedAt?: string;
	backgroundNote?: string;
	bio?: string;
	isUndercover?: boolean;
	trueIdentity?: string;
	stats?: {
		strength: number;
		intelligence: number;
		speed: number;
	};
};

type Props = {
	open: boolean;
	character: CharacterLike | null;
	createdAt: number | null;
	expiresAt: number | null;
	timeLeftMs: number;
	onExpire: () => void;
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

function getGeneratedDocs(character: CharacterLike) {
	switch (character.id) {
		case "adam":
			return {
				background:
					"Independent infiltrator known for entry work, rooftop movement, and bypassing locked service routes. Previously operated alone on short reconnaissance and retrieval jobs.",
				notes:
					"Applicant presents as quiet and self-contained. Answers were sparse but internally consistent. Showed familiarity with physical entry methods and low-visibility movement. Did not ask many questions beyond gear access and safe approach routes.",
				referral: "North Block intermediary",
			};

		case "kevin":
			return {
				background:
					"Former contract protection worker with experience in escort, perimeter control, and civilian extraction. Left private security after repeated disputes over employer conduct.",
				notes:
					"Applicant remained calm throughout intake and spoke in a direct, professional way. Emphasized reliability over spectacle. Demonstrated practical judgment about when to hold ground and when to pull back. Reads as experienced and difficult to rattle.",
				referral: "Old transit contact",
			};

		case "jen":
			return {
				background:
					"Background tied to nightlife logistics, courier favors, and informal information trading between venues and neighborhood crews. Known for reading people quickly and moving comfortably across social lines.",
				notes:
					"Applicant is personable without oversharing. Displayed strong awareness of rumor flow, crowd behavior, and informal neighborhood networks. Appears confident in mixed environments and likely useful for soft-contact work. No obvious inconsistency surfaced during intake.",
				referral: "Club district source",
			};

		case "iris":
			return {
				background:
					"Former lookout and runner with a reputation for stable judgment under pressure. Has prior experience tracking exits, monitoring approach paths, and supporting small field teams.",
				notes:
					"Applicant gave measured answers and never rushed a response. Showed a strong habit of thinking in terms of escape routes and fallback positions. Comes across as patient, careful, and dependable in overheated situations. Would likely reinforce discipline on field calls.",
				referral: "Dockside neighborhood lead",
			};

		case "bruce":
			return {
				background:
					"Veteran of protection work and neighborhood defense, with years spent around armed escorts and block-level enforcement. Known for stepping in when civilians were being leaned on by stronger groups.",
				notes:
					"Applicant was blunt, confident, and physically imposing from the start. Framed his role as keeping people standing when everything else breaks down. Not subtle, but clearly experienced and committed once he chooses a side. Strong presence and high tolerance for pressure.",
				referral: "Direct approach to homebase",
			};

		case "zonaka":
			return {
				background:
					"Solo disruptor associated with reconnaissance, sabotage, and mobility-heavy street work. Limited formal history, but multiple mentions describe fast adaptation and unconventional methods.",
				notes:
					"Applicant showed style and confidence without losing track of specifics. Spoke fluently about misdirection, route pressure, and exploiting weak points in a response. Feels creative rather than reckless. Likely valuable when a mission needs flexibility instead of force.",
				referral: "Encrypted channel tip",
			};

		case "ashley":
			return {
				background:
					"Courier and movement specialist with prior experience transporting people and supplies through unstable zones. Record suggests repeated work under time pressure and limited support.",
				notes:
					"Applicant came across as energetic and highly reactive. Described a preference for acting decisively before hesitation can spread through a team. Still rough around the edges in planning, but clearly capable in urgent conditions. Would fit best where speed matters more than polish.",
				referral: "East corridor runner",
			};

		case "z":
			return {
				background:
					"Subject has no verified civic history under this alias. Fragmented reports place a masked vigilante matching the description at several unresolved street interventions over multiple years.",
				notes:
					"Applicant revealed almost nothing beyond operational basics. Avoided personal history and redirected questions toward capability, access, and mission structure. Despite the silence, the demeanor was controlled rather than evasive in a panicked way. File remains thin, but field reputation appears genuine.",
				referral: "Unsolicited appearance",
			};

		case "parya":
			return {
				background:
					"Independent watcher, courier, and fixer with a long-running reputation for surveillance support and route intelligence. Past mentions consistently describe strong observational discipline and self-sufficiency.",
				notes:
					"Applicant was reserved but highly attentive during intake. Asked focused questions about infrastructure, intel flow, and fallback coordination rather than status or pay. Appears comfortable working alone, yet open to structure when it improves mission odds. Strong signs of judgment and patience.",
				referral: "Foundational member contact",
			};

		case "marcus":
			return {
				background:
					"Claims freelance security and convoy work across state lines, mostly short contracts with irregular crews. Records are sparse and supporting names remain difficult to verify.",
				notes:
					"Applicant was concise and physically composed throughout intake. Spoke like someone familiar with procedural environments but offered very little color around previous teams. Presented useful field instincts and kept eye contact steady. Overall file is workable, though thinner than ideal.",
				referral: "Walk-in recruitment lead",
			};

		case "robin":
			return {
				background:
					"States she relocated after the breakup of a smaller out-of-town crew and has since been operating independently. Claims light courier, lookout, and support experience under shifting aliases and contacts.",
				notes:
					"Applicant was calm and cooperative, but overly interested in active crew names and current roster makeup. Story remained smooth even when pressed, though outside names offered during intake do not fully line up. Recent arrival and thin verification make the file worth a second look. Nothing else stands out immediately.",
				referral: "Street referral",
			};

		case "tom":
			return {
				background:
					"Former warehouse guard and low-visibility contract hand with a clean employment timeline and few disciplinary marks. Claims to prefer support work, route checks, and quiet perimeter coverage.",
				notes:
					"Applicant was controlled, patient, and easy to process. Answers arrived without hesitation and remained neatly aligned across the interview. Little emotional leakage, little wasted speech. Overall presentation is orderly and believable.",
				referral: "West side contact",
			};

		case "familiar-face":
			return {
				background:
					"Former investigator on private insurance fraud matters, later shifting into freelance fact-check and background work. Paper trail is coherent and the stated work history scans as functional.",
				notes:
					"He showed an interest in the crew itself not our cause. Asked unusually specific questions about structure, communication, and internal trust instead of neighborhood conditions. The field admission record reads too perfect, almost as if it were designed specifically for this. Nothing is plainly wrong, but the tone of the file feels assembled rather than lived in.",
				referral: "Private introduction",
			};

		default:
			return {
				background:
					"Applicant reports prior independent activity with enough field exposure to justify recruitment consideration. Supporting context is limited but broadly plausible.",
				notes:
					"Intake completed without major contradiction. Applicant appears field-capable and reasonably composed. Further observation recommended after first assignment. No immediate disqualifier noted.",
				referral: "General intake",
			};
	}
}

function buildDocs(character: CharacterLike): VettingDocs {
	const generated = getGeneratedDocs(character);

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
			background: generated.background,
			referral: generated.referral,
			notes: generated.notes,
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

function StatCard({
	label,
	value = 0,
}: {
	label: string;
	value?: number;
}) {
	return (
		<div className="rounded-xl border border-amber-900/30 bg-black/25 p-3">
			<div className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70">
				{label}
			</div>
			<div className="mt-2 text-lg font-bold text-amber-100">
				{value}/10
			</div>
		</div>
	);
}

function formatCountdown(ms: number) {
	const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes > 0) {
		return `${minutes}:${String(seconds).padStart(2, "0")}`;
	}
	return `${seconds}s`;
}

export default function VettingMinigameModal({
	open,
	character,
	createdAt,
	expiresAt,
	timeLeftMs,
	onExpire,
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
						className="fixed inset-0 z-[2600] bg-black/60"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<div className="fixed inset-0 z-[2610] flex items-center justify-center px-6 py-6 pointer-events-none">
						<motion.div
							initial={{ opacity: 0, y: 18, scale: 0.985 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.985 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="pointer-events-auto flex w-[min(94vw,1680px)] max-h-[88vh] items-stretch gap-5"
						>
							{/* duplicate dossier, shown beside minigame */}
							<div className="w-[440px] shrink-0 overflow-hidden rounded-2xl border border-amber-900/40 bg-black/72 text-amber-100 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md">
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
													fontFamily:
														"Georgia, 'Times New Roman', serif",
												}}
											>
												{character.alias}
											</h2>
											<div className="mt-1 text-sm text-amber-200/60">
												{character.name} • {character.role}
											</div>
										</div>
									</div>

									<div className="flex-1 overflow-y-auto px-5 py-4 vigilante-hide-scrollbar">
										<div className="grid grid-cols-[132px_1fr] gap-4">
											<div className="relative h-[172px] overflow-hidden rounded-xl border border-amber-900/35 bg-black/20">
												<Image
													src={character.portrait}
													alt={character.alias}
													fill
													className="object-contain object-center"
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

										<div className="mt-6 grid grid-cols-3 gap-3">
											<StatCard
												label="Strength"
												value={character.stats?.strength ?? 0}
											/>
											<StatCard
												label="Intelligence"
												value={character.stats?.intelligence ?? 0}
											/>
											<StatCard
												label="Speed"
												value={character.stats?.speed ?? 0}
											/>
										</div>

									</div>
								</div>
							</div>

							{/* vetting desk */}
							<div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-amber-900/35 bg-[#0f0c09]/95 text-amber-100 shadow-[0_24px_90px_rgba(0,0,0,0.62)] backdrop-blur-md">
								<div className="flex h-full max-h-[88vh] flex-col">
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
											className="rounded-lg border border-amber-900/35 bg-black/30 p-2 text-amber-200/70 transition hover:bg-amber-950/20 hover:text-amber-100"
										>
											<X className="h-4 w-4" />
										</button>
									</div>

									{createdAt && expiresAt ? (
										<div className="border-b border-amber-900/20 px-6 py-4">
											<div className="rounded-xl border border-red-900/35 bg-red-950/15 px-4 py-3">
												<div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-red-200/80">
													<span>Applicant availability</span>
													<span>{formatCountdown(timeLeftMs)}</span>
												</div>
												<IncidentTimerBar
													createdAt={createdAt}
													expiresAt={expiresAt}
													onExpire={onExpire}
												/>
											</div>
										</div>
									) : null}

									<div className="flex-1 overflow-y-auto p-6">
										<div className="grid grid-cols-[360px_1fr] gap-5">
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
													<div className="relative h-[112px] w-[86px] overflow-hidden rounded-md border border-black/10 bg-transparent">
														<Image
															src={docs.idCard.photo}
															alt={character.alias}
															fill
															className="object-contain object-center"
															sizes="86px"
															unoptimized
														/>
													</div>

													<div className="min-w-0 flex-1 space-y-3">
														<PaperField
															label="Legal Name"
															value={docs.idCard.legalName}
															compact
														/>
														<PaperField
															label="Registered Alias"
															value={docs.idCard.alias}
															compact
														/>
													</div>
												</div>

												<div className="space-y-3">
													<PaperField label="Role" value={docs.idCard.role} compact />
													<PaperField label="Age" value={docs.idCard.age} compact />
													<PaperField
														label="Issuing District"
														value={docs.idCard.issueDistrict}
														compact
													/>
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
													<PaperField
														label="Referral Source"
														value={docs.intakeSheet.referral}
													/>
													<PaperField
														label="Background Summary"
														value={docs.intakeSheet.background}
													/>
												</div>

												<div className="mt-3">
													<PaperField
														label="Intake Notes"
														value={docs.intakeSheet.notes}
													/>
												</div>

												<div className="mt-4 border-t border-black/10 pt-3 text-[10px] uppercase tracking-[0.2em] text-[#5c4b30]/70">
													Compare against dossier details before clearing hire.
												</div>
											</div>
										</div>
									</div>

									<div className="border-t border-amber-900/25 px-6 py-4">
										<div className="mb-3 text-xs text-amber-200/55">
											The dossier stays visible while you review the submitted paperwork.
										</div>

										<div className="flex items-center justify-between gap-3">
											<button
												type="button"
												onClick={onReject}
												className="rounded-xl border border-red-900/35 bg-red-950/20 px-5 py-3 text-sm font-semibold text-red-200/85 transition hover:bg-red-950/30"
											>
												Flag Applicant
											</button>

											<div className="flex items-center gap-3">
												<button
													type="button"
													onClick={onClose}
													className="rounded-xl border border-amber-900/35 bg-black/30 px-4 py-3 text-sm text-amber-200/80 transition hover:bg-amber-950/20"
												>
													Back
												</button>
												<button
													type="button"
													onClick={onApprove}
													className="rounded-xl border border-amber-700/40 bg-amber-950/30 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-900/35"
												>
													Clear For Hire
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			) : null}
		</AnimatePresence>
	);
}