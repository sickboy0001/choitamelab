"use client";

import { useState } from "react";

export default function TwitterTestClient() {
  const [text, setText] = useState("これはテスト投稿です。 #Choitame");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/test/twitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setStatus(data);
    } catch (error: any) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Twitter 投稿テスト</h1>
      <p className="mb-4 text-sm text-gray-600">
        .env に設定された Twitter API キーを使用してテスト投稿を行います。
      </p>

      <div className="space-y-4">
        <textarea
          className="w-full p-2 border rounded-md"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handlePost}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 transition-colors"
        >
          {loading ? "送信中..." : "ツイートする"}
        </button>
      </div>

      {status && (
        <div className="mt-8 p-4 border rounded-md bg-gray-50 overflow-auto">
          <h2 className="font-bold mb-2 text-sm">結果:</h2>
          <div className={status.success ? "text-green-600" : "text-red-600"}>
            {status.success ? "✅ 投稿成功！" : "❌ 投稿失敗"}
          </div>
          <pre className="text-[10px] mt-2 bg-white p-2 border rounded">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
