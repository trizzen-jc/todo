"use client";

import { useState } from "react";
import { Goal } from "@/types";

const inputClass =
  "rounded-sm border border-line bg-surface px-3 py-3 text-[14px] text-foreground placeholder:text-muted focus:border-2 focus:border-foreground focus:outline-none";

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
      <h2 className="text-[20px] font-semibold text-foreground">
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
          className="rounded-sm px-4 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:bg-surface-soft"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-sm bg-primary px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover"
        >
          저장
        </button>
      </div>
    </form>
  );
}
