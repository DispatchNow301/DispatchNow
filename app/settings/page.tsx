import type { Metadata } from "next";
import SettingsClient from "./client";

export const metadata: Metadata = {
  title: "Settings • DispatchNow",
};

export default async function SettingsPage() {
  return <SettingsClient initialBold={false} />;
}