import { StateCreator } from "zustand";
import { Goal } from "@/types";

export interface GoalSlice {
  goals: Goal[];
  goalsLoading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (data: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const createGoalSlice: StateCreator<GoalSlice, [], [], GoalSlice> = (
  set,
  get
) => ({
  goals: [],
  goalsLoading: false,
  fetchGoals: async () => {
    set({ goalsLoading: true });
    const res = await fetch("/api/goals");
    const data = await res.json();
    set({ goals: data, goalsLoading: false });
  },
  addGoal: async (data) => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const created = await res.json();
    set({ goals: [...get().goals, created] });
  },
  updateGoal: async (id, data) => {
    set({
      goals: get().goals.map((g) => (g._id === id ? { ...g, ...data } : g)),
    });
    await fetch(`/api/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  deleteGoal: async (id) => {
    set({ goals: get().goals.filter((g) => g._id !== id) });
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
  },
});
