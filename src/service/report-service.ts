import { query } from "@/lib/db";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

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

  const result = await query(sql + " ORDER BY r.updated_at DESC", args);
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

  const id = nanoid(8);
  const sql = `
    INSERT INTO cit_reports (id, request_id, user_id, content_markdown, is_active, is_public, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;
  // console.log("sql:", sql);
  // console.log("Creating report with args:", {
  //   id,
  //   requestId: data.requestId,
  //   userId: session.user.id,
  //   content_markdown: data.content_markdown,
  //   is_active: final_is_active,
  //   is_public: final_is_public,
  // });
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

export async function getReportDetail(id: string) {
  const sql = `
    SELECT r.*, u.display_name as author_name 
    FROM cit_reports r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `;
  const result = await query(sql, [id]);
  return (result.rows[0] as any) || null;
}

export async function updateReport(
  id: string,
  data: {
    content_markdown: string;
    is_active: boolean;
    is_public: boolean;
  },
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 親依頼の設定を取得してバリデーション
  const reportResult = await query(
    "SELECT request_id FROM cit_reports WHERE id = ?",
    [id],
  );
  const report = reportResult.rows[0] as any;
  if (!report) throw new Error("Report not found");

  const requestResult = await query(
    "SELECT is_active, is_public FROM cit_requests WHERE id = ?",
    [report.request_id],
  );
  const request = requestResult.rows[0] as any;
  if (!request) throw new Error("Parent request not found");

  const final_is_active = request.is_active ? (data.is_active ? 1 : 0) : 0;
  const final_is_public = request.is_public ? (data.is_public ? 1 : 0) : 0;

  const sql = `
    UPDATE cit_reports 
    SET content_markdown = ?, is_active = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const args = [data.content_markdown, final_is_active, final_is_public, id];

  await query(sql, args);
}

export async function getLatestReportsPerRequest() {
  const session = await auth();
  const userId = session?.user?.id;

  // 1. 各依頼に対して、最新の有効な報告のIDを取得するサブクエリ
  // 2. その報告詳細と依頼詳細を結合
  // 3. 権限チェック（依頼が見れるかどうか、報告が見れるかどうか）

  let sql = `
    WITH latest_reports AS (
      SELECT 
        r.request_id,
        r.id as report_id,
        ROW_NUMBER() OVER(PARTITION BY r.request_id ORDER BY r.updated_at DESC) as rn
      FROM cit_reports r
      WHERE 
  `;

  const reportConditions = [];
  const reportArgs: any[] = [];

  if (userId) {
    reportConditions.push(`(r.user_id = ? OR r.is_active = 1)`);
    reportArgs.push(userId);
  } else {
    reportConditions.push(`(r.is_active = 1 AND r.is_public = 1)`);
  }

  sql += reportConditions.join(" AND ");
  sql += `
    )
    SELECT 
      req.id as request_id,
      req.title as request_title,
      req.appeal_point as request_appeal_point,
      req.updated_at as request_updated_at,
      req_u.display_name as request_author_name,
      req.user_id as request_user_id,
      rep.id as report_id,
      rep.content_markdown as report_content,
      rep.updated_at as report_updated_at,
      u.display_name as report_author_name,
      rep.user_id as report_author_id
    FROM cit_requests req
    INNER JOIN latest_reports lr ON req.id = lr.request_id AND lr.rn = 1
    INNER JOIN cit_reports rep ON lr.report_id = rep.id
    LEFT JOIN users u ON rep.user_id = u.id
    LEFT JOIN users req_u ON req.user_id = req_u.id
    WHERE 
  `;

  const requestConditions = [];
  const requestArgs: any[] = [];

  if (userId) {
    requestConditions.push(`(req.user_id = ? OR req.is_active = 1)`);
    requestArgs.push(userId);
  } else {
    requestConditions.push(`(req.is_active = 1 AND req.is_public = 1)`);
  }

  sql += requestConditions.join(" AND ");
  sql += " ORDER BY rep.updated_at DESC";

  const result = await query(sql, [...reportArgs, ...requestArgs]);
  return result.rows;
}

export async function getMyReports() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const sql = `
    SELECT 
      req.id as request_id,
      req.title as request_title,
      req.appeal_point as request_appeal_point,
      req.updated_at as request_updated_at,
      req_u.display_name as request_author_name,
      req.user_id as request_user_id,
      rep.id as report_id,
      rep.content_markdown as report_content,
      rep.updated_at as report_updated_at,
      u.display_name as report_author_name,
      rep.user_id as report_author_id
    FROM cit_reports rep
    INNER JOIN cit_requests req ON rep.request_id = req.id
    LEFT JOIN users u ON rep.user_id = u.id
    LEFT JOIN users req_u ON req.user_id = req_u.id
    WHERE rep.user_id = ?
    ORDER BY rep.updated_at DESC
  `;

  const result = await query(sql, [userId]);
  return result.rows;
}
