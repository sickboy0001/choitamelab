import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("DATABASE_URL is not defined");
}

export const client = createClient({
  url: url,
  authToken: authToken,
});

export async function query(sql: string, args?: any[]) {
  try {
    const result = await client.execute({ sql, args: args || [] });
    // result.rows をプレーンなオブジェクトの配列に変換する
    // Next.js の Server Components から Client Components へ渡す際に
    // プレーンなオブジェクトである必要があるため
    const rows = result.rows.map((row) => ({ ...row }));
    return { ...result, rows };
  } catch (error) {
    console.error("Database query failed:", error);
    throw error;
  }
}
