"use client";

import { useState } from "react";
import { Goal } from "@/types";

const inputClass =
  "rounded-lg border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

export default function GoalForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Goal>;
  onSubmit: (data: { title: string; description: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title, description });
      }}
      className="flex flex-col gap-3"
    >
      <h2 className="text-lg font-semibold text-foreground">
        {initial ? "목표 수정" : "새 1년 목표"}
      </h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="목표 제목"
        className={inputClass}
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명 (선택)"
        rows={3}
        className={inputClass}
      />
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-foreground/5"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          저장
        </button>
      </div>
    </form>
  );
}
