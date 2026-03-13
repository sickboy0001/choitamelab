import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const res = await query(
    "SELECT id, email, display_name, twitter_account, is_admin FROM users WHERE id = ?",
    [session.user.id],
  );

  return res.rows[0] || null;
}

export async function updateUserProfile(data: {
  display_name: string;
  twitter_account?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await query(
    "UPDATE users SET display_name = ?, twitter_account = ? WHERE id = ?",
    [data.display_name, data.twitter_account || null, session.user.id],
  );
}
