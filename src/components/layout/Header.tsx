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
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-line bg-surface px-6">
      <span className="text-[16px] font-semibold tracking-tight text-foreground">
        할일 + 목표 관리
      </span>
      {authLoaded && (
        <div className="flex items-center gap-3 text-sm">
          {currentUser ? (
            <>
              {currentUser.avatarUrl && (
                <Image
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-foreground">{currentUser.username}</span>
              <a
                href="/auth/logout"
                className="rounded-sm px-3 py-2 font-medium text-foreground transition-colors hover:bg-surface-soft"
              >
                로그아웃
              </a>
            </>
          ) : (
            <a
              href="/auth/github"
              className="flex h-12 items-center rounded-sm bg-primary px-6 text-[16px] font-medium text-white transition-colors hover:bg-primary-hover"
            >
              GitHub로 로그인
            </a>
          )}
        </div>
      )}
    </header>
  );
}
