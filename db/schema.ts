import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** 课程激活码：买家付款后由 admin 生成发放，兑换后解锁全部课程 */
export const redemptionCodes = mysqlTable("redemption_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  note: varchar("note", { length: 255 }),
  usedBy: bigint("usedBy", { mode: "number", unsigned: true }),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type RedemptionCode = typeof redemptionCodes.$inferSelect;

/** 课程权益：一个用户一条，解锁全部课程 */
export const entitlements = mysqlTable("entitlements", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .unique(),
  source: mysqlEnum("source", ["code", "test", "admin"]).notNull(),
  codeId: bigint("codeId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Entitlement = typeof entitlements.$inferSelect;

/** 课时完成进度 */
export const lessonProgress = mysqlTable(
  "lesson_progress",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    lessonId: varchar("lessonId", { length: 32 }).notNull(),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("uq_user_lesson").on(t.userId, t.lessonId)],
);
export type LessonProgress = typeof lessonProgress.$inferSelect;

// TODO: Add your tables here. See docs/Database.md for schema examples and patterns.
//
// Example:
// export const posts = mysqlTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });
//
// Note: FK columns referencing a serial() PK must use:
//   bigint("columnName", { mode: "number", unsigned: true }).notNull()
