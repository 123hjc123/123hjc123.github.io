import * as cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, publicQuery } from "./middleware";
import { signSessionToken } from "./kimi/session";
import { env } from "./lib/env";
import { findUserByUnionId, upsertUser } from "./queries/users";
import { getDb } from "./queries/connection";
import { entitlements } from "@db/schema";

export const DEMO_UNION_ID = "demo_free_tester_v1";
export const DEMO_NAME = "测试学员";

/**
 * 永久免费测试账号：无需 Kimi 登录，一键进入，自动解锁全部课程。
 * 用于体验课件完整功能；所有访客共享同一个测试身份。
 */
export const demoRouter = createRouter({
  testLogin: publicQuery.mutation(async ({ ctx }) => {
    await upsertUser({ unionId: DEMO_UNION_ID, name: DEMO_NAME });
    const user = await findUserByUnionId(DEMO_UNION_ID);
    if (!user) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "测试账号创建失败" });
    }
    // 永久解锁课程（幂等）
    await getDb()
      .insert(entitlements)
      .values({ userId: user.id, source: "test" })
      .onDuplicateKeyUpdate({ set: { source: "test" } });

    const token = await signSessionToken({
      unionId: user.unionId,
      clientId: env.appId,
    });
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, token, {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: Session.maxAgeMs / 1000,
      }),
    );
    return { success: true, name: user.name };
  }),
});
