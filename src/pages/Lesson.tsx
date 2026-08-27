import { Link, useParams } from "react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { COURSE_MODULES, findLesson, lessonNav } from "@contracts/course";
import type { LessonContent } from "@/data/course-content";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

const LessonFigure = lazy(() => import("@/components/figures").then((m) => ({ default: m.LessonFigure })));

function moduleOf(lessonId: string) {
  return COURSE_MODULES.find((m) => m.lessons.some((l) => l.id === lessonId));
}

export default function Lesson() {
  const { lessonId = "" } = useParams();
  const { completed, mark } = useProgress();

  const meta = findLesson(lessonId);
  // undefined = 加载中；null = 不存在
  const [content, setContent] = useState<LessonContent | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    setContent(undefined);
    import("@/data/course-content").then((m) => {
      if (alive) setContent(m.LESSON_CONTENT[lessonId] ?? null);
    });
    return () => {
      alive = false;
    };
  }, [lessonId]);

  const mod = moduleOf(lessonId);
  const nav = lessonNav(lessonId);
  const isDone = completed.includes(lessonId);

  if (!meta || content === null) {
    return (
      <div className="paper-bg min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-6 pb-24 pt-36 text-center">
          <p className="font-brush text-6xl">课时不存在</p>
          <Link to="/course">
            <Button className="mt-8 bg-[hsl(var(--cinnabar))] text-[hsl(var(--paper))] hover:bg-[hsl(var(--cinnabar-bright))]">
              返回课程大纲
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  if (content === undefined) {
    return (
      <div className="paper-bg min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 pb-28 pt-40 text-center md:px-10">
          <p className="font-song text-sm tracking-[0.3em] text-[hsl(var(--ink-3))]">课时加载中…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="paper-bg min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pb-28 pt-28 md:px-10">
        {/* 头部 */}
        <div className="flex items-center gap-3 font-mono-num text-xs tracking-[0.25em] text-[hsl(var(--ink-3))]">
          <Link to="/course" className="transition-colors hover:text-[hsl(var(--cinnabar))]">课程大纲</Link>
          <span>/</span>
          <span>{mod?.title}</span>
          <span>/</span>
          <span className="text-[hsl(var(--cinnabar))]">第 {meta.id} 课</span>
        </div>
        <h1 className="mt-6 font-brush text-4xl leading-tight md:text-6xl">{meta.title}</h1>
        <p className="mt-4 font-song text-sm text-[hsl(var(--ink-3))] md:text-base">{meta.subtitle}</p>
        <p className="mt-2 font-mono-num text-xs tracking-widest text-[hsl(var(--ink-3))]">
          {meta.week} · 约 {meta.minutes} 分钟
        </p>

        {/* 学习目标 */}
        <div className="mt-10 border-l-2 border-[hsl(var(--cinnabar))] bg-[hsl(var(--ink)/0.03)] p-6">
          <p className="font-song text-sm font-bold tracking-widest">本课目标</p>
          <ul className="mt-3 space-y-2">
            {content.goals.map((g) => (
              <li key={g} className="flex items-start gap-2.5 font-song text-sm leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-[hsl(var(--cinnabar))]" />
                {g}
              </li>
            ))}
          </ul>
        </div>

        {/* 正文 */}
        <article className="mt-12 space-y-12">
          {content.sections.map((s, i) => (
            <section key={i}>
              {s.heading && (
                <h2 className="font-song text-xl font-bold md:text-2xl">{s.heading}</h2>
              )}
              {s.quote && (
                <blockquote className="my-6 border-y border-[hsl(var(--ink)/0.6)] py-6">
                  <p className="font-song text-base font-medium leading-loose text-[hsl(var(--ink))] md:text-lg">
                    「{s.quote}」
                  </p>
                </blockquote>
              )}
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="mt-4 font-song text-[15px] leading-loose text-[hsl(var(--ink-soft))]">
                  {p}
                </p>
              ))}
              {s.figure && (
                <Suspense fallback={<div className="my-8 border border-[hsl(var(--line))] p-10 text-center font-song text-xs text-[hsl(var(--ink-3))]">图解加载中…</div>}>
                  <LessonFigure id={s.figure} />
                </Suspense>
              )}
              {s.caseStudy && (
                <div className="my-8 border-2 border-[hsl(var(--ink))]">
                  <div className="flex items-center justify-between border-b border-[hsl(var(--ink))] bg-[hsl(var(--ink))] px-4 py-2.5 md:px-5">
                    <p className="font-song text-sm font-bold tracking-wide text-[hsl(var(--paper))]">
                      {s.caseStudy.title}
                    </p>
                    {s.caseStudy.tag && (
                      <span
                        className={`shrink-0 border px-2 py-0.5 font-mono-num text-[10px] tracking-widest ${
                          s.caseStudy.tag === "失败"
                            ? "border-[hsl(var(--cinnabar))] text-[hsl(var(--cinnabar-bright))]"
                            : "border-[hsl(var(--paper)/0.6)] text-[hsl(var(--paper)/0.85)]"
                        }`}
                      >
                        {s.caseStudy.tag}
                      </span>
                    )}
                  </div>
                  <dl className="divide-y divide-[hsl(var(--line))]">
                    {s.caseStudy.rows.map((r, k) => (
                      <div key={k} className="grid gap-1 px-4 py-3 md:grid-cols-[110px_1fr] md:gap-4 md:px-5">
                        <dt className="font-song text-xs font-bold tracking-widest text-[hsl(var(--cinnabar))]">
                          {r.k}
                        </dt>
                        <dd className="font-song text-sm leading-relaxed text-[hsl(var(--ink-soft))]">{r.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {s.list && (
                <ul className="mt-4 space-y-2.5">
                  {s.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 font-song text-[15px] leading-relaxed text-[hsl(var(--ink-soft))]">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[hsl(var(--cinnabar))]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {/* 作业与毕业标准 */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="border border-[hsl(var(--ink))] p-6">
            <p className="font-song text-sm font-bold tracking-widest">本周作业</p>
            <ul className="mt-4 space-y-2.5">
              {content.homework.map((x) => (
                <li key={x} className="flex items-start gap-2.5 font-song text-sm leading-relaxed">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-[hsl(var(--cinnabar))]" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[hsl(var(--ink))] p-6">
            <p className="font-song text-sm font-bold tracking-widest">过关自检</p>
            <ul className="mt-4 space-y-2.5">
              {content.checkpoint.map((x) => (
                <li key={x} className="flex items-start gap-2.5 font-song text-sm leading-relaxed">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-[hsl(var(--cinnabar))]" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 完成按钮 + 导航 */}
        <div className="mt-14 flex flex-col items-center gap-6">
          <Button
            size="lg"
            variant={isDone ? "outline" : "default"}
            onClick={() => mark(lessonId, !isDone)}
            className={
              isDone
                ? "border-[hsl(var(--cinnabar))] text-[hsl(var(--cinnabar))]"
                : "bg-[hsl(var(--cinnabar))] px-10 text-[hsl(var(--paper))] hover:bg-[hsl(var(--cinnabar-bright))]"
            }
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {isDone ? "已完成（点击取消标记）" : "完成本课，标记进度"}
          </Button>
          <div className="flex w-full items-center justify-between font-song text-sm">
            {nav.prev ? (
              <Link to={`/course/lesson/${nav.prev.id}`} className="flex items-center gap-1.5 text-[hsl(var(--ink-3))] transition-colors hover:text-[hsl(var(--cinnabar))]">
                <ArrowLeft className="h-4 w-4" /> {nav.prev.title}
              </Link>
            ) : <span />}
            {nav.next ? (
              <Link to={`/course/lesson/${nav.next.id}`} className="flex items-center gap-1.5 text-[hsl(var(--ink-3))] transition-colors hover:text-[hsl(var(--cinnabar))]">
                {nav.next.title} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : <span />}
          </div>
        </div>
      </main>
    </div>
  );
}
