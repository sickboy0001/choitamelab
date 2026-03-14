"use client";

import CommentForm from "./comment_form";
import { formatDateToJst } from "@/lib/date";

interface Comment {
  id: string;
  author_name: string | null;
  guest_name: string | null;
  content: string;
  created_at: string;
}

interface CommentListProps {
  comments: Comment[];
  targetType: "request" | "report";
  targetId: string;
}

export default function CommentList({
  comments,
  targetType,
  targetId,
}: CommentListProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            まだコメントはありません。
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">
                    {comment.author_name || comment.guest_name || "ゲスト"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDateToJst(comment.created_at)}
                  </span>
                </div>
                <div className="text-sm text-slate-800 whitespace-pre-wrap">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-sm font-bold text-slate-700 mb-3">
          コメントを投稿する
        </h4>
        <CommentForm targetType={targetType} targetId={targetId} />
      </div>
    </div>
  );
}
