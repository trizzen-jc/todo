"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAppStore } from "@/store";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Header() {
  const { currentUser, authLoaded, fetchMe } = useAppStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-surface px-4">
      <span className="font-semibold tracking-tight text-foreground">
        할일 + 목표 관리
      </span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {authLoaded && (
          <div className="flex items-center gap-2 pl-1 text-sm">
            {currentUser ? (
              <>
                {currentUser.avatarUrl && (
                  <Image
                    src={currentUser.avatarUrl}
                    alt={currentUser.username}
                    width={24}
                    height={24}
                    className="rounded-full ring-1 ring-line"
                  />
                )}
                <span className="text-muted">{currentUser.username}</span>
                <a
                  href="/auth/logout"
                  className="rounded-lg px-2 py-1 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  로그아웃
                </a>
              </>
            ) : (
              <a
                href="/auth/github"
                className="rounded-lg bg-primary-600 px-3 py-1.5 font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
              >
                GitHub로 로그인
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
