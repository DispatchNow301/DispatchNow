"use client";

import { useState } from "react";
import VigilanteDossierCard, { type VigilanteSheet } from "./VigilanteDossierCard";
import NPCDialogueBox, { type DialogueSpeaker } from "./NPCDialogueBox";

type Props = {
  vigilantes: VigilanteSheet[];
  npcPortraits: {
    citizen: DialogueSpeaker;
    police: DialogueSpeaker;
    chief: DialogueSpeaker;
  };
};

export default function CharacterOverlayDemo({
  vigilantes,
  npcPortraits,
}: Props) {
  const [selected, setSelected] = useState<VigilanteSheet | null>(vigilantes[0] ?? null);
  const [dossierOpen, setDossierOpen] = useState(true);

  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [speaker, setSpeaker] = useState<DialogueSpeaker | null>(null);
  const [dialogue, setDialogue] = useState("");

  return (
    <>
      <div className="absolute right-6 top-6 z-[105] flex flex-wrap gap-2">
        {vigilantes.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => {
              setSelected(v);
              setDossierOpen(true);
            }}
            className="rounded-xl border border-amber-900/35 bg-black/35 px-4 py-2 text-xs text-amber-200/80 hover:bg-amber-950/20 transition"
          >
            Open {v.alias}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setSpeaker(npcPortraits.citizen);
            setDialogue("I saw a masked crew run through the alley. If your people are moving, move now.");
            setDialogueOpen(true);
          }}
          className="rounded-xl border border-amber-900/35 bg-black/35 px-4 py-2 text-xs text-amber-200/80 hover:bg-amber-950/20 transition"
        >
          Citizen Dialogue
        </button>

        <button
          type="button"
          onClick={() => {
            setSpeaker(npcPortraits.police);
            setDialogue("You vigilantes always show up before the paperwork does. Don’t make me regret looking the other way.");
            setDialogueOpen(true);
          }}
          className="rounded-xl border border-amber-900/35 bg-black/35 px-4 py-2 text-xs text-amber-200/80 hover:bg-amber-950/20 transition"
        >
          Police Dialogue
        </button>

        <button
          type="button"
          onClick={() => {
            setSpeaker(npcPortraits.chief);
            setDialogue("The city is slipping. Keep your crew disciplined, and maybe we both survive the night.");
            setDialogueOpen(true);
          }}
          className="rounded-xl border border-amber-900/35 bg-black/35 px-4 py-2 text-xs text-amber-200/80 hover:bg-amber-950/20 transition"
        >
          Chief Dialogue
        </button>
      </div>

      <VigilanteDossierCard
        open={dossierOpen}
        character={selected}
        onClose={() => setDossierOpen(false)}
        onDispatch={(id) => {
          console.log("dispatch vigilante", id);
          setDossierOpen(false);
        }}
      />

      <NPCDialogueBox
        open={dialogueOpen}
        speaker={speaker}
        text={dialogue}
        onClose={() => setDialogueOpen(false)}
        onNext={() => setDialogueOpen(false)}
      />
    </>
  );
}