/** 주어진 날짜가 속한 주의 일요일 00:00을 반환 (dayOfWeek 0=일 ~ 6=토 기준) */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
