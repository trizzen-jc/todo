"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import Modal from "@/components/shared/Modal";
import { Goal } from "@/types";

export default function GoalsPage() {
  const { goals, fetchGoals, addGoal, updateGoal, deleteGoal, todos, fetchTodos } =
    useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  useEffect(() => {
    fetchGoals();
    fetchTodos();
  }, [fetchGoals, fetchTodos]);

  const progressOf = (goalId: string) => {
    const linked = todos.filter((t) => t.goalId === goalId);
    if (linked.length === 0) return 0;
    const done = linked.filter((t) => t.status === "done").length;
    return Math.round((done / linked.length) * 100);
  };

  const handleDelete = (id: string) => {
    if (confirm("이 목표를 삭제할까요?")) {
      deleteGoal(id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">1년 목표</h1>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-black/80"
        >
          + 새 목표
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard
            key={goal._id}
            goal={goal}
            progress={progressOf(goal._id)}
            onEdit={() => {
              setEditing(goal);
              setModalOpen(true);
            }}
            onDelete={() => handleDelete(goal._id)}
          />
        ))}
      </div>

      {goals.length === 0 && (
        <p className="text-sm text-foreground/50">
          아직 등록된 목표가 없어요. &quot;+ 새 목표&quot;로 추가해보세요.
        </p>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <GoalForm
          initial={editing ?? undefined}
          onCancel={() => setModalOpen(false)}
          onSubmit={(data) => {
            if (editing) {
              updateGoal(editing._id, data);
            } else {
              addGoal(data);
            }
            setModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
