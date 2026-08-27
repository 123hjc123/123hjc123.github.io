// 课程图解组件库：所有图都是手绘 SVG / HTML，配合纸墨书院视觉。
import type { ReactElement, ReactNode } from "react";

const INK = "hsl(var(--ink))";
const INK3 = "hsl(var(--ink-3))";
const CIN = "hsl(var(--cinnabar))";
const LINE = "hsl(var(--line))";
const GREEN = "hsl(152 45% 32%)";

function Frame({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-8 border border-[hsl(var(--ink))] bg-[hsl(var(--paper))]">
      <div className="p-4 md:p-6">{children}</div>
      {caption && (
        <figcaption className="border-t border-[hsl(var(--line))] px-4 py-2.5 font-song text-xs leading-relaxed text-[hsl(var(--ink-3))] md:px-6">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ---------------- 通用：K线图 ---------------- */

type Candle = { o: number; h: number; l: number; c: number };
type CandleMarker = { i: number; label: string; above?: boolean };

function CandleChart({
  data,
  markers = [],
  height = 240,
}: {
  data: Candle[];
  markers?: CandleMarker[];
  height?: number;
}) {
  const W = 640;
  const H = height;
  const padL = 8;
  const padR = 8;
  const padT = 34;
  const padB = 34;
  const lo = Math.min(...data.map((d) => d.l));
  const hi = Math.max(...data.map((d) => d.h));
  const y = (v: number) => padT + ((hi - v) / (hi - lo || 1)) * (H - padT - padB);
  const bw = (W - padL - padR) / data.length;
  const bodyW = Math.max(4, bw * 0.55);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* 网格 */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padL}
          x2={W - padR}
          y1={padT + f * (H - padT - padB)}
          y2={padT + f * (H - padT - padB)}
          stroke={LINE}
          strokeDasharray="2 4"
        />
      ))}
      {data.map((d, i) => {
        const x = padL + bw * i + bw / 2;
        const up = d.c >= d.o;
        const color = up ? CIN : GREEN;
        const yO = y(d.o);
        const yC = y(d.c);
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(d.h)} y2={y(d.l)} stroke={color} strokeWidth={1.2} />
            <rect
              x={x - bodyW / 2}
              y={Math.min(yO, yC)}
              width={bodyW}
              height={Math.max(1.5, Math.abs(yC - yO))}
              fill={up ? CIN : GREEN}
              fillOpacity={up ? 0.15 : 0.9}
              stroke={color}
              strokeWidth={1.2}
            />
          </g>
        );
      })}
      {markers.map((m, k) => {
        const d = data[m.i];
        if (!d) return null;
        const x = padL + bw * m.i + bw / 2;
        const above = m.above !== false;
        const py = above ? y(d.h) - 10 : y(d.l) + 10;
        const ty = above ? py - 8 : py + 16;
        return (
          <g key={k}>
            <circle cx={x} cy={above ? y(d.h) : y(d.l)} r={3} fill={CIN} />
            <line x1={x} x2={x} y1={above ? y(d.h) : y(d.l)} y2={py} stroke={CIN} strokeWidth={1} />
            <text
              x={x}
              y={ty}
              textAnchor="middle"
              fontSize={11}
              fill={CIN}
              style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600 }}
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- 通用：分时图 ---------------- */

type IntradayMarker = { t: number; label: string; above?: boolean };

function IntradayChart({
  points,
  markers = [],
  yMin = -10,
  yMax = 10,
  height = 220,
}: {
  points: number[]; // 相对昨收的百分比路径，等间隔
  markers?: IntradayMarker[]; // t 为 0..1 的时间比例
  yMin?: number;
  yMax?: number;
  height?: number;
}) {
  const W = 640;
  const H = height;
  const padL = 40;
  const padR = 10;
  const padT = 30;
  const padB = 26;
  const y = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * (H - padT - padB);
  const x = (t: number) => padL + t * (W - padL - padR);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i / (points.length - 1)).toFixed(1)},${y(p).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[yMax, yMax / 2, 0, yMin / 2, yMin].map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke={v === 0 ? INK3 : LINE} strokeDasharray={v === 0 ? "4 3" : "2 4"} strokeWidth={v === 0 ? 1 : 0.8} />
          <text x={padL - 6} y={y(v) + 3.5} textAnchor="end" fontSize={10} fill={INK3} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {v > 0 ? `+${v}%` : `${v}%`}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke={INK} strokeWidth={1.8} />
      {markers.map((m, k) => {
        const px = x(m.t);
        const pv = points[Math.round(m.t * (points.length - 1))];
        const py = y(pv);
        const above = m.above !== false;
        return (
          <g key={k}>
            <circle cx={px} cy={py} r={3.5} fill={CIN} />
            <line x1={px} x2={px} y1={py} y2={above ? py - 14 : py + 14} stroke={CIN} strokeWidth={1} />
            <text
              x={px}
              y={above ? py - 20 : py + 26}
              textAnchor="middle"
              fontSize={11.5}
              fill={CIN}
              style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 700 }}
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- 通用：流程步骤 ---------------- */

function FlowSteps({ steps }: { steps: { title: string; desc: string }[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {steps.map((s, i) => (
        <div key={i} className="relative border border-[hsl(var(--ink))] p-4">
          <p className="font-brush text-2xl text-[hsl(var(--cinnabar))]">{["壹", "贰", "叁", "肆", "伍"][i] ?? i + 1}</p>
          <p className="mt-2 font-song text-sm font-bold">{s.title}</p>
          <p className="mt-1.5 font-song text-xs leading-relaxed text-[hsl(var(--ink-3))]">{s.desc}</p>
          {i < steps.length - 1 && (
            <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[hsl(var(--cinnabar))] md:inline">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- 具体图解 ---------------- */

// 1-1 树干树枝
function FigTreeBranch() {
  const branches = [
    { side: "left", label: "观测层：六变量仪表盘", sub: "涨停数·连板高度·炸板率·指数·涨跌比·溢价" },
    { side: "right", label: "决策层：如何侧重 7 条", sub: "变量组合 → 打法与仓位" },
    { side: "left", label: "确定性三件套", sub: "打板 · 做核心 · 只做主升" },
    { side: "right", label: "技巧层（QWER）", sub: "转折 / 高潮 / 反抽 / 补涨 / 低吸 / 半路" },
    { side: "left", label: "风控枝", sub: "亏钱六情形 · 错误分级 · 目标制降档" },
    { side: "right", label: "进化机制", sub: "每日复盘清单 · 肌肉记忆训练" },
  ];
  return (
    <Frame caption="树干不可动摇，树枝可以修剪嫁接——新学的招式只有挂到树上才有用，散沙般的知识一吹就散。">
      <div className="mx-auto max-w-xl">
        <div className="border-2 border-[hsl(var(--cinnabar))] bg-[hsl(var(--cinnabar))] px-4 py-3 text-center">
          <p className="font-song text-sm font-bold tracking-widest text-[hsl(var(--paper))]">树干：赚钱效应的延续 → 对资金的吸引</p>
          <p className="mt-0.5 font-song text-[11px] text-[hsl(var(--paper)/0.75)]">灵魂 = 焦点核心，情绪（大局观，永不动摇）</p>
        </div>
        <div className="mx-auto h-4 w-px bg-[hsl(var(--ink))]" />
        <div className="space-y-2.5 border-l-2 border-[hsl(var(--ink))] pl-4">
          {branches.map((b, i) => (
            <div key={i} className="relative border border-[hsl(var(--ink)/0.5)] px-4 py-2.5">
              <span className="absolute -left-4 top-1/2 h-px w-4 bg-[hsl(var(--ink))]" />
              <span className="absolute -left-[23px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[hsl(var(--cinnabar))]" />
              <p className="font-song text-sm font-semibold">{b.label}</p>
              <p className="font-song text-[11px] text-[hsl(var(--ink-3))]">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// 1-1 资金阶梯
function FigFundLadder() {
  const steps = [
    { year: "2016.5", fund: "100W", mode: "半路低吸为主", note: "一两成仓高频试错练盘感" },
    { year: "2017", fund: "350W", mode: "模式瓶颈暴露", note: "收益最低年，'标准凸型'曲线" },
    { year: "2018", fund: "994W", mode: "闭关重建·只打板", note: "确定性三件套成型，回撤≤10%" },
    { year: "2019", fund: "3480W", mode: "大周期定仓位", note: "冰点走强点出手，推仓位" },
    { year: "2020", fund: "8727W+", mode: "复盘五步法固化", note: "目标制降档，1485天封贴" },
  ];
  return (
    <Frame caption="四年 87 倍不是同一招的复制，而是体系四次升级。每上一个台阶，打法就换一套——你也一样。">
      <div className="flex items-end gap-2 md:gap-3">
        {steps.map((s, i) => (
          <div key={i} className="flex-1">
            <p className="text-center font-mono-num text-xs font-semibold text-[hsl(var(--cinnabar))] md:text-sm">{s.fund}</p>
            <div
              className="mt-1 border border-[hsl(var(--ink))] bg-[hsl(var(--ink)/0.04)]"
              style={{ height: `${36 + i * 26}px` }}
            />
            <p className="mt-2 text-center font-mono-num text-[11px] font-semibold">{s.year}</p>
            <p className="text-center font-song text-[11px] font-semibold leading-tight">{s.mode}</p>
            <p className="mt-0.5 text-center font-song text-[10px] leading-snug text-[hsl(var(--ink-3))]">{s.note}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// 1-2 六变量仪表盘
function FigSixVars() {
  const vars = [
    { name: "投机情绪", dim: "当期", ind: "涨停数 / 连板数 / 连板高度 / 炸板率", use: "打板接力的直接环境" },
    { name: "市场情绪", dim: "当期", ind: "指数强度 / 涨跌比", use: "大盘广度，防权重护盘假象" },
    { name: "板块情绪", dim: "当期", ind: "高度·强度·位差·走强点·资金偏好", use: "主流方向在哪" },
    { name: "整体市场情绪", dim: "整体", ind: "近期综合赚钱效应 + 论坛氛围 + 消息面", use: "定仓位级别" },
    { name: "整体投机情绪", dim: "整体", ind: "妖股批量否 / 涨停溢价 / 炸板负溢价", use: "风偏天花板" },
    { name: "整体板块情绪", dim: "整体", ind: "龙头是否拉开空间 / 是否一日游", use: "能否持续打" },
  ];
  return (
    <Frame caption="每天收盘后先给六个变量打分，再谈操作。用法铁律：整体定仓位与方向，当期定买卖时点。">
      <div className="grid gap-px border border-[hsl(var(--ink))] bg-[hsl(var(--ink))] md:grid-cols-3">
        {vars.map((v, i) => (
          <div key={i} className="bg-[hsl(var(--paper))] p-4">
            <div className="flex items-baseline justify-between">
              <p className="font-song text-sm font-bold">{i + 1}. {v.name}</p>
              <span className={`px-1.5 py-px font-mono-num text-[10px] tracking-wider ${v.dim === "当期" ? "bg-[hsl(var(--cinnabar))] text-[hsl(var(--paper))]" : "border border-[hsl(var(--ink))]"}`}>
                {v.dim}
              </span>
            </div>
            <p className="mt-2 font-song text-xs leading-relaxed text-[hsl(var(--ink))]">{v.ind}</p>
            <p className="mt-1.5 font-song text-[11px] text-[hsl(var(--ink-3))]">→ {v.use}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-song text-xs text-[hsl(var(--ink-3))]">
        <span>当期变量 = 灵敏，管日内买卖点</span>
        <span>整体变量 = 迟钝，管仓位与趋势</span>
        <span className="text-[hsl(var(--cinnabar))]">关键：什么时候注重哪个变量，最先最重要</span>
      </div>
    </Frame>
  );
}

// 2-2 情绪周期位置图
function FigEmotionCycle() {
  // x 轴：周期行进；y 轴：情绪强度
  const W = 640;
  const H = 280;
  const pts = [
    { x: 40, y: 230, label: "冰点", act: "空仓 / 打首板", sub: "恐慌低吸备选" },
    { x: 130, y: 185, label: "启动", act: "试错仓 1–2 成", sub: "竞价超预期给仓位" },
    { x: 230, y: 120, label: "发酵", act: "走强点上仓位", sub: "半路+打板" },
    { x: 330, y: 60, label: "主升", act: "重仓窗口", sub: "核心股推仓位" },
    { x: 430, y: 35, label: "高潮·逼空", act: "收益风险比降低", sub: "尾盘干小弟/干龙头" },
    { x: 520, y: 95, label: "分歧", act: "只做低风险走强点", sub: "仓位降档" },
    { x: 600, y: 200, label: "退潮·补跌", act: "空仓 / 首板1进2", sub: "别碰情绪票" },
  ];
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return (
    <Frame caption="周期不是四段论，是状态机。红字是每个位置的'标准动作'——位置判错，动作全错。">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={30} x2={W - 10} y1={245} y2={245} stroke={INK3} strokeWidth={0.8} />
        <text x={12} y={60} fontSize={10} fill={INK3} style={{ writingMode: "vertical-rl", fontFamily: "'Noto Serif SC',serif" }}>情绪强度 →</text>
        <path d={path} fill="none" stroke={INK} strokeWidth={2} />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={CIN} />
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} style={{ fontFamily: "'Noto Serif SC',serif" }}>
              {p.label}
            </text>
            <text x={p.x} y={262} textAnchor="middle" fontSize={11} fontWeight={600} fill={CIN} style={{ fontFamily: "'Noto Serif SC',serif" }}>
              {p.act}
            </text>
            <text x={p.x} y={276} textAnchor="middle" fontSize={9.5} fill={INK3} style={{ fontFamily: "'Noto Serif SC',serif" }}>
              {p.sub}
            </text>
          </g>
        ))}
        {/* 回到冰点 */}
        <path d={`M600,200 C 630,235 60,250 44,232`} fill="none" stroke={LINE} strokeDasharray="4 3" />
      </svg>
    </Frame>
  );
}

// 2-1 / 5-3 一日 SOP 时间轴
function FigDaySop() {
  const rows = [
    { t: "前一晚", title: "复盘即写预案", desc: "五步法：阶段→变量→结果→机会→收益风险比；写出次日几种走法与应对，不写废话" },
    { t: "9:15–9:25", title: "竞价验证", desc: "持仓与目标股 vs 预案：竞价超预期→给预判仓；低于预期→准备分批卖" },
    { t: "9:25–9:50", title: "开盘确认", desc: "看第一波方向、板块强度、龙头表现；9:50 前后确认'主动性攻击'再上大仓位" },
    { t: "9:50 后", title: "跟随执行", desc: "符合预案→跟随上大仓位；不符合→小仓或空仓，盘中不临场改主意" },
    { t: "14:25", title: "午后状态确认", desc: "对照亏钱六情形检查持仓结构；确认情绪是否逆转（指数跳水/炸板潮）" },
    { t: "尾盘", title: "隔夜决策", desc: "符合'打提前量'（买次日主动性）才留仓过夜；否则降仓，不确定就逆回购管手" },
    { t: "收盘后", title: "复盘四问", desc: "今天的机会/仓位/买点？昨日涨停溢价为何分化？炸板股为何炸？昨日复盘有无问题？" },
  ];
  return (
    <Frame caption="把一天变成固定流水线。稳定盈利是训练出来的：定点投 100 球 ≠ 随便投 100 球。">
      <div className="space-y-0">
        {rows.map((r, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex w-20 shrink-0 flex-col items-center">
              <span className="border border-[hsl(var(--cinnabar))] px-1.5 py-0.5 text-center font-mono-num text-[10px] font-semibold text-[hsl(var(--cinnabar))]">
                {r.t}
              </span>
              {i < rows.length - 1 && <span className="w-px flex-1 bg-[hsl(var(--ink)/0.3)]" />}
            </div>
            <div className="pb-5">
              <p className="font-song text-sm font-bold">{r.title}</p>
              <p className="mt-1 font-song text-xs leading-relaxed text-[hsl(var(--ink-3))]">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// 4-1 仓位决策树
function FigPositionTree() {
  return (
    <Frame caption="仓位不是感觉，是查表查出来的。任何一层不满足就降档，全账户回撤到 10% 立刻回到试错仓。">
      <div className="space-y-4">
        <div>
          <p className="mb-2 font-song text-xs font-bold tracking-widest text-[hsl(var(--ink-3))]">第一层 · 情绪定开关</p>
          <div className="grid gap-2 md:grid-cols-4">
            {[
              ["系统性风险/情绪差", "空仓或逆回购", true],
              ["情绪弱·无风险", "1–2 成试错", false],
              ["情绪不差", "进第二层", false],
              ["情绪强/逼空", "上限放开", false],
            ].map(([a, b, danger], i) => (
              <div key={i} className={`border p-3 ${danger ? "border-[hsl(var(--cinnabar))] bg-[hsl(var(--cinnabar)/0.06)]" : "border-[hsl(var(--ink)/0.5)]"}`}>
                <p className="font-song text-xs font-semibold">{a}</p>
                <p className={`mt-1 font-song text-sm font-bold ${danger ? "text-[hsl(var(--cinnabar))]" : ""}`}>{b}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center"><span className="text-[hsl(var(--cinnabar))]">↓</span></div>
        <div>
          <p className="mb-2 font-song text-xs font-bold tracking-widest text-[hsl(var(--ink-3))]">第二层 · 确定性三件套核验（缺一降一档）</p>
          <div className="grid gap-2 md:grid-cols-3">
            {["打板或等同打板的追高？", "核心？市场地位最高？", "主升？非下降趋势？"].map((q, i) => (
              <div key={i} className="border border-[hsl(var(--ink)/0.5)] p-3 text-center font-song text-xs font-semibold">{q}</div>
            ))}
          </div>
        </div>
        <div className="flex justify-center"><span className="text-[hsl(var(--cinnabar))]">↓</span></div>
        <div>
          <p className="mb-2 font-song text-xs font-bold tracking-widest text-[hsl(var(--ink-3))]">第三层 · 收益风险比映射仓位档</p>
          <div className="grid gap-2 md:grid-cols-4">
            {[
              ["基本不亏+收益巨大", "1/3 仓（重仓线）"],
              ["确定性高·风险可控", "常规 10%–30%"],
              ["预判成分大/分歧厉害", "只做低风险走强点"],
              ["绝对上限", "4/5 仓（自我加锁）"],
            ].map(([a, b], i) => (
              <div key={i} className="border border-[hsl(var(--ink))] bg-[hsl(var(--ink)/0.04)] p-3">
                <p className="font-song text-xs text-[hsl(var(--ink-3))]">{a}</p>
                <p className="mt-1 font-song text-sm font-bold text-[hsl(var(--cinnabar))]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

// 3-1 半路：浙商证券主动性攻击分时
function FigIntradayAttack() {
  // 模拟 2017-07-05 浙商证券分时：平开震荡→9:50 主动性攻击→拉升→涨停
  const pts: number[] = [];
  const seg = (from: number, to: number, n: number) => {
    for (let i = 0; i < n; i++) pts.push(from + ((to - from) * i) / (n - 1) + (i % 2 === 0 ? 0.15 : -0.15));
  };
  seg(0.5, 1.2, 20);      // 开盘到 9:50 平开小幅震荡
  seg(1.2, 5.5, 18);      // 9:50 主动性攻击拉升
  seg(5.5, 7.5, 14);      // 横盘换手
  seg(7.5, 10, 16);       // 午后封板
  seg(10, 10, 10);
  return (
    <Frame caption="半路模式的仓位扳机 = 主动性攻击确认。9:50 之前只是观察，确认之后敢于大仓位（案例：2017-07-05 浙商证券）。">
      <IntradayChart
        points={pts}
        markers={[
          { t: 0.24, label: "9:50 主动性攻击确认" },
          { t: 0.24, label: "", above: false },
          { t: 0.66, label: "封板" },
        ].filter((m) => m.label)}
        yMin={-2}
        yMax={10}
      />
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-song text-xs text-[hsl(var(--ink-3))]">
        <span>确认前：轻仓观察，不动</span>
        <span>确认信号：放量 + 分时陡直 + 板块共振</span>
        <span>确认后：拉升中段跟随，直接上大仓位</span>
      </div>
    </Frame>
  );
}

// 3-4 冰点低吸：江丰电子分时
function FigIntradayJiangfeng() {
  const pts: number[] = [];
  const seg = (from: number, to: number, n: number) => {
    for (let i = 0; i < n; i++) pts.push(from + ((to - from) * i) / (n - 1) + (i % 2 === 0 ? 0.2 : -0.2));
  };
  seg(-2, -6, 12);   // 低开下杀
  seg(-6, -9, 10);   // 9:37 恐慌低点
  seg(-9, -5, 14);   // 企稳回升
  seg(-5, -2.5, 18); // 午后继续修复
  seg(-2.5, -2, 10);
  return (
    <Frame caption="2017-11-27 江丰电子：芯片早盘不补跌 = 走强点；9:37 跌 9 个点加买 70W。两重安全垫 = 板块抗跌 + 买入价已计提尾盘补跌。">
      <IntradayChart
        points={pts}
        markers={[
          { t: 0.05, label: "竞价 30W（偏险）" },
          { t: 0.3, label: "9:37 跌 -9% 加买 70W", above: false },
        ]}
        yMin={-10}
        yMax={2}
      />
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-song text-xs text-[hsl(var(--ink-3))]">
        <span>前提：市场合力杀跌阶段，只低吸恐慌盘</span>
        <span>标的三要素：前期有人气 + 超跌 + 股性好</span>
        <span className="text-[hsl(var(--cinnabar))]">越恐慌，杀得越深，收益风险比越高</span>
      </div>
    </Frame>
  );
}

// 3-2 打板：一封二封三封示意
function FigLimitBoard() {
  const pts: number[] = [];
  const seg = (from: number, to: number, n: number) => {
    for (let i = 0; i < n; i++) pts.push(from + ((to - from) * i) / (n - 1));
  };
  seg(2, 6, 10);
  seg(6, 10, 6); seg(10, 8, 4);   // 一封触板回落
  seg(8, 10, 6); seg(10, 8.8, 4); // 二封触板回落（回落更浅）
  seg(8.8, 10, 6);                 // 三封
  seg(10, 10, 20);                 // 封死
  return (
    <Frame caption="连续上板、抛压递减、回落一次比一次浅 = 筹码沉淀。'三开后抛压已小，排在 7000 手后面就已经很安全'（亚玛顿）。">
      <IntradayChart
        points={pts}
        markers={[
          { t: 0.22, label: "一封" },
          { t: 0.44, label: "二封" },
          { t: 0.62, label: "三封排入" },
        ]}
        yMin={0}
        yMax={10}
      />
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-song text-xs text-[hsl(var(--ink-3))]">
        <span>第几封上看预判：人气高一封就能封就一封上</span>
        <span>板上放量换手 = 当天风险已释放</span>
        <span className="text-[hsl(var(--cinnabar))]">无缘无故高开秒板，反而要警惕</span>
      </div>
    </Frame>
  );
}

// 3-3 买点三分法 K线图
function FigBuyPoints() {
  // 一段上升段 K 线，标注 预判点 / 走强点 / 低风险走强点
  const data: Candle[] = [
    { o: 20, h: 20.8, l: 19.5, c: 20.3 },
    { o: 20.3, h: 20.9, l: 20.0, c: 20.6 },
    { o: 20.5, h: 20.7, l: 19.9, c: 20.1 },
    { o: 20.1, h: 21.2, l: 20.0, c: 21.0 }, // 预判点：按昨晚预案提前介入
    { o: 21.0, h: 22.2, l: 20.9, c: 22.0 },
    { o: 22.0, h: 23.5, l: 21.9, c: 23.3 }, // 走强点：爆点确认
    { o: 23.3, h: 24.2, l: 22.8, c: 23.2 },
    { o: 23.2, h: 24.8, l: 23.1, c: 24.6 }, // 低风险走强点：回踩不破再上
    { o: 24.6, h: 26.0, l: 24.4, c: 25.8 },
    { o: 25.8, h: 27.2, l: 25.6, c: 27.0 },
    { o: 27.0, h: 27.5, l: 26.2, c: 26.5 },
    { o: 26.5, h: 26.8, l: 25.4, c: 25.6 },
  ];
  return (
    <Frame caption="同一波行情三个介入位置：情绪好用预判点（便宜但可能错），通用走强点（确定性最高），分歧期只用低风险走强点（当日几乎不亏）。">
      <CandleChart
        data={data}
        markers={[
          { i: 3, label: "预判点", above: false },
          { i: 5, label: "走强点" },
          { i: 7, label: "低风险走强点" },
        ]}
      />
      <div className="mt-2 grid gap-2 font-song text-xs md:grid-cols-3">
        <p><span className="font-bold text-[hsl(var(--cinnabar))]">预判点</span>：验证信号出现前按复盘预案介入；情绪条件好时才放大</p>
        <p><span className="font-bold text-[hsl(var(--cinnabar))]">走强点</span>：盘中爆点、能看出板块效应就上；确定性最高</p>
        <p><span className="font-bold text-[hsl(var(--cinnabar))]">低风险走强点</span>：走强且位置结构使当日难亏；分歧期唯一出手位</p>
      </div>
    </Frame>
  );
}

// 3-4 逼空两种结构
function FigBikongStructure() {
  const Panel = ({ title, weak, lines }: { title: string; weak?: boolean; lines: { d: string; color: string; label: string }[] }) => (
    <div className={`border p-3 ${weak ? "border-[hsl(var(--ink)/0.4)]" : "border-[hsl(var(--cinnabar))]"}`}>
      <p className="font-song text-xs font-bold">{title}</p>
      <svg viewBox="0 0 300 120" className="mt-2 w-full">
        <line x1={10} x2={290} y1={100} y2={100} stroke={LINE} />
        {lines.map((l, i) => (
          <g key={i}>
            <path d={l.d} fill="none" stroke={l.color} strokeWidth={2} strokeDasharray={l.label.includes("小弟") ? "3 3" : undefined} />
            <text x={250} y={l.d.startsWith("M10,") ? 0 : 0} fontSize={0}>{""}</text>
          </g>
        ))}
        {lines.map((l, i) => (
          <text key={`t${i}`} x={252} y={30 + i * 18} fontSize={10} fill={l.color} style={{ fontFamily: "'Noto Serif SC',serif" }}>
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
  return (
    <Frame caption="8.2 方大炭素（龙头独走）：龙头一开板，小弟稀里哗啦——只能干龙头。8.3 钢铁（板块主动攻击）：你追我赶，抗分歧——全梯队可买。">
      <div className="grid gap-3 md:grid-cols-2">
        <Panel
          title="龙头带领型（弱）→ 只干龙头"
          weak
          lines={[
            { d: "M10,95 C 80,90 120,40 180,20 C 200,14 210,30 230,45", color: INK, label: "龙头" },
            { d: "M10,98 C 80,95 120,60 180,45 C 200,42 210,70 230,85", color: INK3, label: "小弟" },
          ]}
        />
        <Panel
          title="板块主动攻击型（强）→ 梯队可买"
          lines={[
            { d: "M10,95 C 80,85 140,45 230,18", color: CIN, label: "龙头" },
            { d: "M10,98 C 80,92 140,60 230,35", color: INK, label: "小弟" },
          ]}
        />
      </div>
    </Frame>
  );
}

// 4-3 大亏恢复五步
function FigRecoverFlow() {
  return (
    <Frame caption="大亏之后最危险的不是亏钱，是急于翻本的赌徒心理。五步走下来，把情绪归零再上桌。">
      <FlowSteps
        steps={[
          { title: "物理停手", desc: "逆回购 / 强制空仓，先把手机从交易软件上移开" },
          { title: "情绪隔离", desc: "打游戏、看电影、请假。收盘后心态自然会回来" },
          { title: "心态归零", desc: "下一笔忘记一切：好牌烂牌都打出最优解" },
          { title: "归因系统", desc: "认知错→改模式；纪律错→改流程；事故错→改状态管理" },
          { title: "加倍学习", desc: "做得不好，每天学习从 3 小时加到 4 小时" },
        ]}
      />
    </Frame>
  );
}

// 5-1 案例拆解四步法
function FigCaseMethod() {
  return (
    <Frame caption="每张案例卡片按同一条流水线过四遍——不走过第四遍（仓位），案例就只是故事。">
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { t: "① 六变量状态", d: "当天涨停数/连板高度/炸板率/指数/涨跌比/溢价，各打强弱分" },
          { t: "② 映射条款", d: "对照'如何侧重'7 条，这条案例命中哪一条" },
          { t: "③ 手法买点", d: "用了哪个模式（半路/打板/潜伏/排一字），买点属三分法哪类" },
          { t: "④ 仓位核算", d: "确定性×收益风险比=几成仓；他当时给了多少、对错如何" },
        ].map((s, i) => (
          <div key={i} className="border border-[hsl(var(--ink))] p-4">
            <p className="font-song text-sm font-bold text-[hsl(var(--cinnabar))]">{s.t}</p>
            <p className="mt-2 font-song text-xs leading-relaxed text-[hsl(var(--ink-3))]">{s.d}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// 2-1 每日打卡表
function FigCheckinTable() {
  const rows = [
    { v: "① 投机情绪（当期）", r: "涨停 38 家 / 连板 9 家 / 高度 4 板 / 炸板率 41%", j: "中偏弱", hot: false },
    { v: "② 市场情绪（当期）", r: "指数 -0.6% / 涨跌比 1:2.3", j: "弱", hot: false },
    { v: "③ 板块情绪（当期）", r: "无主流，老题材高位分歧，无走强点", j: "弱", hot: false },
    { v: "④ 整体市场情绪", r: "近一周赚钱效应收敛，论坛情绪降温", j: "转弱", hot: true },
    { v: "⑤ 整体投机情绪", r: "昨日涨停今日平均溢价 -1.2%，炸板负溢价扩大", j: "差", hot: true },
    { v: "⑥ 整体板块情绪", r: "龙头未拉开空间，题材一日游", j: "差", hot: true },
  ];
  return (
    <Frame caption="示例打卡：三个'整体'变量全部转差 → 次日预案 = 空仓或 1–2 成试错，只做低风险走强点。打卡的价值不在记录，在得出最后一行的预案。">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-song text-xs">
          <thead>
            <tr className="border-b border-[hsl(var(--ink))]">
              <th className="py-2 pr-3 text-left font-bold">变量</th>
              <th className="py-2 pr-3 text-left font-bold">今日读数</th>
              <th className="py-2 text-left font-bold">判定</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[hsl(var(--line))]">
                <td className="py-2.5 pr-3 font-semibold">{r.v}</td>
                <td className="py-2.5 pr-3 font-mono-num text-[11px] text-[hsl(var(--ink-3))]">{r.r}</td>
                <td className={`py-2.5 font-bold ${r.hot ? "text-[hsl(var(--cinnabar))]" : ""}`}>{r.j}</td>
              </tr>
            ))}
            <tr>
              <td className="py-2.5 pr-3 font-bold text-[hsl(var(--cinnabar))]">结论 → 次日预案</td>
              <td colSpan={2} className="py-2.5 font-song text-xs font-semibold text-[hsl(var(--cinnabar))]">
                整体转差 + 当期弱 = 防守日：空仓/试错仓，不做接力，不开新题材仓
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

/* ---------------- 注册表 ---------------- */

const FIGURES: Record<string, () => ReactElement> = {
  "tree-branch": FigTreeBranch,
  "checkin-table": FigCheckinTable,
  "fund-ladder": FigFundLadder,
  "six-vars": FigSixVars,
  "emotion-cycle": FigEmotionCycle,
  "day-sop": FigDaySop,
  "position-tree": FigPositionTree,
  "intraday-attack": FigIntradayAttack,
  "intraday-jiangfeng": FigIntradayJiangfeng,
  "limit-board": FigLimitBoard,
  "buy-points": FigBuyPoints,
  "bikong-structure": FigBikongStructure,
  "recover-flow": FigRecoverFlow,
  "case-method": FigCaseMethod,
};

export function LessonFigure({ id }: { id: string }) {
  const C = FIGURES[id];
  if (!C) return null;
  return <C />;
}
