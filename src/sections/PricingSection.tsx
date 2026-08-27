import { TOTAL_LESSONS } from "@contracts/course";
import { Reveal } from "@/components/Reveal";
import { Link } from "react-router";

const INCLUDED = [
  `全部 ${TOTAL_LESSONS} 课正文，完全开放`,
  "六变量每日打卡模板",
  "复盘五步法与每日 SOP 流程卡",
  "仓位决策树 / 止损工具箱 / 亏钱六情形速查卡",
  "44 张实盘案例卡片的四步拆解法",
  "课程后续更新免费",
];

export function PricingSection() {
  return (
    <section id="pricing" className="ink-bg py-24 text-[hsl(var(--paper))] md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <Reveal>
          <p className="font-mono-num text-xs tracking-[0.3em] text-[hsl(var(--cinnabar-bright))]">FREE</p>
          <h2 className="mt-4 font-brush text-5xl md:text-6xl">免费开放 · 立即修炼</h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mx-auto mt-14 max-w-md border border-[hsl(var(--paper)/0.2)] p-8 md:p-12">
            <div className="flex items-baseline justify-center gap-4">
              <span className="font-mono-num text-6xl font-semibold md:text-7xl">¥0</span>
            </div>
            <p className="mt-3 font-song text-sm text-[hsl(var(--paper)/0.6)]">全部课时 · 无需登录 · 无需激活码</p>
            <ul className="mt-9 space-y-3 text-left">
              {INCLUDED.map((t) => (
                <li key={t} className="flex items-start gap-3 font-song text-sm leading-relaxed text-[hsl(var(--paper)/0.85)]">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[hsl(var(--cinnabar-bright))]" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              to="/course"
              className="seal mt-10 block px-8 py-4 text-xl tracking-[0.25em] transition-transform hover:-translate-y-0.5"
            >
              开始学习
            </Link>
            <p className="mt-5 font-song text-xs leading-relaxed text-[hsl(var(--paper)/0.45)]">
              点开即学，学习进度自动保存在你的浏览器里
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
