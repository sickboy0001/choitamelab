"use server";

import { createComment } from "@/service/comment-service";
import { revalidatePath } from "next/cache";

export async function submitCommentAction(formData: FormData) {
  const targetType = formData.get("targetType") as "request" | "report";
  const targetId = formData.get("targetId") as string;
  const guestName = formData.get("guestName") as string;
  const content = formData.get("content") as string;

  if (!targetType || !targetId || !content) {
    throw new Error("Missing required fields");
  }

  await createComment({
    target_type: targetType,
    target_id: targetId,
    guest_name: guestName,
    content: content,
  });

  // 再検証するパスを特定する必要がある。
  // request か report かによって異なるが、汎用的にルートを再検証するか、
  // 呼び出し元からパスを受け取るようにする。
  const redirectPath = formData.get("redirectPath") as string;
  if (redirectPath) {
    revalidatePath(redirectPath);
  }
}
