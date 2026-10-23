"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAppStore } from "@/store";

export default function Header() {
  const { currentUser, authLoaded, fetchMe } = useAppStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 px-4">
      <span className="font-semibold">할일 + 목표 관리</span>
      {authLoaded && (
        <div className="flex items-center gap-2 text-sm">
          {currentUser ? (
            <>
              {currentUser.avatarUrl && (
                <Image
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-foreground/70">
                {currentUser.username}
              </span>
              <a
                href="/auth/logout"
                className="rounded-lg px-2 py-1 text-foreground/60 hover:bg-black/5"
              >
                로그아웃
              </a>
            </>
          ) : (
            <a
              href="/auth/github"
              className="rounded-lg bg-black px-3 py-1.5 text-white hover:bg-black/80"
            >
              GitHub로 로그인
            </a>
          )}
        </div>
      )}
    </header>
  );
}
