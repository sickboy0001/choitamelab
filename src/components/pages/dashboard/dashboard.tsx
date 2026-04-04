"use client";

import Link from "next/link";
import { getPublicUserProfile } from "@/service/user-actions";
import { useEffect, useState } from "react";
import DashboardMenu from "@/components/organize/dashboard_menu";
import RequestsList from "@/components/pages/requests/requests_list";
import ReportsList from "@/components/pages/reports/reports_list";
import CommentsList from "@/components/pages/comments/comments_list";
import UsersList from "@/components/organize/users_list";

interface DashboardProps {
  userId: string | null | undefined;
  userName: string | null | undefined;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export default function Dashboard({
  userId,
  userName,
  isAdmin,
  isLoggedIn,
}: DashboardProps) {
  const [displayName, setDisplayName] = useState<string | null>(
    userName || null,
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        const profile = await getPublicUserProfile(userId);
        if (profile?.display_name) {
          setDisplayName(profile.display_name);
        }
      }
    };
    fetchUserProfile();
  }, [userId]);

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold">ダッシュボード</h1>
        {!isLoggedIn && (
          <Link
            href="/auth/signin"
            className="px-3 py-1.5 bg-orange-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-orange-700"
          >
            ログイン
          </Link>
        )}
      </div>

      <DashboardMenu isAdmin={isAdmin} isLoggedIn={isLoggedIn} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-12">
        <div className="lg:col-span-2 space-y-4 sm:space-y-8">
          {/* ウェルカムセクション */}
          <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">
              {isLoggedIn
                ? `ようこそ、${displayName || "ゲスト"}さん`
                : "Choitameへようこそ！"}
            </h2>
            <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
              {isLoggedIn
                ? "ChoitameLab（ちょいためらぼ）へようこそ！ここではあなたの依頼や報告を管理できます。まずは新しい依頼を作成するか、既存の依頼を確認してみましょう。"
                : "ChoitameLabは、小さな依頼と報告を通じてコミュニティを活性化させるプラットフォームです。ログインすると、依頼の作成や報告の投稿、コメントなどの全ての機能を利用できるようになります。"}
            </p>
            {!isLoggedIn && (
              <div className="mt-4 sm:mt-6">
                <Link
                  href="/auth/signin"
                  className="text-orange-600 text-xs sm:text-base font-bold hover:underline"
                >
                  ログイン画面へ →
                </Link>
              </div>
            )}
          </div>

          {/* 最近の依頼セクション */}
          <section>
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold text-slate-800 px-1">
                最近の依頼
              </h2>
              <Link
                href="/requests"
                className="text-[10px] sm:text-sm text-orange-600 hover:underline font-medium"
              >
                すべて見る
              </Link>
            </div>
            <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <RequestsList
                hasSession={isLoggedIn}
                userId={userId || undefined}
                limit={3}
                hideTitle={true}
                onlyPublic={true}
              />
            </div>
          </section>

          {/* 最近の報告セクション */}
          <section>
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold text-slate-800 px-1">
                最近の報告
              </h2>
              <Link
                href="/reports"
                className="text-[10px] sm:text-sm text-orange-600 hover:underline font-medium"
              >
                すべて見る
              </Link>
            </div>
            <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <ReportsList
                isLoggedIn={isLoggedIn}
                limit={3}
                hideTitle={true}
                onlyPublic={true}
              />
            </div>
          </section>

          {/* 最近のコメントセクション */}
          <section>
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold text-slate-800 px-1">
                最近のコメント
              </h2>
              <Link
                href="/comments"
                className="text-[10px] sm:text-sm text-orange-600 hover:underline font-medium"
              >
                すべて見る
              </Link>
            </div>
            <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <CommentsList limit={3} hideTitle={true} onlyPublic={true} />
            </div>
          </section>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <section className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2 sm:mb-4 text-sm sm:text-lg">
              最近のユーザー
            </h3>
            <UsersList limit={3} />
          </section>

          <div className="bg-orange-600 p-4 sm:p-6 rounded-2xl text-white shadow-md">
            <h3 className="font-bold mb-1 sm:mb-2 text-xs sm:text-base">
              ChoitameLabのヒント
            </h3>
            <p className="text-[10px] sm:text-sm text-orange-50 leading-relaxed opacity-90">
              依頼を作成する際は、具体的な検証ポイントを記載すると、より質の高い報告が集まりやすくなります。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
