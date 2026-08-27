import mysql from "mysql2/promise";
import { env } from "./lib/env";

/**
 * Idempotent schema bootstrap.
 * The sandbox cannot reach the VPC-internal MySQL endpoint, so tables are
 * ensured at server startup instead of via `db:push`. All statements use
 * CREATE TABLE IF NOT EXISTS — safe to run on every boot.
 */
const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS \`users\` (
    \`id\` serial AUTO_INCREMENT NOT NULL,
    \`unionId\` varchar(255) NOT NULL,
    \`name\` varchar(255),
    \`email\` varchar(320),
    \`avatar\` text,
    \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()),
    \`lastSignInAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`users_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`users_unionId_unique\` UNIQUE(\`unionId\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`redemption_codes\` (
    \`id\` serial AUTO_INCREMENT NOT NULL,
    \`code\` varchar(32) NOT NULL,
    \`note\` varchar(255),
    \`usedBy\` bigint unsigned,
    \`usedAt\` timestamp NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`redemption_codes_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`redemption_codes_code_unique\` UNIQUE(\`code\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`entitlements\` (
    \`id\` serial AUTO_INCREMENT NOT NULL,
    \`userId\` bigint unsigned NOT NULL,
    \`source\` enum('code','test','admin') NOT NULL,
    \`codeId\` bigint unsigned,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`entitlements_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`entitlements_userId_unique\` UNIQUE(\`userId\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`lesson_progress\` (
    \`id\` serial AUTO_INCREMENT NOT NULL,
    \`userId\` bigint unsigned NOT NULL,
    \`lessonId\` varchar(32) NOT NULL,
    \`completedAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`lesson_progress_id\` PRIMARY KEY(\`id\`)
  )`,
  // unique index on lesson_progress is created separately so a duplicate-index
  // error on re-run can be safely ignored
  `CREATE UNIQUE INDEX \`uq_user_lesson\` ON \`lesson_progress\` (\`userId\`, \`lessonId\`)`,
];

export async function ensureSchema(): Promise<void> {
  const conn = await mysql.createConnection(env.databaseUrl);
  try {
    for (const sql of STATEMENTS) {
      try {
        await conn.query(sql);
      } catch (err) {
        const code = (err as { code?: string }).code;
        // 42S11 = ER_DUP_INDEX (index already exists) — safe to ignore
        if (code !== "42S11" && code !== "ER_DUP_KEYNAME") throw err;
      }
    }
    console.log("[db] schema ensured");
  } finally {
    await conn.end();
  }
}
