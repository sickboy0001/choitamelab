"use client";

import Link from "next/link";

interface RequestDetailProps {
  requestId: string;
  requestTitle: string;
  requestContentMarkdown: string;
  isRequestActive: boolean;
  isRequestPublic: boolean;
  action: (formData: FormData) => Promise<void>;
}

export default function RequestReportDetail({
  requestId,
  requestTitle,
  requestContentMarkdown,
  isRequestActive,
  isRequestPublic,
  action,
}: RequestDetailProps) {
  // Markdownを「##」で分割してカード化する
  const sections = requestContentMarkdown
    .split(/(?=^##\s+)/m)
    .filter((section) => section.trim() !== "");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-800">報告を投稿する</h1>
        <p className="text-sm text-slate-500">依頼: {requestTitle}</p>
      </div>

      {/* 依頼内容をカード形式で表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => {
          const lines = section.trim().split("\n");
          const title = lines[0].replace(/^##\s+/, "");
          const content = lines.slice(1).join("\n").trim();

          return (
            <div
              key={index}
              className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
            >
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">
                {title}
              </h3>
              <div className="text-sm text-slate-600 whitespace-pre-wrap">
                {content}
              </div>
            </div>
          );
        })}
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            報告内容 (Markdown)
          </label>
          <textarea
            name="content_markdown"
            required
            className="w-full p-2 border border-gray-300 rounded-md h-64 font-mono text-sm"
            placeholder="検証した結果を詳しく記入してください"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-6">
            <label
              className={`flex items-center gap-2 cursor-pointer ${!isRequestActive ? "opacity-50 grayscale" : ""}`}
            >
              <input
                type="checkbox"
                name="is_active"
                defaultChecked
                className="w-4 h-4 text-orange-600"
                disabled={!isRequestActive}
              />
              <span className="text-sm font-medium text-slate-700">
                有効にする {!isRequestActive && "(依頼が下書きのため固定)"}
              </span>
            </label>
            <label
              className={`flex items-center gap-2 cursor-pointer ${!isRequestPublic ? "opacity-50 grayscale" : ""}`}
            >
              <input
                type="checkbox"
                name="is_public"
                defaultChecked
                className="w-4 h-4 text-orange-600"
                disabled={!isRequestPublic}
              />
              <span className="text-sm font-medium text-slate-700">
                公開する {!isRequestPublic && "(依頼が非公開のため固定)"}
              </span>
            </label>
          </div>
          <p className="text-xs text-slate-500">
            ※依頼の状態（有効・公開）によって、報告の公開範囲が制限される場合があります。
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            href={`/requests/${requestId}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700"
          >
            報告を投稿
          </button>
        </div>
      </form>
    </div>
  );
}
