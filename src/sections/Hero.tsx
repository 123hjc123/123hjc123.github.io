import { Link } from "react-router";
import { Reveal } from "@/components/Reveal";

/** 资金曲线（2016.5 → 2020.5，万元） */
const CURVE: Array<[string, number]> = [
  ["2016.5", 100],
  ["2016 底", 218],
  ["2017 底", 350],
  ["2018 底", 994],
  ["2019 底", 3480],
  ["2020.5", 8727],
];

function FundsCurve() {
  const W = 560;
  const H = 300;
  const PAD = 30;
  const maxV = 9000;
  const pts = CURVE.map(([, v], i) => {
    const x = PAD + (i * (W - PAD * 2)) / (CURVE.length - 1);
    const y = H - PAD - (Math.log(v + 1) / Math.log(maxV)) * (H - PAD * 2);
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* 格线 */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - PAD * 2)} y2={PAD + f * (H - PAD * 2)}
          stroke="hsl(42 33% 93% / 0.12)" strokeDasharray="1 5" />
      ))}
      <path d={path} fill="none" stroke="hsl(0 100% 38%)" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="hsl(0 100% 38%)" stroke="hsl(42 33% 93%)" strokeWidth="1.5" />
          <text x={x} y={y - 12} textAnchor="middle" fill="hsl(42 33% 93%)" fontSize="13" fontFamily="'IBM Plex Mono', monospace">
            {CURVE[i][1]}万
          </text>
          <text x={x} y={H - 8} textAnchor="middle" fill="hsl(42 33% 93% / 0.5)" fontSize="11">
            {CURVE[i][0]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Hero() {
  return (
    <section className="ink-bg relative min-h-screen overflow-hidden text-[hsl(var(--paper))]">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:px-10">
        {/* 左：标题 */}
        <div className="relative">
          <Reveal>
            <p className="mb-6 flex items-center gap-3 font-mono-num text-xs tracking-[0.25em] text-[hsl(var(--paper)/0.55)]">
              <span className="inline-block h-px w-10 bg-[hsl(var(--cinnabar-bright))]" />
              淘股吧实盘 · 2016.5.11 — 2020.6.3
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-brush leading-[0.95]" style={{ fontSize: "clamp(4rem, 11vw, 9.5rem)" }}>
              涅盘<br />重升
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-md font-song text-lg leading-relaxed text-[hsl(var(--paper)/0.85)] md:text-xl">
              四年 <span className="font-mono-num text-[hsl(var(--cinnabar-bright))]">87</span> 倍，
              <span className="font-mono-num text-[hsl(var(--cinnabar-bright))]">1485</span> 天实盘不间断。
              <br />
              一套可以学、可以练、可以复制的短线心法体系。
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                to="/course"
                className="seal px-8 py-4 text-xl tracking-[0.2em] transition-transform hover:-translate-y-0.5"
              >
                开始修炼
              </Link>
              <a href="#curriculum" className="border-b border-[hsl(var(--paper)/0.4)] pb-1 font-song text-sm tracking-widest text-[hsl(var(--paper)/0.7)] transition-colors hover:text-[hsl(var(--paper))]">
                查看十六课大纲 ↓
              </a>
            </div>
          </Reveal>
          {/* 竖排小字 */}
          <p className="vertical-text absolute -right-2 top-0 hidden select-none font-song text-sm text-[hsl(var(--paper)/0.35)] lg:block">
            赚钱效应的延续 · 对资金的吸引
          </p>
        </div>

        {/* 右：资金曲线 + 印章 */}
        <Reveal delay={200} className="relative">
          <div className="border border-[hsl(var(--paper)/0.15)] p-6 md:p-8">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="font-song text-sm tracking-[0.3em] text-[hsl(var(--paper)/0.6)]">实盘资金曲线</span>
              <span className="font-mono-num text-xs text-[hsl(var(--paper)/0.4)]">单位：万元 · 对数轴</span>
            </div>
            <FundsCurve />
            <div className="mt-4 flex items-end justify-between">
              <p className="font-song text-xs leading-relaxed text-[hsl(var(--paper)/0.5)]">
                2015 再战杯实盘赛第二名 · 三个月 +168%<br />
                2018 全仓回撤基本控制在 10% 以内
              </p>
              <div className="seal flex h-16 w-16 items-center justify-center text-center text-lg leading-tight">
                心法<br />真传
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
