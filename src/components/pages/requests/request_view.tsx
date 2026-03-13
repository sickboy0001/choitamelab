"use client";

import Link from "next/link";
import { parseMarkdownSections } from "@/lib/markdown";

interface RequestViewProps {
  id: string;
  request: any;
  reports: any[];
  isAuthor: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export default function RequestView({
  id,
  request,
  reports,
  isAuthor,
  isAdmin,
  isLoggedIn,
}: RequestViewProps) {
  const sections = parseMarkdownSections(request.content_markdown);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">{request.title}</h1>
          <p className="text-sm text-slate-500">
            作成者: {request.author_name} | 作成日:{" "}
            {new Date(request.created_at).toLocaleDateString()}
          </p>
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

      <div className="p-6 bg-orange-50 border border-orange-100 rounded-lg">
        <h2 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-2">
          アピールポイント
        </h2>
        <p className="text-slate-800">{request.appeal_point}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section, index) => (
          <div
            key={index}
            className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm"
          >
            {section.title && (
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {section.title}
              </h2>
            )}
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-800">
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

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
            reports.map((report: any) => {
              const reportSections = parseMarkdownSections(
                report.content_markdown,
              );
              return (
                <div
                  key={report.id}
                  className="p-6 border border-gray-200 rounded-xl flex flex-col space-y-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-sm font-bold text-slate-700">
                      {report.author_name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
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
                        <div className="text-sm text-slate-600 whitespace-pre-wrap">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="space-y-4" id="comments">
        <h2 className="text-xl font-bold text-slate-800">コメント</h2>
        <p className="text-sm text-slate-500">コメント機能は現在準備中です。</p>
      </div>
    </div>
  );
}
