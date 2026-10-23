import { StateCreator } from "zustand";
import { WeeklyPlan } from "@/types";

export interface WeeklySlice {
  weeklyPlans: WeeklyPlan[];
  weeklyLoading: boolean;
  fetchWeeklyPlans: (weekStart?: string) => Promise<void>;
  addWeeklyPlan: (data: Partial<WeeklyPlan>) => Promise<WeeklyPlan | null>;
  updateWeeklyPlan: (id: string, data: Partial<WeeklyPlan>) => Promise<void>;
  toggleWeeklyGoal: (id: string, index: number) => Promise<void>;
}

export const createWeeklySlice: StateCreator<
  WeeklySlice,
  [],
  [],
  WeeklySlice
> = (set, get) => ({
  weeklyPlans: [],
  weeklyLoading: false,
  fetchWeeklyPlans: async (weekStart) => {
    set({ weeklyLoading: true });
    const url = weekStart
      ? `/api/weekly?weekStart=${weekStart}`
      : "/api/weekly";
    const res = await fetch(url);
    const data = await res.json();
    set({ weeklyPlans: data, weeklyLoading: false });
  },
  addWeeklyPlan: async (data) => {
    const res = await fetch("/api/weekly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const created = await res.json();
    set({ weeklyPlans: [...get().weeklyPlans, created] });
    return created;
  },
  updateWeeklyPlan: async (id, data) => {
    set({
      weeklyPlans: get().weeklyPlans.map((w) =>
        w._id === id ? { ...w, ...data } : w
      ),
    });
    await fetch(`/api/weekly/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  toggleWeeklyGoal: async (id, index) => {
    const plan = get().weeklyPlans.find((w) => w._id === id);
    if (!plan) return;
    const goals = plan.goals.map((g, i) =>
      i === index ? { ...g, done: !g.done } : g
    );
    set({
      weeklyPlans: get().weeklyPlans.map((w) =>
        w._id === id ? { ...w, goals } : w
      ),
    });
    await fetch(`/api/weekly/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, done: goals[index].done }),
    });
  },
});
