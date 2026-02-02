"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [uid, setUid] = useState<string>("(not loaded)");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUid(data.user?.id ?? "(not signed in)");
    });
  }, []);

  async function signIn() {
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Signed in ✅ (refresh page)");
      const { data } = await supabase.auth.getUser();
      setUid(data.user?.id ?? "(not signed in)");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMsg("Signed out ✅ (refresh page)");
    setUid("(not signed in)");
  }

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 360, marginBottom: 16 }}>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 8, borderRadius: 6 }}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 8, borderRadius: 6 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={signIn} style={{ padding: "8px 12px", borderRadius: 6 }}>
          Sign in
        </button>
        <button onClick={signOut} style={{ padding: "8px 12px", borderRadius: 6 }}>
          Sign out
        </button>
      </div>

      <div style={{ fontSize: 12, opacity: 0.85 }}>
        uid: {uid}
      </div>

      {msg ? <div style={{ fontSize: 12, opacity: 0.85 }}>{msg}</div> : null}
    </div>
  );
}
