"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TodoCard from "./TodoCard";
import { Todo, TodoStatus } from "@/types";

export default function KanbanColumn({
  status,
  label,
  todos,
}: {
  status: TodoStatus;
  label: string;
  todos: Todo[];
}) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="flex min-h-[300px] flex-col gap-2 rounded-xl border border-black/10 bg-black/[.02] p-3"
    >
      <h2 className="text-sm font-semibold text-foreground/70">
        {label} ({todos.length})
      </h2>
      <SortableContext
        items={todos.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoCard key={todo._id} todo={todo} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
