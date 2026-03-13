import { query } from "@/lib/db";
import { auth } from "@/auth";
import { saveHistory } from "./history-service";
import { isAdministrator } from "@/lib/user";

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

  sql += conditions.join(" AND ") + " ORDER BY r.created_at DESC";

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

  const id = crypto.randomUUID();
  const sql = `
    INSERT INTO cit_requests (id, user_id, title, appeal_point, content_markdown, max_reports, is_active, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const args = [
    id,
    session.user.id,
    data.title,
    data.appeal_point,
    data.content_markdown,
    data.max_reports,
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
    SET title = ?, appeal_point = ?, content_markdown = ?, max_reports = ?, is_active = ?, is_public = ?
    WHERE id = ?
  `;
  const args = [
    data.title,
    data.appeal_point,
    data.content_markdown,
    data.max_reports,
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
