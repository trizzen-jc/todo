import { StateCreator } from "zustand";
import { Todo } from "@/types";

export interface TodoSlice {
  todos: Todo[];
  todosLoading: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (data: Partial<Todo>) => Promise<void>;
  updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const createTodoSlice: StateCreator<TodoSlice, [], [], TodoSlice> = (
  set,
  get
) => ({
  todos: [],
  todosLoading: false,
  fetchTodos: async () => {
    set({ todosLoading: true });
    const res = await fetch("/api/todos");
    if (!res.ok) {
      // 비로그인(401) 등 실패 시 빈 목록으로 처리 — 대시보드는 로그인 없이도 보여야 함
      set({ todos: [], todosLoading: false });
      return;
    }
    const data = await res.json();
    set({ todos: data, todosLoading: false });
  },
  addTodo: async (data) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const created = await res.json();
    set({ todos: [...get().todos, created] });
  },
  updateTodo: async (id, data) => {
    set({
      todos: get().todos.map((t) => (t._id === id ? { ...t, ...data } : t)),
    });
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  deleteTodo: async (id) => {
    set({ todos: get().todos.filter((t) => t._id !== id) });
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
  },
});
