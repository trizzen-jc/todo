"use client";

import { useEffect, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useAppStore } from "@/store";
import KanbanColumn from "./KanbanColumn";
import { generateKeyBetween } from "@/lib/fractionalIndex";
import { Todo, TodoStatus } from "@/types";

const COLUMNS: { status: TodoStatus; label: string }[] = [
  { status: "todo", label: "할 일" },
  { status: "doing", label: "진행 중" },
  { status: "done", label: "완료" },
];

export default function KanbanBoard() {
  const { todos, fetchTodos, updateTodo } = useAppStore();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const columns = useMemo(() => {
    const map: Record<TodoStatus, Todo[]> = { todo: [], doing: [], done: [] };
    for (const t of todos) {
      map[t.status].push(t);
    }
    const priorityRank = { high: 0, medium: 1, low: 2 };
    for (const key of Object.keys(map) as TodoStatus[]) {
      map[key].sort((a, b) => {
        const diff = priorityRank[a.priority] - priorityRank[b.priority];
        if (diff !== 0) return diff;
        return a.order < b.order ? -1 : 1;
      });
    }
    return map;
  }, [todos]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTodo = todos.find((t) => t._id === active.id);
    if (!activeTodo) return;

    const overTodo = todos.find((t) => t._id === over.id);
    const targetStatus: TodoStatus = overTodo
      ? overTodo.status
      : (over.id as TodoStatus);

    const targetList = columns[targetStatus].filter(
      (t) => t._id !== activeTodo._id
    );
    const overIndex = overTodo
      ? targetList.findIndex((t) => t._id === overTodo._id)
      : targetList.length;

    const before = targetList[overIndex - 1]?.order ?? null;
    const after = targetList[overIndex]?.order ?? null;
    const newOrder = generateKeyBetween(before, after);

    if (activeTodo.status === targetStatus && activeTodo.order === newOrder) {
      return;
    }

    updateTodo(activeTodo._id, { status: targetStatus, order: newOrder });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            todos={columns[col.status]}
          />
        ))}
      </div>
    </DndContext>
  );
}
