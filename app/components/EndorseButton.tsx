"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  reportId: string;
};

export default function EndorseButton({ reportId }: Props) {
  const [loading, setLoading] = useState(false);
  const [endorsed, setEndorsed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleEndorse() {
    if (loading || endorsed) return;
    setLoading(true);
    setMessage(null);

    // get current user
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;

    if (!user) {
      setMessage("Please sign in first.");
      setLoading(false);
      return;
    }

    // insert endorsement
    const { error } = await supabase.from("report_endorsements").insert({
      report_id: reportId,
      user_id: user.id,
    });

    if (!error) {
      setEndorsed(true);
      setMessage("Endorsed ✅");
      setLoading(false);
      return;
    }

    // deal with errors
    const code = (error as any).code;

    if (code === "23505") {
      // unique violation
      setEndorsed(true);
      setMessage("You already endorsed this report.");
    } else if (code === "42501") {
      // RLS tier req not meet（Tier1）
      setMessage("Permission denied (Tier 2/3 only).");
    } else {
      setMessage("Error: " + error.message);
    }

    setLoading(false);
  }

  // front end?
  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={handleEndorse}
        disabled={loading || endorsed}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #666",
          background: "transparent",
          color: "white",
          cursor: loading || endorsed ? "not-allowed" : "pointer",
          opacity: loading || endorsed ? 0.6 : 1,
        }}
      >
        {endorsed ? "Endorsed" : loading ? "Endorsing..." : "Endorse"}
      </button>

      {message && (
        <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>
          {message}
        </div>
      )}
    </div>
  );
}