import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { FREE_LESSON_IDS, findLesson } from "@contracts/course";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { entitlements, lessonProgress, redemptionCodes } from "@db/schema";
import { LESSON_CONTENT } from "./course-content";

async function getEntitlement(userId: number) {
  const rows = await getDb()
    .select()
    .from(entitlements)
    .where(eq(entitlements.userId, userId))
    .limit(1);
  return rows.at(0) ?? null;
}

export const courseRouter = createRouter({
  /** 当前用户的课程状态：是否解锁 + 已完成课时 */
  myStatus: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const ent = await getEntitlement(ctx.user.id);
    const progress = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, ctx.user.id));
    return {
      // admin（站长）自动解锁
      entitled: !!ent || ctx.user.role === "admin",
      source: ctx.user.role === "admin" ? "admin" : ent?.source ?? null,
      completedLessonIds: progress.map((p) => p.lessonId),
    };
  }),

  /** 激活码兑换 */
  redeem: authedQuery
    .input(z.object({ code: z.string().trim().min(4).max(32) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const code = input.code.toUpperCase();

      const existing = await getEntitlement(ctx.user.id);
      if (existing) return { success: true, already: true };

      const rows = await db
        .select()
        .from(redemptionCodes)
        .where(eq(redemptionCodes.code, code))
        .limit(1);
      const row = rows.at(0);
      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "激活码不存在，请核对后重试" });
      }
      if (row.usedBy) {
        throw new TRPCError({ code: "CONFLICT", message: "该激活码已被使用" });
      }
      await db
        .update(redemptionCodes)
        .set({ usedBy: ctx.user.id, usedAt: new Date() })
        .where(eq(redemptionCodes.id, row.id));
      await db
        .insert(entitlements)
        .values({ userId: ctx.user.id, source: "code", codeId: row.id });
      return { success: true, already: false };
    }),

  /** 获取课时正文（试读课免费，其余需解锁；正文只在服务端） */
  lesson: authedQuery
    .input(z.object({ lessonId: z.string().min(1).max(32) }))
    .query(async ({ ctx, input }) => {
      const meta = findLesson(input.lessonId);
      const content = LESSON_CONTENT[input.lessonId];
      if (!meta || !content) {
        throw new TRPCError({ code: "NOT_FOUND", message: "课时不存在" });
      }
      const isFree = FREE_LESSON_IDS.includes(input.lessonId);
      const ent = await getEntitlement(ctx.user.id);
      const entitled = !!ent || ctx.user.role === "admin";
      if (!isFree && !entitled) {
        throw new TRPCError({ code: "FORBIDDEN", message: "该课时需激活课程后学习" });
      }
      return { meta, content, locked: false };
    }),

  /** 标记课时完成 */
  completeLesson: authedQuery
    .input(z.object({ lessonId: z.string().min(1).max(32) }))
    .mutation(async ({ ctx, input }) => {
      if (!findLesson(input.lessonId)) {
        throw new TRPCError({ code: "NOT_FOUND", message: "课时不存在" });
      }
      await getDb()
        .insert(lessonProgress)
        .values({ userId: ctx.user.id, lessonId: input.lessonId })
        .onDuplicateKeyUpdate({ set: { completedAt: new Date() } });
      return { success: true };
    }),

  /** 取消完成标记 */
  uncompleteLesson: authedQuery
    .input(z.object({ lessonId: z.string().min(1).max(32) }))
    .mutation(async ({ ctx, input }) => {
      await getDb()
        .delete(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, ctx.user.id),
            eq(lessonProgress.lessonId, input.lessonId),
          ),
        );
      return { success: true };
    }),
});
