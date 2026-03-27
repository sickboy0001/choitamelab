"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Edit } from "lucide-react";
import Link from "next/link";
import { Markdown } from "@/components/ui/markdown";
import { parseMarkdownSections } from "@/lib/markdown";
import CommentList from "@/components/organize/comment_list";
import { formatDateToJst } from "@/lib/date";
import { UserTooltip } from "@/components/organize/user_tooltip";

interface ReportItemProps {
  report: any;
  currentUserId?: string;
  isAdmin?: boolean;
}

export default function ReportItem({
  report,
  currentUserId,
  isAdmin,
}: ReportItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reportSections = parseMarkdownSections(report.content_markdown);

  const canEdit =
    isAdmin || (currentUserId && currentUserId === report.user_id);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors text-left"
      >
        <span className="text-sm font-bold text-slate-700">
          <UserTooltip userId={report.user_id} name={report.author_name} /> (
          {formatDateToJst(report.created_at)})
        </span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 flex flex-col space-y-4 border-t border-gray-50 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {reportSections.map((section, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-lg border border-slate-100"
              >
                {section.title && (
                  <h3 className="text-sm font-bold text-slate-800 mb-2 pb-1 border-b border-slate-200">
                    {section.title}
                  </h3>
                )}
                <Markdown content={section.content} />
              </div>
            ))}
          </div>

          {/* 編集ボタン（権限がある場合） */}
          {canEdit && (
            <div className="flex justify-end pt-2">
              <Link
                href={`/reports/${report.id}/edit`}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1"
              >
                <Edit size={14} />
                編集する
              </Link>
            </div>
          )}

          {/* 報告に対するコメント */}
          <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tight">
              Comments
            </h4>
            <CommentList
              comments={report.comments || []}
              targetType="report"
              targetId={report.id}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      )}
    </div>
  );
}
