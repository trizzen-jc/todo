import { StateCreator } from "zustand";

export type CurrentUser = {
  _id: string;
  username: string;
  avatarUrl?: string;
} | null;

export interface AuthSlice {
  currentUser: CurrentUser;
  authLoaded: boolean;
  fetchMe: () => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set
) => ({
  currentUser: null,
  authLoaded: false,
  fetchMe: async () => {
    const res = await fetch("/api/me");
    const data = await res.json();
    set({ currentUser: data.user, authLoaded: true });
  },
});
