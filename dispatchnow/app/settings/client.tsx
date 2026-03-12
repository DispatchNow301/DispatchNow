"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/util/sidebar";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type Tier = 1 | 2 | 3;

type ProfileRow = {
  id: string;
  email: string | null;
  tier: number | null;
  username: string | null;
};

function StatTile({
  title,
  desc,
  right,
}: {
  title: string;
  desc: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-[#D9D9D9]">{title}</div>
          <div className="mt-1 text-xs text-[#D9D9D9]/60">{desc}</div>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </div>
  );
}

function ButtonGhost({
  children,
  href,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls =
    "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed";
  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <button type="button" className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  type,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type ?? "text"}
      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#D9D9D9] placeholder:text-[#D9D9D9]/40 outline-none focus:border-white/20"
    />
  );
}

function Select({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#D9D9D9] outline-none focus:border-white/20"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#0b0b0c]">
          {o}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  on,
  setOn,
}: {
  on: boolean;
  setOn: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
          type="checkbox"
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full border border-white/10 bg-white/5 transition peer-checked:bg-white/10" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-[#D9D9D9]/70 transition peer-checked:translate-x-5 peer-checked:bg-[#D9D9D9]" />
      </span>
    </label>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const tierText = tier === 1 ? "Citizen" : tier === 2 ? "Volunteer" : "Authority";
  const citizenText = "#34D399";
  const volunteerText = "#FF9F1A";
  const authorityRed = "#8B000D";
  const isAuthority = tier === 3;

  return (
    <span
      className="rounded-full border border-white/10 px-3 py-1 text-xs"
      style={{
        color: tier === 1 ? citizenText : tier === 2 ? volunteerText : "#D9D9D9",
        background: isAuthority ? authorityRed : "rgba(255,255,255,0.06)",
      }}
    >
      {tierText}
    </span>
  );
}

function loadPrefs() {
  if (typeof window === "undefined") {
    return {
      emailNotifications: true,
      publicProfile: true,
      defaultLanding: "Dashboard",
      boldText: false,
    };
  }
  const raw = window.localStorage.getItem("dispatchnow:prefs");
  if (!raw) {
    return {
      emailNotifications: true,
      publicProfile: true,
      defaultLanding: "Dashboard",
      boldText: false,
    };
  }
  try {
    const v = JSON.parse(raw);
    return {
      emailNotifications: !!v.emailNotifications,
      publicProfile: !!v.publicProfile,
      defaultLanding: typeof v.defaultLanding === "string" ? v.defaultLanding : "Dashboard",
      boldText: !!v.boldText,
    };
  } catch {
    return {
      emailNotifications: true,
      publicProfile: true,
      defaultLanding: "Dashboard",
      boldText: false,
    };
  }
}

function savePrefs(p: {
  emailNotifications: boolean;
  publicProfile: boolean;
  defaultLanding: string;
  boldText: boolean;
}) {
  window.localStorage.setItem("dispatchnow:prefs", JSON.stringify(p));
}

export default function SettingsClient() {
  const sidebarWidth = 84;

  const [loading, setLoading] = useState(true);
  const [authId, setAuthId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier>(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [prefs, setPrefs] = useState(() => loadPrefs());

  const [newPassword, setNewPassword] = useState("");
  const [showPasswordBox, setShowPasswordBox] = useState(false);

  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setToast(null);

      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) {
        setToast({ kind: "err", msg: userErr.message });
        setLoading(false);
        return;
      }

      if (!user) {
        setAuthId(null);
        setProfileId(null);
        setLoading(false);
        return;
      }

      setAuthId(user.id);

      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("id,email,tier,username")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

      if (profErr) {
        setToast({ kind: "err", msg: profErr.message });
        setLoading(false);
        return;
      }

      if (prof) {
        setProfileId(prof.id);
        setTier(((prof.tier ?? 1) as Tier));
        setUsername(prof.username ?? "");
        setEmail(prof.email ?? user.email ?? "");
      } else {
        setProfileId(user.id);
        setEmail(user.email ?? "");
      }

      setLoading(false);
    })();
  }, [supabase]);

  useEffect(() => {
    if (typeof window !== "undefined") savePrefs(prefs);
  }, [prefs]);

  async function refreshProfile() {
    if (!authId) return;
    const { data: prof, error } = await supabase
      .from("profiles")
      .select("id,email,tier,username")
      .eq("id", authId)
      .maybeSingle<ProfileRow>();
    if (error) throw error;
    if (prof) {
      setProfileId(prof.id);
      setTier(((prof.tier ?? 1) as Tier));
      setUsername(prof.username ?? "");
      setEmail(prof.email ?? email);
    }
  }

  async function handleUpdateAccount() {
    if (!authId) {
      setToast({ kind: "err", msg: "You must be logged in." });
      return;
    }

    const u = username.trim();
    if (u.length > 0) {
      const ok = /^[a-zA-Z0-9_]+$/.test(u);
      if (!ok) {
        setToast({ kind: "err", msg: "Username can only contain letters, numbers, and _" });
        return;
      }
    }

    setBusy("account");
    setToast(null);
    try {
      if (u.length > 0) {
        const { error } = await supabase
          .from("profiles")
          .update({ username: u })
          .eq("id", authId);
        if (error) throw error;
      }

      const nextEmail = email.trim();
      if (nextEmail && nextEmail !== "") {
        const { data: current } = await supabase.auth.getUser();
        const currentEmail = current.user?.email ?? "";
        if (currentEmail && nextEmail !== currentEmail) {
          const { error: e2 } = await supabase.auth.updateUser({ email: nextEmail });
          if (e2) throw e2;
        }

        const { error: e3 } = await supabase
          .from("profiles")
          .update({ email: nextEmail })
          .eq("id", authId);
        if (e3) throw e3;
      }

      await refreshProfile();
      setToast({ kind: "ok", msg: "Account updated." });
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "Update failed." });
    } finally {
      setBusy(null);
    }
  }

  async function handleResetAccountInputs() {
    setBusy("reset");
    setToast(null);
    try {
      await refreshProfile();
      setToast({ kind: "ok", msg: "Reverted to saved values." });
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "Reset failed." });
    } finally {
      setBusy(null);
    }
  }

  async function handleSendResetEmail() {
    const to = email.trim();
    if (!to) {
      setToast({ kind: "err", msg: "No email to send to." });
      return;
    }

    setBusy("resetEmail");
    setToast(null);
    try {
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/confirmation` : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(to, {
        redirectTo,
      });

      if (error) throw error;

      setToast({ kind: "ok", msg: "Reset email sent (if the address exists)." });
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "Failed to send reset email." });
    } finally {
      setBusy(null);
    }
  }

  async function handleChangePassword() {
    if (!newPassword.trim()) {
      setToast({ kind: "err", msg: "Password is empty." });
      return;
    }

    setBusy("password");
    setToast(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword.trim() });
      if (error) throw error;
      setNewPassword("");
      setShowPasswordBox(false);
      setToast({ kind: "ok", msg: "Password updated." });
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "Password update failed." });
    } finally {
      setBusy(null);
    }
  }

  async function handleLogout() {
    setBusy("logout");
    setToast(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/";
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "Logout failed." });
      setBusy(null);
    }
  }

  function handleSavePreferences() {
    setToast({ kind: "ok", msg: "Preferences saved locally." });
  }

  function handleResetPreferences() {
    setPrefs({
      emailNotifications: true,
      publicProfile: true,
      defaultLanding: "Dashboard",
      boldText: false,
    });
    setToast({ kind: "ok", msg: "Preferences reset." });
  }

  function handleSaveAll() {
    (async () => {
      await handleUpdateAccount();
      handleSavePreferences();
    })();
  }

  const tierText = tier === 1 ? "Citizen" : tier === 2 ? "Volunteer" : "Authority";

  return (
    <main
      className={`
        relative min-h-screen bg-[#0b0b0c] text-[#D9D9D9]
        ${prefs.boldText ? "font-bold" : ""}
      `}
    >
      <Sidebar activeHref="/settings" />

      <div
        className="relative px-6 py-8"
        style={{ paddingLeft: `calc(${sidebarWidth}px + 24px)` }}
      >
        <div className="mx-auto max-w-5xl">
          <section className="mb-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-[#D9D9D9]">Settings</div>
                <div className="mt-1 text-sm text-[#D9D9D9]/60">
                  Account, notifications, and preferences
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-[#D9D9D9]/55">Tier</span>
                  <TierBadge tier={tier} />
                  <span className="text-xs text-[#D9D9D9]/55">{tierText}</span>
                </div>

                {loading ? (
                  <div className="mt-3 text-xs text-[#D9D9D9]/55">Loading…</div>
                ) : !authId ? (
                  <div className="mt-3 text-xs text-[#D9D9D9]/55">
                    You are not signed in.
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <ButtonGhost href={`/profile/${username || "test"}`}>View Profile</ButtonGhost>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={!!busy || !authId}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {toast ? (
              <div
                className={`mt-4 rounded-2xl border p-4 text-sm ${
                  toast.kind === "ok"
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-red-500/20 bg-red-500/10 text-white"
                }`}
              >
                {toast.msg}
              </div>
            ) : null}
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* LEFT COLUMN: Account + Accessibility */}
            <div className="flex flex-col gap-4">
              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold tracking-wide text-[#D9D9D9]">
                    Account
                  </h2>
                  <span className="text-xs text-[#D9D9D9]/55">profile info</span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="space-y-3">
                  <StatTile
                    title="Display name"
                    desc="Not stored yet (UI placeholder)."
                    right={<span className="text-xs text-[#D9D9D9]/55">TODO</span>}
                  />
                  <Input placeholder="Display name" value={"User"} onChange={() => {}} />

                  <StatTile
                    title="Username"
                    desc="Used in links like /profile/[username]."
                    right={<span className="text-xs text-[#D9D9D9]/55">unique</span>}
                  />
                  <Input placeholder="@username" value={username} onChange={setUsername} />

                  <StatTile title="Email" desc="Used for sign-in and notifications." />
                  <Input placeholder="email@example.com" value={email} onChange={setEmail} />

                  <div className="flex justify-end gap-2 pt-1">
                    <ButtonGhost onClick={handleResetAccountInputs} disabled={!!busy}>
                      Cancel
                    </ButtonGhost>

                    <button
                      type="button"
                      onClick={handleUpdateAccount}
                      disabled={!!busy || !authId}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Update Account
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold tracking-wide text-[#D9D9D9]">
                    Accessibility
                  </h2>
                  <span className="text-xs text-[#D9D9D9]/55">a11y</span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <div className="text-sm font-semibold text-[#D9D9D9]">
                        Bold text
                      </div>
                      <div className="mt-1 text-xs text-[#D9D9D9]/60">
                        Makes text bolder across the app.
                      </div>
                    </div>
                    <Toggle
                      on={prefs.boldText}
                      setOn={(v) => setPrefs((p) => ({ ...p, boldText: v }))}
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-[#D9D9D9]">
                      Colorblind modes
                    </div>
                    <div className="mt-1 text-xs text-[#D9D9D9]/60">TODO</div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Security + Preferences */}
            <div className="flex flex-col gap-4">
              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold tracking-wide text-[#D9D9D9]">
                    Security
                  </h2>
                  <span className="text-xs text-[#D9D9D9]/55">auth</span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="space-y-4">
                  <StatTile
                    title="Password"
                    desc="Update your password."
                    right={
                      <ButtonGhost
                        onClick={() => setShowPasswordBox((v) => !v)}
                        disabled={!!busy || !authId}
                      >
                        Change
                      </ButtonGhost>
                    }
                  />

                  {showPasswordBox ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold text-[#D9D9D9]">
                        New password
                      </div>
                      <div className="mt-3">
                        <Input
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={setNewPassword}
                          type="password"
                        />
                      </div>
                      <div className="mt-3 flex justify-end gap-2">
                        <ButtonGhost onClick={() => setShowPasswordBox(false)} disabled={!!busy}>
                          Close
                        </ButtonGhost>
                        <button
                          type="button"
                          onClick={handleChangePassword}
                          disabled={!!busy || !authId}
                          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <StatTile
                    title="Reset password email"
                    desc="Send a reset email to your account."
                    right={
                      <button
                        type="button"
                        onClick={handleSendResetEmail}
                        disabled={!!busy || !authId}
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    }
                  />

                  <StatTile
                    title="Session"
                    desc="Sign out from this device."
                    right={
                      <ButtonGhost onClick={handleLogout} disabled={!!busy || !authId}>
                        Logout
                      </ButtonGhost>
                    }
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold tracking-wide text-[#D9D9D9]">
                    Preferences
                  </h2>
                  <span className="text-xs text-[#D9D9D9]/55">ui</span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <div className="text-sm font-semibold text-[#D9D9D9]">
                        Email notifications
                      </div>
                      <div className="mt-1 text-xs text-[#D9D9D9]/60">
                        Updates about reports, incidents, and requests.
                      </div>
                    </div>
                    <Toggle
                      on={prefs.emailNotifications}
                      setOn={(v) => setPrefs((p) => ({ ...p, emailNotifications: v }))}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <div className="text-sm font-semibold text-[#D9D9D9]">
                        Public profile
                      </div>
                      <div className="mt-1 text-xs text-[#D9D9D9]/60">
                        Allow others to view your profile overview.
                      </div>
                    </div>
                    <Toggle
                      on={prefs.publicProfile}
                      setOn={(v) => setPrefs((p) => ({ ...p, publicProfile: v }))}
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-[#D9D9D9]">
                      Default landing
                    </div>
                    <div className="mt-1 text-xs text-[#D9D9D9]/60">
                      Where “Home” in the sidebar takes you.
                    </div>
                    <div className="mt-3">
                      <Select
                        options={["Dashboard", "Reports catalog", "Incidents catalog"]}
                        value={prefs.defaultLanding}
                        onChange={(v) => setPrefs((p) => ({ ...p, defaultLanding: v }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <ButtonGhost onClick={handleResetPreferences} disabled={!!busy}>
                      Reset
                    </ButtonGhost>
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      disabled={!!busy}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#8B000D] px-4 py-2 text-xs text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <span className="text-xs text-[#D9D9D9]/45">
              DispatchNow • settings
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}