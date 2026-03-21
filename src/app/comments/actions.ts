"use server";

import { getAllRecentComments, createComment } from "@/service/comment-service";
import { revalidatePath } from "next/cache";

export async function getRecentCommentsAction() {
  return await getAllRecentComments();
}

export async function submitCommentAction(formData: FormData) {
  const targetType = formData.get("targetType") as "request" | "report";
  const targetId = formData.get("targetId") as string;
  const guestName = formData.get("guestName") as string;
  const content = formData.get("content") as string;
  const redirectPath = formData.get("redirectPath") as string;

  if (!targetType || !targetId || !content) {
    throw new Error("Missing required fields");
  }

  await createComment({
    target_type: targetType,
    target_id: targetId,
    guest_name: guestName || undefined,
    content: content,
  });

  if (redirectPath) {
    revalidatePath(redirectPath);
  }
}
