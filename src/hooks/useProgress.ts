import { useCallback, useEffect, useState } from "react";

const KEY = "niepan_course_progress_v1";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** 学习进度，保存在浏览器 localStorage（本机有效，清缓存会丢失）。 */
export function useProgress() {
  const [completed, setCompleted] = useState<string[]>(read);

  useEffect(() => {
    const onStorage = () => setCompleted(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const mark = useCallback((lessonId: string, done: boolean) => {
    setCompleted((prev) => {
      const next = done ? Array.from(new Set([...prev, lessonId])) : prev.filter((x) => x !== lessonId);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  }, []);

  return { completed, mark };
}
