// app/settings/page.tsx
import type { Metadata } from "next";
import SettingsClient from "./client";

export const metadata: Metadata = {
  title: "Settings • DispatchNow",
};

export default function SettingsPage() {
  return <SettingsClient />;
}