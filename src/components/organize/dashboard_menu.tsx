"use client";

import Link from "next/link";
import { menuDashboard } from "@/contents/menu";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardMenuProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export default function DashboardMenu({
  isAdmin,
  isLoggedIn,
}: DashboardMenuProps) {
  // メニューのフィルタリング
  const filteredMenu = menuDashboard.filter((item) => {
    // 明示的に非表示に設定されている項目のチェック
    if (item.isVisible === false) return false;
    // 管理者限定項目のチェック
    if (item.isAdminOnly && !isAdmin) return false;
    // ログインユーザー限定項目のチェック
    if (item.isLoginOnly && !isLoggedIn) return false;
    return true;
  });

  return (
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
  );
}
