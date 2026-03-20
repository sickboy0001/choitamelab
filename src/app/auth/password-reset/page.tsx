"use client";

import { useState } from "react";
import Link from "next/link";

export default function PasswordResetRequestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "エラーが発生しました。");
      }

      setMessage({
        type: "success",
        text: "リセットリンクを送信しました。メールボックスを確認してください。",
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
          パスワード再設定
        </h1>
        <p className="text-gray-600 text-center mb-6">
          ご登録のメールアドレスを入力してください
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
              メールアドレス
            </label>
            <input
              type="email"
              required
              placeholder="m@example.com"
              className="mt-1 block w-full border border-gray-200 rounded-lg bg-gray-50 p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "送信中..." : "再設定メールを送信"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/auth/signin"
            className="text-indigo-600 font-medium hover:underline"
          >
            ログイン画面に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
