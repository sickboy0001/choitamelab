"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = (await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })) as any;

      if (result?.error) {
        if (result.error === "Email not verified") {
          setError(
            "メールアドレスが承認されていません。承認メールを確認してください。",
          );
        } else {
          setError(
            "ログインに失敗しました。メールアドレスまたはパスワードを確認してください。",
          );
        }
      } else {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError("エラーが発生しました。");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="p-8 bg-white shadow-lg border border-indigo-900 rounded-xl w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-indigo-700 text-center">
          ログイン
        </h1>
        <p className="text-gray-600 text-center mb-6">ChoitameLabへようこそ</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-gray-700">
                パスワード
              </label>
              <Link
                href="/auth/password-reset"
                className="text-xs text-indigo-600 hover:underline"
              >
                パスワードを忘れた場合
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-200 rounded-lg bg-gray-50 p-3"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            ログイン
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative px-4 bg-white text-xs text-gray-400">
            または
          </span>
        </div>

        <div>
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google でログイン
          </button>
        </div>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-gray-600 font-medium">
            アカウントをお持ちではありませんか？{" "}
            <Link
              href="/auth/signup"
              className="text-indigo-600 hover:underline"
            >
              サインアップ
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
