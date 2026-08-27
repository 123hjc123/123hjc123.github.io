import { Link, useNavigate } from "react-router";
import { COURSE_MODULES, TOTAL_LESSONS } from "@contracts/course";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export default function Course() {
  const navigate = useNavigate();
  const { completed } = useProgress();
  const done = new Set(completed);
  const doneCount = COURSE_MODULES.flatMap((m) => m.lessons).filter((l) => done.has(l.id)).length;
  const pct = Math.round((doneCount / TOTAL_LESSONS) * 100);

  return (
    <div className="paper-bg min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:px-10">
        <p className="font-mono-num text-xs tracking-[0.3em] text-[hsl(var(--cinnabar))]">MY COURSE</p>
        <h1 className="mt-4 font-brush text-5xl md:text-6xl">修炼之路</h1>

        {/* 状态条 */}
        <div className="mt-8 border border-[hsl(var(--ink))] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-song text-lg font-semibold">
                全部课程 · 图解实战版
                <span className="ml-3 border border-[hsl(var(--cinnabar))] px-2 py-0.5 text-xs text-[hsl(var(--cinnabar))]">
                  已登录
                </span>
              </p>
              <p className="mt-2 font-song text-sm text-[hsl(var(--ink-3))]">
                学习进度：{doneCount} / {TOTAL_LESSONS} 课（{pct}%）· 进度保存在本机浏览器
              </p>
              <div className="mt-3 h-1.5 w-64 max-w-full bg-[hsl(var(--ink)/0.1)]">
                <div className="h-full bg-[hsl(var(--cinnabar))] transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <Button
              onClick={() => navigate(`/course/lesson/${firstUndone(done)}`)}
              className="bg-[hsl(var(--cinnabar))] px-6 text-[hsl(var(--paper))] hover:bg-[hsl(var(--cinnabar-bright))]"
            >
              {doneCount > 0 ? "继续修炼" : "开始第一课"}
            </Button>
          </div>
        </div>

        {/* 模块与课时 */}
        <div className="mt-14 space-y-14">
          {COURSE_MODULES.map((m) => (
            <section key={m.id}>
              <div className="flex items-baseline gap-4 border-b border-[hsl(var(--ink))] pb-4">
                <span className="font-brush text-4xl text-[hsl(var(--cinnabar))]">{m.no}</span>
                <div>
                  <h2 className="font-song text-xl font-bold">{m.title}</h2>
                  <p className="mt-1 font-mono-num text-xs tracking-widest text-[hsl(var(--ink-3))]">{m.weeks}</p>
                </div>
              </div>
              <div className="divide-y divide-[hsl(var(--line))]">
                {m.lessons.map((l) => {
                  const isDone = done.has(l.id);
                  return (
                    <Link
                      key={l.id}
                      to={`/course/lesson/${l.id}`}
                      className="group flex items-center gap-4 py-5 md:gap-6"
                    >
                      <span className="font-mono-num w-10 shrink-0 text-sm text-[hsl(var(--cinnabar))]">{l.id}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-song text-base font-semibold transition-colors group-hover:text-[hsl(var(--cinnabar))] md:text-lg">
                          {l.title}
                        </p>
                        <p className="mt-1 truncate font-song text-xs text-[hsl(var(--ink-3))] md:text-sm">{l.subtitle}</p>
                      </div>
                      <span className="hidden shrink-0 font-mono-num text-xs text-[hsl(var(--ink-3))] md:inline">
                        约 {l.minutes} 分钟
                      </span>
                      {isDone ? (
                        <Check className="h-5 w-5 shrink-0 text-[hsl(var(--cinnabar))]" />
                      ) : (
                        <span className="shrink-0 font-song text-xs text-[hsl(var(--ink-3))] group-hover:text-[hsl(var(--cinnabar))]">
                          去学习 →
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

function firstUndone(done: Set<string>) {
  for (const m of COURSE_MODULES) {
    for (const l of m.lessons) {
      if (!done.has(l.id)) return l.id;
    }
  }
  return COURSE_MODULES[0].lessons[0].id;
}
