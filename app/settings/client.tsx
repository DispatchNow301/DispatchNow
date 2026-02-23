"use client";

import { useState } from "react";

export default function SettingsClient({
  initialBold = false,
}: {
  initialBold?: boolean;
}) {
  const [boldUI, setBoldUI] = useState(initialBold);

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-[#D9D9D9] overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
            <div className="text-lg font-semibold mb-3">Account</div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Username</div>
                <div className="mt-2">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#D9D9D9] outline-none focus:border-white/20"
                    value="user"
                    onChange={() => {}}
                    readOnly
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Email</div>
                <div className="mt-2 text-sm text-[#D9D9D9]/70">user@example.com</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
            <div className="text-lg font-semibold mb-3">Accessibility</div>

            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-sm font-semibold">Bold text</div>
                <div className="text-xs text-[#D9D9D9]/60">Makes UI text heavier</div>
              </div>

              <button
                type="button"
                onClick={() => setBoldUI((v) => !v)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs hover:bg-white/10 transition"
              >
                {boldUI ? "On" : "Off"}
              </button>
            </label>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-[#D9D9D9]/60">
              Colorblind modes: TODO
            </div>
          </section>
        </div>

        <div
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5"
          style={{ fontWeight: boldUI ? 700 : 400 }}
        >
          Preview text (toggles bold)
        </div>
      </div>
    </main>
  );
}