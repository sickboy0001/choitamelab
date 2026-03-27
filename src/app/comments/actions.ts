"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  deleteComment as deleteCommentService,
  getAllRecentComments,
  createComment as createCommentService,
} from "@/service/comment-service";

export async function deleteCommentAction(formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("未認証です");
  }

  const commentId = formData.get("comment_id") as string;
  const userId = session.user?.id || null;
  const isAdmin = !!session.user?.isAdmin;

  await deleteCommentService(commentId, userId, isAdmin);

  // 関連するパスを再検証
  revalidatePath("/comments");
  revalidatePath("/requests/[id]");
  revalidatePath("/reports/[id]");
}

export async function getRecentCommentsAction() {
  const comments = await getAllRecentComments();
  return comments;
}

export async function submitCommentAction(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id || null;

  const targetType = formData.get("targetType") as "request" | "report";
  const targetId = formData.get("targetId") as string;
  const content = formData.get("content") as string;
  const guestName = formData.get("guestName") as string;

  if (!targetType || !targetId || !content) {
    throw new Error("必要な情報が不足しています");
  }

  await createCommentService({
    target_type: targetType,
    target_id: targetId,
    guest_name: userId ? undefined : guestName || undefined,
    content,
  });

  // 関連するパスを再検証
  revalidatePath("/comments");
  revalidatePath(`/requests/${targetId}`);
  if (targetType === "report") {
    revalidatePath(`/reports/${targetId}`);
  }
}
