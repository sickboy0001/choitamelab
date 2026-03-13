import { query } from "@/lib/db";

export async function saveHistory(
  targetType: "request" | "report",
  targetId: string,
) {
  let tableName = targetType === "request" ? "cit_requests" : "cit_reports";

  // 現在のデータを取得
  const result = await query(`SELECT * FROM ${tableName} WHERE id = ?`, [
    targetId,
  ]);
  const currentData = result.rows[0];

  if (!currentData) return;

  const historyId = crypto.randomUUID();
  const sql = `
    INSERT INTO cit_histories (id, target_type, target_id, old_data)
    VALUES (?, ?, ?, ?)
  `;
  await query(sql, [
    historyId,
    targetType,
    targetId,
    JSON.stringify(currentData),
  ]);
}
