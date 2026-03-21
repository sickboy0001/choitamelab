"use server";

import { query } from "@/lib/db";
import { getRecentUpdatedUsers } from "./user-service";

export async function getPublicUserProfile(userId: string) {
  if (!userId) return null;

  try {
    const res = await query(
      "SELECT id, display_name, self_intro_markdown FROM users WHERE id = ?",
      [userId],
    );

    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return {
      id: row.id as string,
      display_name: row.display_name as string,
      self_intro_markdown: (row.self_intro_markdown as string) || null,
    };
  } catch (error) {
    console.error("Failed to fetch public user profile:", error);
    return null;
  }
}

export async function getRecentUpdatedUsersAction(limit: number = 3) {
  return await getRecentUpdatedUsers(limit);
}
