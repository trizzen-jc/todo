export type TodoStatus = "todo" | "doing" | "done";
export type Priority = "high" | "medium" | "low";

export interface Goal {
  _id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyGoalItem {
  text: string;
  done: boolean;
}

export interface WeeklyPlan {
  _id: string;
  weekStart: string;
  goals: WeeklyGoalItem[];
  memo: string;
  retrospective: string;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: Priority;
  dueDate?: string;
  dayOfWeek?: number;
  order: string;
  weeklyPlanId?: string;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}
