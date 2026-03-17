import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const res = await query(
    "SELECT id, email, display_name, self_intro_markdown, is_admin, updated_at FROM users WHERE id = ?",
    [session.user.id],
  );

  return res.rows[0] || null;
}

export async function updateUserProfile(data: {
  display_name: string;
  self_intro_markdown?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await query(
    "UPDATE users SET display_name = ?, self_intro_markdown = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [data.display_name, data.self_intro_markdown || null, session.user.id],
  );
}
