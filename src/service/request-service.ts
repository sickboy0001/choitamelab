import { query } from "@/lib/db";
import { auth } from "@/auth";
import { saveHistory } from "./history-service";
import { isAdministrator } from "@/lib/user";
import { nanoid } from "nanoid";

export async function getRequests() {
  const session = await auth();
  const userId = session?.user?.id;

  // 公開設定と有効設定に基づくフィルタリング
  // 1. 有効(is_active)がFalse：作成者のみ
  // 2. 有効がTrue：ログイン者が見れる
  // 3. 有効がTrueかつ公開(is_public)がTrue：非ログイン者も見れる

  let sql = `
    SELECT r.*, u.display_name as author_name
    FROM cit_requests r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE 
  `;

  const conditions = [];
  const args = [];

  if (userId) {
    // ログイン済み：自分のもの OR 有効なもの
    conditions.push(`(r.user_id = ? OR r.is_active = 1)`);
    args.push(userId);
  } else {
    // 未ログイン：有効かつ公開なもの
    conditions.push(`(r.is_active = 1 AND r.is_public = 1)`);
  }

  sql += conditions.join(" AND ") + " ORDER BY r.updated_at DESC";

  const result = await query(sql, args);
  return result.rows;
}

export async function createRequest(data: {
  title: string;
  appeal_point: string;
  content_markdown: string;
  max_reports: number;
  is_active: boolean;
  is_public: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = nanoid(8);
  const sql = `
    INSERT INTO cit_requests (id, user_id, title, appeal_point, content_markdown, max_reports, is_active, is_public, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;
  const args = [
    id,
    session.user.id,
    data.title,
    data.appeal_point,
    data.content_markdown,
    data.max_reports || 0,
    data.is_active ? 1 : 0,
    data.is_public ? 1 : 0,
  ];

  await query(sql, args);
  return id;
}

export async function updateRequest(
  id: string,
  data: {
    title: string;
    appeal_point: string;
    content_markdown: string;
    max_reports: number;
    is_active: boolean;
    is_public: boolean;
  },
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 更新前に履歴を保存
  await saveHistory("request", id);

  let sql = `
    UPDATE cit_requests 
    SET title = ?, appeal_point = ?, content_markdown = ?, max_reports = ?, is_active = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const args = [
    data.title,
    data.appeal_point,
    data.content_markdown,
    data.max_reports || 0,
    data.is_active ? 1 : 0,
    data.is_public ? 1 : 0,
    id,
  ];

  // 管理者でない場合は、自分の投稿のみ更新可能
  if (!isAdministrator(session)) {
    sql += " AND user_id = ?";
    args.push(session.user.id);
  }

  await query(sql, args);
}

export async function deleteRequest(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 管理者でない場合は、自分の投稿のみ削除可能であることを確認するために、まずデータを取得
  const checkSql = "SELECT user_id FROM cit_requests WHERE id = ?";
  const checkResult = await query(checkSql, [id]);
  if (checkResult.rows.length === 0) return;

  const request = checkResult.rows[0];
  if (!isAdministrator(session) && request.user_id !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // 関連データの削除
  // 1. 報告(reports)に関連するコメント
  await query(
    `DELETE FROM cit_comments WHERE target_type = 'report' AND target_id IN (SELECT id FROM cit_reports WHERE request_id = ?)`,
    [id],
  );
  // 2. 依頼(requests)に関連するコメント
  await query(
    `DELETE FROM cit_comments WHERE target_type = 'request' AND target_id = ?`,
    [id],
  );
  // 3. 報告に関連するいいね
  await query(
    `DELETE FROM cit_likes WHERE target_type = 'report' AND target_id IN (SELECT id FROM cit_reports WHERE request_id = ?)`,
    [id],
  );
  // 4. 依頼に関連するいいね
  await query(
    `DELETE FROM cit_likes WHERE target_type = 'request' AND target_id = ?`,
    [id],
  );
  // 5. 報告に関連する履歴
  await query(
    `DELETE FROM cit_histories WHERE target_type = 'report' AND target_id IN (SELECT id FROM cit_reports WHERE request_id = ?)`,
    [id],
  );
  // 6. 依頼に関連する履歴
  await query(
    `DELETE FROM cit_histories WHERE target_type = 'request' AND target_id = ?`,
    [id],
  );
  // 7. 報告の削除
  await query(`DELETE FROM cit_reports WHERE request_id = ?`, [id]);
  // 8. 依頼の削除
  await query(`DELETE FROM cit_requests WHERE id = ?`, [id]);
}
