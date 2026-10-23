"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "@/types";
import PriorityBadge from "@/components/shared/PriorityBadge";

function isOverdue(todo: Todo) {
  if (!todo.dueDate || todo.status === "done") return false;
  const due = new Date(todo.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export default function TodoCard({ todo }: { todo: Todo }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const overdue = isOverdue(todo);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-lg border border-black/10 bg-white p-3 text-sm shadow-sm active:cursor-grabbing"
    >
      <div className="flex items-center justify-between gap-2">
        <span>{todo.title}</span>
        <PriorityBadge priority={todo.priority} />
      </div>
      {todo.dueDate && (
        <p
          className={`mt-1 text-xs ${
            overdue ? "font-medium text-red-600" : "text-foreground/50"
          }`}
        >
          마감 {new Date(todo.dueDate).toISOString().slice(0, 10)}
        </p>
      )}
    </div>
  );
}
