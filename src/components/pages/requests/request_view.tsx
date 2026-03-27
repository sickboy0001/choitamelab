"use client";

import Link from "next/link";
import { RequestSummary } from "@/components/organize/request_summary";
import CommentList from "@/components/organize/comment_list";
import ReportItem from "@/components/organize/report_item";
import { UserTooltip } from "@/components/organize/user_tooltip";

interface RequestViewProps {
  id: string;
  request: any;
  reports: any[];
  requestComments: any[];
  isAuthor: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  userId?: string;
}

export default function RequestView({
  id,
  request,
  reports,
  requestComments,
  isAuthor,
  isAdmin,
  isLoggedIn,
  userId,
}: RequestViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">{request.title}</h1>
          <div className="text-sm text-slate-500">
            作成者:{" "}
            <UserTooltip userId={request.user_id} name={request.author_name} />{" "}
            | 作成日: {new Date(request.created_at).toLocaleDateString()}
          </div>
          <div className="flex gap-2 mt-2">
            {request.is_active ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                有効
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                下書き
              </span>
            )}
            {request.is_public ? (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                公開
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                非公開
              </span>
            )}
          </div>
        </div>
        {(isAuthor || isAdmin) && (
          <div className="flex items-center gap-2">
            <Link
              href={`/requests/${id}/edit`}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              編集する
            </Link>
            {isAdmin && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200">
                Admin
              </span>
            )}
          </div>
        )}
      </div>

      <RequestSummary
        appealPoint={request.appeal_point}
        contentMarkdown={request.content_markdown}
      />

      <hr className="border-gray-200" />

      <div className="space-y-4" id="reports">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            報告一覧 ({reports.length} / {request.max_reports})
          </h2>
          {isLoggedIn && (
            <Link
              href={`/requests/${id}/report`}
              className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700"
            >
              報告を投稿する
            </Link>
          )}
        </div>

        <div className="space-y-6">
          {reports.length === 0 ? (
            <p className="text-slate-500 text-center py-6 border border-dashed border-gray-200 rounded-lg">
              まだ報告はありません。
            </p>
          ) : (
            reports.map((report: any) => (
              <ReportItem
                key={report.id}
                report={report}
                currentUserId={userId}
                isAdmin={isAdmin}
              />
            ))
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="space-y-4" id="comments">
        <h2 className="text-xl font-bold text-slate-800">コメント</h2>
        <CommentList
          comments={requestComments}
          targetType="request"
          targetId={id}
          currentUserId={userId}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
