import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function getRequestDetail(id: string) {
  const session = await auth();
  const userId = session?.user?.id;

  const sql = `
    SELECT r.*, u.display_name as author_name 
    FROM cit_requests r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `;
  const result = await query(sql, [id]);
  const request = result.rows[0] as any;

  if (!request) return null;

  // 権限チェック
  if (!request.is_active && request.user_id !== userId) {
    return null; // 非有効かつ本人でない
  }
  if (request.is_active && !request.is_public && !userId) {
    return null; // 有効だが非公開かつ未ログイン
  }

  return request;
}

export async function getReportsByRequestId(requestId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  // 依頼自体の公開・有効設定を考慮する必要がある
  const requestResult = await query(
    "SELECT is_active, is_public, user_id FROM cit_requests WHERE id = ?",
    [requestId],
  );
  const request = requestResult.rows[0] as any;
  if (!request) return [];

  let sql = `
    SELECT r.*, u.display_name as author_name 
    FROM cit_reports r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.request_id = ?
  `;
  const args: any[] = [requestId];

  // 依頼が非公開なら報告も非表示（作成者本人除く）
  if (request.user_id !== userId) {
    if (!request.is_active) return []; // 依頼が非有効なら報告も出さない

    if (!request.is_public) {
      if (!userId) return []; // 依頼が非公開かつ未ログインなら出さない
    }
  }

  // 報告自体のフィルタリング
  if (userId) {
    sql += ` AND (r.user_id = ? OR r.is_active = 1)`;
    args.push(userId);
  } else {
    sql += ` AND (r.is_active = 1 AND r.is_public = 1)`;
  }

  const result = await query(sql, args);
  return result.rows;
}

export async function createReport(data: {
  requestId: string;
  content_markdown: string;
  is_active: boolean;
  is_public: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 親依頼の公開・有効設定を取得
  const requestResult = await query(
    "SELECT is_active, is_public FROM cit_requests WHERE id = ?",
    [data.requestId],
  );
  const request = requestResult.rows[0] as any;
  if (!request) throw new Error("Request not found");

  // 仕様に基づき、親がFalseなら子も強制的にFalse
  const final_is_active = request.is_active ? (data.is_active ? 1 : 0) : 0;
  const final_is_public = request.is_public ? (data.is_public ? 1 : 0) : 0;

  // デバッグ用：存在確認
  const checkReq = await query("SELECT id FROM cit_requests WHERE id = ?", [
    data.requestId,
  ]);
  if (checkReq.rows.length === 0) {
    throw new Error(
      `Foreign Key Error: Request ID ${data.requestId} does not exist in cit_requests`,
    );
  }
  const checkUser = await query("SELECT id FROM users WHERE id = ?", [
    session.user.id,
  ]);
  if (checkUser.rows.length === 0) {
    throw new Error(
      `Foreign Key Error: User ID ${session.user.id} does not exist in users`,
    );
  }

  const id = crypto.randomUUID();
  const sql = `
    INSERT INTO cit_reports (id, request_id, user_id, content_markdown, is_active, is_public)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  console.log("sql:", sql);
  console.log("Creating report with args:", {
    id,
    requestId: data.requestId,
    userId: session.user.id,
    content_markdown: data.content_markdown,
    is_active: final_is_active,
    is_public: final_is_public,
  });
  const args = [
    id,
    data.requestId,
    session.user.id,
    data.content_markdown,
    final_is_active,
    final_is_public,
  ];

  await query(sql, args);
  return id;
}
