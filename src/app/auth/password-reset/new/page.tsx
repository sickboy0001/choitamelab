"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PasswordResetConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = use(searchParams);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-lg border border-red-500 rounded-xl w-full max-w-md text-center">
          <p className="text-red-600 font-bold">トークンが見つかりません。</p>
          <p className="text-gray-600 mt-2 text-sm">
            リンクを再送してください。
          </p>
          <div className="mt-6">
            <Link
              href="/auth/password-reset"
              className="text-indigo-600 hover:underline"
            >
              再設定リクエストに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "パスワードが一致しません。" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "エラーが発生しました。");
      }

      setMessage({
        type: "success",
        text: "パスワードを更新しました。5秒後にログイン画面へ遷移します。",
      });
      setTimeout(() => {
        router.push("/auth/signin");
      }, 5000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="p-8 bg-white shadow-lg border border-indigo-900 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          新しいパスワードの設定
        </h1>

        {message && (
          <div
            className={`p-4 rounded-lg mb-4 text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">
              新しいパスワード
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="mt-1 block w-full border border-gray-200 rounded-lg bg-gray-50 p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">
              パスワード（確認）
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="mt-1 block w-full border border-gray-200 rounded-lg bg-gray-50 p-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "更新中..." : "パスワードを更新する"}
          </button>
        </form>
      </div>
    </div>
  );
}
