"use client";

import dynamic from "next/dynamic";
import TodoForm from "@/components/todos/TodoForm";

const KanbanBoard = dynamic(() => import("@/components/todos/KanbanBoard"), {
  ssr: false,
});

export default function TodosPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[22px] font-medium tracking-tight text-foreground">
        할 일
      </h1>
      <TodoForm />
      <KanbanBoard />
    </div>
  );
}
