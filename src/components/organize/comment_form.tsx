"use client";

import { useRef, useTransition } from "react";
import { submitCommentAction } from "@/app/comments/actions";
import { usePathname } from "next/navigation";

interface CommentFormProps {
  targetType: "request" | "report";
  targetId: string;
}

export default function CommentForm({
  targetType,
  targetId,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await submitCommentAction(formData);
        formRef.current?.reset();
      } catch (error) {
        console.error("Failed to submit comment:", error);
        alert("コメントの投稿に失敗しました。");
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
    >
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <input type="hidden" name="redirectPath" value={pathname} />

      <div>
        <label
          htmlFor="guestName"
          className="block text-xs font-medium text-slate-700 mb-1"
        >
          お名前（任意）
        </label>
        <input
          type="text"
          id="guestName"
          name="guestName"
          placeholder="名無しさん"
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-xs font-medium text-slate-700 mb-1"
        >
          コメント内容
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={3}
          placeholder="コメントを入力してください..."
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "送信中..." : "コメントを投稿する"}
        </button>
      </div>
    </form>
  );
}
