import { query } from "@/lib/db";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

export async function createComment(data: {
  target_type: "request" | "report";
  target_id: string;
  guest_name?: string;
  content: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const id = nanoid(8);
  const sql = `
    INSERT INTO cit_comments (id, target_type, target_id, user_id, guest_name, content, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;
  const args = [
    id,
    data.target_type,
    data.target_id,
    userId || null,
    userId ? null : data.guest_name || "ゲスト",
    data.content,
  ];

  await query(sql, args);
  return id;
}

export async function getComments(
  targetType: "request" | "report",
  targetId: string,
) {
  const sql = `
    SELECT c.*, u.display_name as author_name
    FROM cit_comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.target_type = ? AND c.target_id = ?
    ORDER BY c.created_at ASC
  `;
  const result = await query(sql, [targetType, targetId]);
  return result.rows;
}

export async function getAllRecentComments() {
  const session = await auth();
  const userId = session?.user?.id;

  // 全てのコメントを取得し、関連する依頼や報告の情報を結合する
  // 権限チェックも行う（依頼が見れるかどうか）
  const loggedInSql = `
    SELECT
      c.*,
      u.display_name as author_name,
      req.id as request_id,
      req.title as request_title,
      rep.id as report_id,
      COALESCE(req.title, req_from_rep.title) as display_request_title,
      COALESCE(req.id, req_from_rep.id) as display_request_id,
      COALESCE(req.is_public, req_from_rep.is_public) as request_is_public,
      rep.is_public as report_is_public
    FROM cit_comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN cit_requests req ON c.target_type = 'request' AND c.target_id = req.id
    LEFT JOIN cit_reports rep ON c.target_type = 'report' AND c.target_id = rep.id
    LEFT JOIN cit_requests req_from_rep ON rep.request_id = req_from_rep.id
    WHERE
      (
        (c.target_type = 'request' AND (req.user_id = ? OR req.is_active = 1))
        OR
        (c.target_type = 'report' AND (req_from_rep.user_id = ? OR req_from_rep.is_active = 1))
      )
    ORDER BY c.updated_at DESC
  `;

  // 未ログイン時の条件
  const publicOnlySql = `
    SELECT
      c.*,
      u.display_name as author_name,
      req.id as request_id,
      req.title as request_title,
      rep.id as report_id,
      COALESCE(req.title, req_from_rep.title) as display_request_title,
      COALESCE(req.id, req_from_rep.id) as display_request_id,
      COALESCE(req.is_public, req_from_rep.is_public) as request_is_public,
      rep.is_public as report_is_public
    FROM cit_comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN cit_requests req ON c.target_type = 'request' AND c.target_id = req.id
    LEFT JOIN cit_reports rep ON c.target_type = 'report' AND c.target_id = rep.id
    LEFT JOIN cit_requests req_from_rep ON rep.request_id = req_from_rep.id
    WHERE
      (
        (c.target_type = 'request' AND req.is_active = 1 AND req.is_public = 1)
        OR
        (c.target_type = 'report' AND req_from_rep.is_active = 1 AND req_from_rep.is_public = 1)
      )
    ORDER BY c.updated_at DESC
  `;

  if (userId) {
    const result = await query(loggedInSql, [userId, userId]);
    return result.rows;
  } else {
    const result = await query(publicOnlySql, []);
    return result.rows;
  }
}

export async function deleteComment(
  commentId: string,
  userId: string | null,
  isAdmin: boolean,
) {
  // 権限チェック：投稿者自身、または管理者のみ削除可能
  const sql = `SELECT user_id FROM cit_comments WHERE id = ?`;
  const result = await query(sql, [commentId]);

  if (result.rows.length === 0) {
    throw new Error("コメントが見つかりません");
  }

  const comment = result.rows[0];

  if (!isAdmin && comment.user_id !== userId) {
    throw new Error("このコメントを削除する権限がありません");
  }

  const deleteSql = `DELETE FROM cit_comments WHERE id = ?`;
  await query(deleteSql, [commentId]);
}
