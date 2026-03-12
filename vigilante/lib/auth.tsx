"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./supabaseClient";

export type AuthUser = {
	id: string;
	provider: "google" | "github" | "discord";
};

type AuthContextValue = {
	user: AuthUser | null;
	signInWithProvider: (provider: AuthUser["provider"]) => void;
	signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapSupabaseUser(u: User | null): AuthUser | null {
	if (!u) return null;
	const rawProvider = (u.app_metadata as { provider?: string } | undefined)?.provider;
	const provider =
		rawProvider === "google" || rawProvider === "github" || rawProvider === "discord"
			? rawProvider
			: undefined;
	return {
		id: u.id,
		// fallback keeps UI stable if provider is missing
		provider: provider ?? "google",
	};
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		const supabase = getSupabaseBrowserClient();

		let alive = true;
		supabase.auth.getUser().then(({ data, error }) => {
			if (!alive) return;
			if (error) {
				setUser(null);
				return;
			}
			setUser(mapSupabaseUser(data.user));
		});

		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(mapSupabaseUser(session?.user ?? null));
		});

		return () => {
			alive = false;
			sub.subscription.unsubscribe();
		};
	}, []);

	const signInWithProvider = useCallback((provider: AuthUser["provider"]) => {
		const supabase = getSupabaseBrowserClient();
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
		void supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${siteUrl}/auth/callback`,
			},
		});
	}, []);

	const signOut = useCallback(() => {
		const supabase = getSupabaseBrowserClient();
		void supabase.auth.signOut();
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({ user, signInWithProvider, signOut }),
		[user, signInWithProvider, signOut]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within <AuthProvider />");
	}
	return ctx;
}

