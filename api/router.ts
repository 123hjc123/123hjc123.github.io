import { adminRouter } from "./admin-router";
import { authRouter } from "./auth-router";
import { courseRouter } from "./course-router";
import { demoRouter } from "./demo-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  demo: demoRouter,
  course: courseRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
