import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/Reveal";

const FAQS = [
  {
    q: "这门课适合谁？",
    a: "适合有一年以上 A 股短线经验、能看懂分时与盘口、但始终无法稳定盈利的交易者。不适合完全零基础的新手，也不适合期待「代码致富」的人——课程教的是体系与训练方法，不荐股。",
  },
  {
    q: "多久能学会？",
    a: "课程设计为 16 周训练周期：前 6 周只练观察不开重仓，中间 4 周每周一个模式专项，最后进入案例复盘与小实盘贯通。他本人从 100 万到 8727 万用了四年，期间体系升级了四次——别指望 16 周封神，但 16 周足够让你拥有自己的「树干树枝」。",
  },
  {
    q: "真的完全免费吗？",
    a: "是。全部 16 课正文、作业与自检清单完全开放，不需要注册、登录或激活码，点开就能学。学习进度保存在你自己的浏览器本地，不清缓存就不会丢。",
  },
  {
    q: "需要登录或注册吗？",
    a: "不需要。网站没有任何账号系统，打开课程页即可开始学习。注意：进度存在本机浏览器中，换设备或清除浏览器数据后进度会重置。",
  },
  {
    q: "内容来源可靠吗？",
    a: "课程全部内容提炼自其公开实盘记录（2015 再战杯逐日资产记录、2016–2020 淘股吧不间断实盘帖）、心法文档与情绪周期 PDF，关键结论均有原文锚点。",
  },
  {
    q: "可以直接照着实盘操作吗？",
    a: "不建议。课程讲的是体系与训练方法，不是荐股或买卖信号。请务必先完成前 6 周的观察训练，再用极小仓位验证，形成自己的样本后再逐步放大。",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="paper-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Reveal>
          <p className="font-mono-num text-xs tracking-[0.3em] text-[hsl(var(--cinnabar))]">FAQ</p>
          <h2 className="mt-4 font-brush text-5xl md:text-6xl">常见问题</h2>
        </Reveal>
        <Reveal delay={100}>
          <Accordion type="single" collapsible className="mt-12">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} className="border-[hsl(var(--ink)/0.7)]">
                <AccordionTrigger className="py-5 text-left font-song text-base font-semibold hover:text-[hsl(var(--cinnabar))] hover:no-underline md:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="font-song text-sm leading-loose text-[hsl(var(--ink-3))]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ink-bg border-t border-[hsl(var(--paper)/0.12)] py-12 text-center text-[hsl(var(--paper)/0.45)]">
      <p className="font-brush text-3xl text-[hsl(var(--paper)/0.8)]">涅盘心法课</p>
      <p className="mt-4 font-song text-xs leading-loose tracking-wider">
        市场永远是对的 · 稳定盈利的交易是训练出来的
      </p>
      <p className="mt-6 font-mono-num text-[10px] tracking-[0.2em]">
        本课程为方法论研究资料，不构成任何投资建议 · 股市有风险，入市需谨慎
      </p>
    </footer>
  );
}
