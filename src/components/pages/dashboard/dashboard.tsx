"use client";

import Link from "next/link";
import { menuDashboard } from "@/contents/menu";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  userName: string | null | undefined;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export default function Dashboard({
  userName,
  isAdmin,
  isLoggedIn,
}: DashboardProps) {
  // メニューのフィルタリング
  const filteredMenu = menuDashboard.filter((item) => {
    // 管理者限定項目のチェック
    if (item.isAdminOnly && !isAdmin) return false;
    // ログインユーザー限定項目のチェック
    if (item.isLoginOnly && !isLoggedIn) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        {!isLoggedIn && (
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
          >
            ログインして全ての機能を利用する
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isSpecial = item.href === "/requests/new";

          return (
            <div
              key={item.href}
              className={cn(
                "p-6 rounded-xl border shadow-sm",
                isSpecial
                  ? "bg-orange-50 border-orange-100"
                  : "bg-white border-gray-200",
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    item.bgColorClass,
                    item.colorClass,
                  )}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {item.title}
                  </p>
                  <h3 className="text-2xl font-bold">{item.label}</h3>
                </div>
              </div>
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium hover:underline",
                  item.colorClass,
                )}
              >
                {isSpecial ? "作成する →" : "一覧を見る →"}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">
          {isLoggedIn ? `ようこそ、${userName}さん` : "Choitameへようこそ！"}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {isLoggedIn
            ? "ChoitameLab（ちょいためらぼ）へようこそ！ここではあなたの依頼や報告を管理できます。まずは新しい依頼を作成するか、既存の依頼を確認してみましょう。"
            : "ChoitameLabは、小さな依頼と報告を通じてコミュニティを活性化させるプラットフォームです。ログインすると、依頼の作成や報告の投稿、コメントなどの全ての機能を利用できるようになります。"}
        </p>
        {!isLoggedIn && (
          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="text-orange-600 font-bold hover:underline"
            >
              ログイン画面へ →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
