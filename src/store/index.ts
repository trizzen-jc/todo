import { create } from "zustand";
import { createTodoSlice, TodoSlice } from "./todoSlice";
import { createWeeklySlice, WeeklySlice } from "./weeklySlice";
import { createGoalSlice, GoalSlice } from "./goalSlice";
import { createAuthSlice, AuthSlice } from "./authSlice";

export type AppState = TodoSlice & WeeklySlice & GoalSlice & AuthSlice;

export const useAppStore = create<AppState>()((...a) => ({
  ...createTodoSlice(...a),
  ...createWeeklySlice(...a),
  ...createGoalSlice(...a),
  ...createAuthSlice(...a),
}));
