// 课程大纲（前后端共享；课时正文存于服务端，解锁后按课返回）

export type LessonMeta = {
  id: string;
  title: string;
  subtitle: string;
  week: string;
  minutes: number;
  free?: boolean; // 免费试读
};

export type CourseModule = {
  id: string;
  no: string;
  title: string;
  weeks: string;
  goal: string;
  lessons: LessonMeta[];
};

export const COURSE_PRICE = 199; // 元
export const COURSE_PRICE_ORIGINAL = 599;

export const COURSE_MODULES: CourseModule[] = [
  {
    id: "m1",
    no: "壹",
    title: "建骨架：看得懂市场",
    weeks: "第 1–2 周",
    goal: "不看文档画出整个体系的树干树枝图",
    lessons: [
      { id: "1-1", title: "总纲：赚钱效应与树干树枝", subtitle: "投机做的到底是什么；为什么知识越多越做越差", week: "第 1 周", minutes: 40, free: true },
      { id: "1-2", title: "六变量情绪仪表盘", subtitle: "整个体系唯一的观测框架：定义、量化指标、使用口诀", week: "第 1–2 周", minutes: 60, free: true },
    ],
  },
  {
    id: "m2",
    no: "贰",
    title: "观测训练：把仪表盘练成本能",
    weeks: "第 3–6 周",
    goal: "每天盘后给市场拍 X 光，预判次日情绪方向",
    lessons: [
      { id: "2-1", title: "每日打卡法", subtitle: "定点投 100 球与随便投 100 球的区别；打卡表怎么用", week: "第 3 周", minutes: 35 },
      { id: "2-2", title: "周期位置识别", subtitle: "冰点、分歧、走强、高潮（逼空）各自的盘面特征与见底信号", week: "第 4–5 周", minutes: 55 },
      { id: "2-3", title: "「如何侧重」7 条操作映射", subtitle: "六变量强弱组合 → 打法与仓位的映射表逐条拆解", week: "第 5–6 周", minutes: 60 },
    ],
  },
  {
    id: "m3",
    no: "叁",
    title: "模式专项：每周只练一招",
    weeks: "第 7–10 周",
    goal: "每个手法建立「触发条件→情绪前置→案例→我的样本」完整档案",
    lessons: [
      { id: "3-1", title: "半路低吸：主战场打法", subtitle: "走强点确认后跟随；预判、验证、跟随的系统流", week: "第 7 周", minutes: 50 },
      { id: "3-2", title: "打板与确定性三件套", subtitle: "打板 + 做核心 + 只做主升；烂板的差异化优势", week: "第 8 周", minutes: 55 },
      { id: "3-3", title: "买点三分法与卖点五法", subtitle: "预判点/走强点/低风险走强点；五种卖法各在什么情形启用", week: "第 9 周", minutes: 50 },
      { id: "3-4", title: "冰点模式与逼空应对", subtitle: "冰点后买点的量化模板；他自评的短板「畏高」怎么破", week: "第 10 周", minutes: 45 },
    ],
  },
  {
    id: "m4",
    no: "肆",
    title: "仓位与风控：活得久的部分",
    weeks: "第 11–12 周",
    goal: "仓位不再是感觉，而是决策树查出来的数",
    lessons: [
      { id: "4-1", title: "仓位决策树", subtitle: "冰点/分歧/走强三层仓位；2018 熊市防守 vs 2019 进攻体系", week: "第 11 周", minutes: 50 },
      { id: "4-2", title: "止损工具箱与亏钱六情形", subtitle: "每种亏损都有结构，没有冤枉亏；负面清单每日对照", week: "第 11–12 周", minutes: 55 },
      { id: "4-3", title: "大亏恢复五步法与目标制降档", subtitle: "回撤后的流程化恢复；目标完成后主动降低进攻性", week: "第 12 周", minutes: 40 },
    ],
  },
  {
    id: "m5",
    no: "伍",
    title: "案例贯通：从知道到做到",
    weeks: "第 13–16 周",
    goal: "44 张实盘案例卡片过完四步复述，完整 SOP 跑通",
    lessons: [
      { id: "5-1", title: "成功案例拆解四步法", subtitle: "六变量状态→映射条款→手法→仓位，逐张拆给你看", week: "第 13–14 周", minutes: 60 },
      { id: "5-2", title: "失败案例：亏钱的六种结构", subtitle: "17 张失败卡片全部命中亏钱六情形；错误分级制", week: "第 14–15 周", minutes: 55 },
      { id: "5-3", title: "每日 SOP：把一天流程化", subtitle: "盘前 30 分钟、盘中四个检查点、盘后复盘五步法", week: "第 15–16 周", minutes: 50 },
    ],
  },
  {
    id: "m6",
    no: "陆",
    title: "系统进化：形成你自己的系统",
    weeks: "第 17 周起",
    goal: "写出你的《操作手册 v1.0》，只收录验证过能赚钱的东西",
    lessons: [
      { id: "6-1", title: "从模仿到自成一派", subtitle: "树枝怎么长、怎么剪；资金上台阶后的体系切换", week: "长期", minutes: 45 },
    ],
  },
];

export const ALL_LESSONS: LessonMeta[] = COURSE_MODULES.flatMap((m) => m.lessons);
export const TOTAL_LESSONS = ALL_LESSONS.length;
export const FREE_LESSON_IDS = ALL_LESSONS.filter((l) => l.free).map((l) => l.id);

export function findLesson(id: string) {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function lessonNav(id: string) {
  const i = ALL_LESSONS.findIndex((l) => l.id === id);
  return {
    prev: i > 0 ? ALL_LESSONS[i - 1] : undefined,
    next: i >= 0 && i < ALL_LESSONS.length - 1 ? ALL_LESSONS[i + 1] : undefined,
  };
}
