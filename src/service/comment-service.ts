import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function createComment(data: {
  target_type: "request" | "report";
  target_id: string;
  guest_name?: string;
  content: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const id = crypto.randomUUID();
  const sql = `
    INSERT INTO cit_comments (id, target_type, target_id, user_id, guest_name, content)
    VALUES (?, ?, ?, ?, ?, ?)
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
