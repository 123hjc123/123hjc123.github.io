import { randomBytes } from "node:crypto";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { redemptionCodes } from "@db/schema";

function genCode() {
  // 12 位大写字母数字，去掉易混淆字符 0/O/1/I
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(12);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export const adminRouter = createRouter({
  /** 生成一批激活码（仅 admin） */
  generateCodes: adminQuery
    .input(z.object({ count: z.number().int().min(1).max(50), note: z.string().max(255).optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const created: string[] = [];
      for (let i = 0; i < input.count; i++) {
        const code = genCode();
        await db.insert(redemptionCodes).values({ code, note: input.note });
        created.push(code);
      }
      return { created };
    }),

  /** 激活码列表（仅 admin） */
  listCodes: adminQuery.query(async () => {
    const rows = await getDb()
      .select()
      .from(redemptionCodes)
      .orderBy(desc(redemptionCodes.id))
      .limit(200);
    return rows;
  }),
});
