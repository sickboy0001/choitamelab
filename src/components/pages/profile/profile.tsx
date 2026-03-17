"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Save, FileText } from "lucide-react";
import { MarkdownHelpSheet } from "@/components/organize/markdown_help_sheet";

interface ProfileProps {
  user: {
    id: string;
    email: string;
    display_name: string;
    self_intro_markdown?: string;
    is_admin: boolean;
  };
  updateAction: (data: {
    display_name: string;
    self_intro_markdown?: string;
  }) => Promise<void>;
}

export default function Profile({ user, updateAction }: ProfileProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.display_name || "");
  const [selfIntroMarkdown, setSelfIntroMarkdown] = useState(
    user.self_intro_markdown || "",
  );
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    try {
      await updateAction({
        display_name: displayName,
        self_intro_markdown: selfIntroMarkdown,
      });
      setMessage({ type: "success", text: "プロファイルを更新しました" });
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "更新に失敗しました" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-orange-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <User size={28} />
            個人設定
          </h1>
          <p className="text-orange-100 mt-1">
            あなたのアカウント情報を管理します
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {message && (
            <div
              className={cn(
                "p-4 rounded-lg text-sm font-medium",
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700",
              )}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            {/* Email (Read Only) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                メールアドレス
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400">
                メールアドレスは変更できません
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <label
                htmlFor="display_name"
                className="text-sm font-bold text-slate-700 flex items-center gap-2"
              >
                <User size={16} className="text-slate-400" />
                表示名
              </label>
              <input
                id="display_name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                placeholder="ユーザー名を入力"
              />
            </div>

            {/* Self Intro Markdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="self_intro_markdown"
                  className="text-sm font-bold text-slate-700 flex items-center gap-2"
                >
                  <FileText size={16} className="text-slate-400" />
                  自己紹介詳細 (Markdown)
                </label>
                <MarkdownHelpSheet />
              </div>
              <textarea
                id="self_intro_markdown"
                value={selfIntroMarkdown}
                onChange={(e) => setSelfIntroMarkdown(e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none font-mono text-sm"
                placeholder="マークダウン形式で自己紹介を入力"
              />
            </div>

            {/* Admin Badge (View Only) */}
            {user.is_admin && (
              <div className="pt-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">
                  Admin 権限
                </span>
                <span className="text-xs text-slate-400">
                  あなたはこのシステムの管理者です
                </span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                "更新中..."
              ) : (
                <>
                  <Save size={20} />
                  設定を保存する
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Utility function for classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
