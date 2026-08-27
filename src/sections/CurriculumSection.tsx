import { COURSE_MODULES, TOTAL_LESSONS } from "@contracts/course";
import { Reveal } from "@/components/Reveal";

export function CurriculumSection() {
  return (
    <section id="curriculum" className="paper-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <p className="font-mono-num text-xs tracking-[0.3em] text-[hsl(var(--cinnabar))]">CURRICULUM</p>
          <h2 className="mt-4 font-brush text-5xl leading-tight md:text-7xl">
            十六课 · 六重门
          </h2>
          <p className="mt-5 max-w-2xl font-song text-base leading-relaxed text-[hsl(var(--ink-3))]">
            按他本人体系进化的顺序学：先解决「看得懂」，再解决「做得对」，最后解决「做得久」。
            共 {TOTAL_LESSONS} 课，16 周完成，每周固定专项训练。
          </p>
        </Reveal>

        <div className="mt-16 space-y-0 border-t border-[hsl(var(--ink))]">
          {COURSE_MODULES.map((m, idx) => (
            <Reveal key={m.id} delay={idx * 40}>
              <div className="group grid grid-cols-[auto_1fr] gap-5 border-b border-[hsl(var(--ink))] py-8 transition-colors md:grid-cols-[100px_1fr_1.2fr] md:gap-10 md:py-10">
                <div className="font-brush text-4xl text-[hsl(var(--cinnabar))] md:text-6xl">{m.no}</div>
                <div>
                  <h3 className="font-song text-xl font-bold md:text-2xl">{m.title}</h3>
                  <p className="mt-2 font-mono-num text-xs tracking-widest text-[hsl(var(--ink-3))]">{m.weeks}</p>
                  <p className="mt-3 font-song text-sm leading-relaxed text-[hsl(var(--ink-3))]">目标：{m.goal}</p>
                </div>
                <ol className="col-span-2 mt-4 space-y-2.5 md:col-span-1 md:mt-0">
                  {m.lessons.map((l) => (
                    <li key={l.id} className="flex items-baseline gap-3 text-sm leading-relaxed">
                      <span className="font-mono-num shrink-0 text-xs text-[hsl(var(--cinnabar))]">{l.id}</span>
                      <span className="font-medium">{l.title}</span>
                      {l.free && (
                        <span className="shrink-0 border border-[hsl(var(--cinnabar))] px-1.5 py-px text-[10px] tracking-wider text-[hsl(var(--cinnabar))]">
                          入门
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
