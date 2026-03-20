"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "エラーが発生しました。");
      }

      setMessage({
        type: "success",
        text: "アカウントを作成しました。承認メールを送信したので確認してください。",
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="p-8 bg-white shadow-lg border border-indigo-900 rounded-xl w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-indigo-700 text-center">
          新規登録
        </h1>
        <p className="text-gray-600 text-center mb-6">
          ChoitameLabへようこそ！アカウントを作成しましょう
        </p>

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
              表示名
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="ユーザー名"
              className="mt-1 block w-full border border-gray-200 rounded-lg bg-gray-50 p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              className="mt-1 block w-full border border-gray-200 rounded-lg bg-gray-50 p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full border border-gray-200 rounded-lg bg-gray-50 p-3"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "登録中..." : "登録する"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-gray-600 font-medium">
            すでにアカウントをお持ちですか？{" "}
            <Link
              href="/auth/signin"
              className="text-indigo-600 hover:underline"
            >
              ログイン
            </Link>
          </p>
          <Link
            href="/"
            className="block text-sm text-gray-400 hover:underline"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
