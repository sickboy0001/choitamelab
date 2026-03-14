import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createRequest } from "@/service/post-service";
import Link from "next/link";
import { MarkdownHelpSheet } from "@/components/organize/markdown_help_sheet";

export default async function NewRequestPage() {
  const session = await auth();
  if (!session) redirect("/");

  async function action(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const appeal_point = formData.get("appeal_point") as string;
    const content_markdown = formData.get("content_markdown") as string;
    const max_reports = parseInt(formData.get("max_reports") as string) || 0;
    const is_active = formData.get("is_active") === "on";
    const is_public = formData.get("is_public") === "on";

    // バリデーション
    if (title.length + appeal_point.length > 100) {
      throw new Error(
        "タイトルとアピールポイントの合計は100文字以内にする必要があります。",
      );
    }

    await createRequest({
      title,
      appeal_point,
      content_markdown,
      max_reports,
      is_active,
      is_public,
    });

    redirect("/requests");
  }

  const defaultMarkdown = `
# 前提
- 利用条件など

# 検証してほしい内容
- 1日10件ほどのメモをまとめる機能があるのでそれが妥当かどうかの確認

# 求めている報告内容
- 1週間ほどやってみての感想が欲しいです。

# その他情報
- 
`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">新規依頼作成</h1>

      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            タイトル (タイトル＋アピールで100文字以内)
          </label>
          <input
            name="title"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="依頼のタイトルを入力"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            アピールポイント (Twitter投稿用)
          </label>
          <textarea
            name="appeal_point"
            required
            className="w-full p-2 border border-gray-300 rounded-md h-20"
            placeholder="Twitterで表示されるアピール内容"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">
              検証内容 (Markdown)
            </label>
            <MarkdownHelpSheet />
          </div>
          <textarea
            name="content_markdown"
            required
            defaultValue={defaultMarkdown}
            className="w-full p-2 border border-gray-300 rounded-md h-64 font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              報告上限数
            </label>
            <input
              name="max_reports"
              type="number"
              defaultValue="10"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              className="w-4 h-4 text-orange-600"
            />
            <span className="text-sm font-medium text-slate-700">
              有効にする (作成者以外も見れる)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_public"
              className="w-4 h-4 text-orange-600"
            />
            <span className="text-sm font-medium text-slate-700">
              公開する (非ログイン者も見れる)
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/requests"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
          >
            作成する
          </button>
        </div>
      </form>
    </div>
  );
}
