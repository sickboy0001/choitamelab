"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPublicUserProfile } from "@/service/user-actions";
import {
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavigationProps {
  session: any;
  signOutAction: () => Promise<void>;
  signInAction: () => Promise<void>;
  children: React.ReactNode;
}

export default function Navigation({
  session,
  signOutAction,
  signInAction,
  children,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(
    session?.user?.name || null,
  );
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        const profile = await getPublicUserProfile(session.user.id);
        if (profile?.display_name) {
          setDisplayName(profile.display_name);
        }
      }
    };
    fetchUserProfile();
  }, [session?.user?.id]);

  const navItems = [
    { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { href: "/requests", label: "依頼", icon: ClipboardList },
    { href: "/reports", label: "報告", icon: FileText },
    { href: "/comments", label: "コメント", icon: MessageSquare },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const showSidebar = pathname !== "/";

  return (
    <>
      {/* Header - 固定 */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 fixed top-0 left-0 right-0 z-50">
        {showSidebar && (
          <button
            onClick={toggleMenu}
            className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-md md:hidden"
            aria-label="メニューを開く"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        <Link href="/" className="text-2xl font-bold text-orange-600">
          ChoitameLab
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.isAdmin && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">
                  ADMIN
                </span>
              )}
              <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
                {displayName || session.user?.email}
              </span>
              <div className="group relative">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="User"
                    className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
                    {(displayName || session.user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <div className="absolute right-0 top-full w-48 pt-2 hidden group-hover:block">
                  <div className="bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      <Settings size={16} className="mr-2" />
                      個人設定
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => signOutAction()}
                      className="flex w-full items-center text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      ログオフ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signInAction()}
              className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
            >
              ログイン
            </button>
          )}
        </div>
      </header>

      {/* Main Container - ヘッダー分の余白を追加 */}
      <div className="flex">
        {/* Sidebar Overlay (Mobile) */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden",
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
          onClick={closeMenu}
        />

        {/* Sidebar - スクロールに追従 */}
        {showSidebar && (
          <aside
            className={cn(
              "fixed top-16 inset-y-0 left-0 w-64 md:w-80 bg-gray-50 border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:top-0",
              isOpen ? "translate-x-0" : "-translate-x-full",
            )}
            style={{ paddingTop: "4rem" }}
          >
            <div className="px-4 space-y-1">
              <div className="md:hidden flex items-center justify-between mb-6">
                <span className="font-bold text-orange-600 text-xl">
                  ChoitameLab
                </span>
                <button
                  onClick={closeMenu}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                >
                  <X size={24} />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center px-4 py-2 md:py-3 text-sm md:text-xl font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "text-slate-700 hover:bg-gray-200 hover:text-slate-900",
                    )}
                  >
                    <Icon size={18} className="mr-3 md:w-7 md:h-7" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="md:hidden pt-4 border-t border-gray-200">
                {session ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-200 rounded-md"
                    >
                      <Settings size={18} className="mr-3" />
                      個人設定
                    </Link>
                    <button
                      onClick={() => signOutAction()}
                      className="flex w-full items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-200 rounded-md"
                    >
                      <LogOut size={18} className="mr-3" />
                      ログオフ
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signInAction()}
                    className="flex w-full items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-200 rounded-md"
                  >
                    ログイン
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main
          className={cn("flex-1 p-6 pt-16", !showSidebar && "p-4")}
          style={{ paddingTop: "4rem" }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
