"use client";

import Link from "next/link";
import { MessageSquare, User } from "lucide-react";
import { formatDateToJst } from "@/lib/date";

interface CommentSummaryItem {
  id: string;
  target_type: "request" | "report";
  target_id: string;
  user_id: string | null;
  guest_name: string | null;
  content: string;
  updated_at: string;
  author_name: string | null;
  display_request_title: string;
  display_request_id: string;
  report_id: string | null;
}

interface CommentsListProps {
  comments: CommentSummaryItem[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">最新コメント一覧</h1>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-lg">
            <p className="text-slate-500">まだコメントはありません。</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 hover:border-orange-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-100 rounded-full text-slate-400">
                  <MessageSquare size={18} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        {comment.author_name || comment.guest_name || "ゲスト"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDateToJst(comment.updated_at, "MM-dd HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {comment.target_type === "request"
                        ? "依頼へのコメント"
                        : "報告へのコメント"}
                    </div>
                  </div>

                  <p className="text-slate-700 whitespace-pre-wrap text-sm">
                    {comment.content}
                  </p>

                  <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                    <Link
                      href={`/requests/${comment.display_request_id}`}
                      className="text-xs text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-1"
                    >
                      <span className="font-medium">対象依頼:</span>
                      <span className="underline decoration-slate-300 underline-offset-2">
                        {comment.display_request_title}
                      </span>
                    </Link>

                    <Link
                      href={
                        comment.target_type === "request"
                          ? `/requests/${comment.display_request_id}#comments`
                          : `/requests/${comment.display_request_id}#reports`
                      }
                      className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      詳細を見る
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
