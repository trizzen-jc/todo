"use client";

import { useSearchParams } from "next/navigation";

export default function NeedLoginBanner() {
  const searchParams = useSearchParams();
  const needLogin = searchParams.get("needLogin") === "1";
  const authError = searchParams.get("authError");
  const reason = searchParams.get("reason");

  if (authError) {
    return (
      <div className="rounded-md border border-line bg-surface-soft p-3 text-[14px] text-error">
        GitHub 로그인에 실패했어요 ({authError}
        {reason ? ` / ${reason}` : ""}). 다시 시도해주세요.
      </div>
    );
  }

  if (!needLogin) return null;

  return (
    <div className="rounded-md border border-line bg-surface-soft p-3 text-[14px] text-foreground">
      할 일 보드는 로그인 후 이용할 수 있어요. 우측 상단의{" "}
      <span className="font-medium">&quot;GitHub로 로그인&quot;</span>을
      눌러주세요.
    </div>
  );
}
