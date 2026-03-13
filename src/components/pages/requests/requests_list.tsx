"use client";

import Link from "next/link";
import { useState } from "react";

interface RequestItem {
  id: string;
  user_id: string;
  title: string;
  appeal_point: string;
  is_active: boolean;
  is_public: boolean;
  author_name?: string;
  created_at: string;
}

interface RequestsListProps {
  requests: RequestItem[];
  hasSession: boolean;
  userId?: string;
}

export default function RequestsList({
  requests,
  hasSession,
  userId,
}: RequestsListProps) {
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  const displayRequests =
    activeTab === "all"
      ? requests
      : requests.filter((req) => req.user_id === userId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">検証依頼一覧</h1>
        {hasSession && (
          <Link
            href="/requests/new"
            className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
          >
            依頼を作成
          </Link>
        )}
      </div>

      {hasSession && (
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("all")}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "all"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              すべての依頼
            </button>
            <button
              onClick={() => setActiveTab("mine")}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "mine"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              作成した依頼
            </button>
          </nav>
        </div>
      )}

      <div className="grid gap-4">
        {displayRequests.length === 0 ? (
          <p className="text-slate-500 text-center py-10">
            {activeTab === "mine"
              ? "作成した依頼はありません。"
              : "表示できる依頼はありません。"}
          </p>
        ) : (
          displayRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
            >
              <div className="flex flex-wrap justify-between items-start mb-2 gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/requests/${req.id}`}
                    className="text-lg font-bold text-slate-800 hover:text-orange-600"
                  >
                    {req.title}
                  </Link>
                  <div className="flex gap-1">
                    <Link
                      href={`/requests/${req.id}`}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-medium rounded text-slate-600 transition-colors"
                    >
                      詳細
                    </Link>
                    <Link
                      href={`/requests/${req.id}#reports`}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-medium rounded text-slate-600 transition-colors"
                    >
                      報告一覧
                    </Link>
                    <Link
                      href={`/requests/${req.id}#comments`}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-medium rounded text-slate-600 transition-colors"
                    >
                      コメント一覧
                    </Link>
                  </div>
                </div>
                <div className="flex gap-2">
                  {req.is_active ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      有効
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      下書き
                    </span>
                  )}
                  {req.is_public && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      公開
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {req.appeal_point}
              </p>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>作成者: {req.author_name || "不明"}</span>
                <span>
                  作成日: {new Date(req.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
