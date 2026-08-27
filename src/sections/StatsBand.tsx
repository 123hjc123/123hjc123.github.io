const ITEMS = [
  "100万 → 8727万",
  "四年 87 倍",
  "1485 天实盘不间断",
  "再战杯 +168%",
  "全仓回撤 < 10%",
  "六变量情绪仪表盘",
  "确定性三件套",
  "亏钱六情形",
];

export function StatsBand() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-[hsl(var(--ink))] bg-[hsl(var(--cinnabar))] py-3.5 text-[hsl(var(--paper))]">
      <div className="animate-marquee flex w-max items-center whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="mx-6 flex items-center gap-6 font-song text-sm tracking-[0.2em] md:text-base">
            {t}
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-[hsl(var(--paper)/0.7)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
