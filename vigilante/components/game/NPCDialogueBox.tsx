"use client";

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export type DialogueSpeaker = {
  id: string;
  name: string;
  role: "Citizen" | "Police" | "Chief" | "Dispatcher" | "Unknown";
  portrait: string | StaticImageData;
};

type Props = {
  open: boolean;
  speaker: DialogueSpeaker | null;
  text: string;
  onClose?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  position?: "bottom-left" | "bottom-center";
};

export default function NPCDialogueBox({
  open,
  speaker,
  text,
  onClose,
  onNext,
  nextLabel = "Continue",
  position = "bottom-left",
}: Props) {
  const positionClass =
    position === "bottom-center"
      ? "left-1/2 -translate-x-1/2 bottom-6"
      : "left-6 bottom-6";

  return (
    <AnimatePresence>
      {open && speaker ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute z-[130] ${positionClass} w-[min(52vw,720px)] min-w-[320px]`}
        >
          <div className="overflow-hidden rounded-2xl border border-amber-900/40 bg-black/75 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-md">
            <div className="flex items-stretch">
              <div className="relative h-[160px] w-[132px] shrink-0 border-r border-amber-900/30 bg-black/30">
                <Image
                  src={speaker.portrait}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                  sizes="132px"
                />
              </div>

              <div className="flex min-h-[160px] flex-1 flex-col justify-between px-5 py-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
                    {speaker.role}
                  </div>
                  <div
                    className="mt-1 text-xl font-bold text-amber-100"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {speaker.name}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-amber-100/80">
                    {text}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-amber-900/35 bg-black/25 px-4 py-2.5 text-sm text-amber-200/75 hover:bg-amber-950/20 transition"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={onNext}
                    className="rounded-xl border border-amber-700/40 bg-amber-950/30 px-4 py-2.5 text-sm font-semibold text-amber-100 hover:bg-amber-900/35 transition"
                  >
                    {nextLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}