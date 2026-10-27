"use client";

import { useSearchParams } from "next/navigation";

export default function NeedLoginBanner() {
  const searchParams = useSearchParams();
  const needLogin = searchParams.get("needLogin") === "1";
  const authError = searchParams.get("authError");
  const reason = searchParams.get("reason");

  if (authError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
        GitHub 로그인에 실패했어요 ({authError}
        {reason ? ` / ${reason}` : ""}). 다시 시도해주세요.
      </div>
    );
  }

  if (!needLogin) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
      할 일 보드는 로그인 후 이용할 수 있어요. 우측 상단의 &quot;GitHub로
      로그인&quot;을 눌러주세요.
    </div>
  );
}
