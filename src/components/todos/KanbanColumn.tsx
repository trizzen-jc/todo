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
      className="flex min-h-[300px] flex-col gap-2 rounded-2xl border border-line bg-foreground/[.025] p-3"
    >
      <h2 className="text-sm font-semibold text-muted">
        {label} <span className="text-muted/70">({todos.length})</span>
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
