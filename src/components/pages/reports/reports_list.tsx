"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDateToJst } from "@/lib/date";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReportSummaryItem {
  request_id: string;
  request_title: string;
  request_appeal_point: string;
  request_updated_at: string;
  request_author_name: string;
  report_id: string;
  report_content: string;
  report_updated_at: string;
  report_author_name: string;
  report_author_id: string;
}

interface ReportsListProps {
  reports: ReportSummaryItem[];
  myReports: ReportSummaryItem[];
  isLoggedIn: boolean;
}

export default function ReportsList({
  reports,
  myReports,
  isLoggedIn,
}: ReportsListProps) {
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  const displayReports = activeTab === "all" ? reports : myReports;

  // Markdownの記法を除去してプレーンテキストにする簡易関数
  const stripMarkdown = (text: string) => {
    return text
      .replace(/[#*`_~]/g, "") // 基本的な記号を削除
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // リンクをテキストのみに
      .replace(/\n+/g, " ") // 改行をスペースに
      .trim();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">検証報告一覧</h1>

        {isLoggedIn && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-6 py-2 text-sm font-medium transition-colors relative",
                activeTab === "all"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              最新の報告一覧
            </button>
            <button
              onClick={() => setActiveTab("mine")}
              className={cn(
                "px-6 py-2 text-sm font-medium transition-colors relative",
                activeTab === "mine"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              投稿した報告の一覧
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {displayReports.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-lg">
            <p className="text-slate-500">
              {activeTab === "mine"
                ? "まだ投稿した報告はありません。"
                : "まだ報告はありません。"}
            </p>
          </div>
        ) : (
          displayReports.map((report) => (
            <div
              key={report.report_id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-orange-200 transition-colors"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start gap-4">
                  <Link
                    href={`/requests/${report.request_id}`}
                    className="group"
                  >
                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                      {report.request_title}
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-1 mt-1">
                      {report.request_appeal_point}
                    </p>
                  </Link>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-xs text-slate-500">
                      依頼更新日:{" "}
                      {formatDateToJst(report.request_updated_at, "yyyy-MM-dd")}
                    </span>
                    <span className="text-xs font-medium text-slate-600">
                      作成者: {report.request_author_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-700 truncate">
                  {stripMarkdown(report.report_content)}
                </p>
                <div className="mt-4 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      最新の報告
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{report.report_author_name}</span>
                      <span>•</span>
                      <span>
                        {formatDateToJst(
                          report.report_updated_at,
                          "MM-dd HH:mm",
                        )}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/requests/${report.request_id}#reports`}
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    詳細を見る
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
          ))
        )}
      </div>
    </div>
  );
}
