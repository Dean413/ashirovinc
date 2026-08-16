"use client";

import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseclient";

type AuthState = {
    user: User | null;
    session: Session | null;
    isLoaded: boolean;
    init: () => void;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    getAccessToken: () => string | undefined;
};

// Module-level guard so the Supabase listener is only ever attached once,
// no matter how many components mount/unmount or call init().
let listenerAttached = false;

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    isLoaded: false,

    init: () => {
        if (listenerAttached) return;
        listenerAttached = true;

        supabase.auth.getSession().then(({ data }) => {
            set({
                user: data.session?.user ?? null,
                session: data.session ?? null,
                isLoaded: true,
            });
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            set({
                user: session?.user ?? null,
                session,
                isLoaded: true,
            });
        });
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
    },

    // Force a fresh read of the user from Supabase and sync the store.
    // Call this after actions that change the user server-side (e.g. updateUser).
    refreshUser: async () => {
        const { data } = await supabase.auth.getUser();
        set((state) => ({ user: data.user ?? null, session: state.session }));
    },

    // Always reads the freshest token from the store at call-time (not a stale
    // closure), so it's safe to use inside fetch() calls anywhere in the app.
    getAccessToken: () => get().session?.access_token,
}));