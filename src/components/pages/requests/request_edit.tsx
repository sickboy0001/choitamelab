"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { MarkdownHelpSheet } from "@/components/organize/markdown_help_sheet";
import { RequestSummary } from "@/components/organize/request_summary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequestEditProps {
  id: string;
  request: any;
  isAdmin: boolean;
  isAuthor: boolean;
  updateAction: (formData: FormData) => Promise<void>;
}

export default function RequestEdit({
  id,
  request,
  isAdmin,
  isAuthor,
  updateAction,
}: RequestEditProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    appeal_point: "",
    content_markdown: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handlePreview = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      setPreviewData({
        appeal_point: (formData.get("appeal_point") as string) || "",
        content_markdown: (formData.get("content_markdown") as string) || "",
      });
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-800">依頼の編集</h1>
        {isAdmin && !isAuthor && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200">
            Admin
          </span>
        )}
      </div>

      <form ref={formRef} action={updateAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            タイトル (タイトル＋アピールで100文字以内)
          </label>
          <input
            name="title"
            required
            defaultValue={request.title}
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
            defaultValue={request.appeal_point}
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
            defaultValue={request.content_markdown}
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
              defaultValue={request.max_reports}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={request.is_active === 1}
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
              defaultChecked={request.is_public === 1}
              className="w-4 h-4 text-orange-600"
            />
            <span className="text-sm font-medium text-slate-700">
              公開する (非ログイン者も見れる)
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            href={`/requests/${id}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            キャンセル
          </Link>
          <button
            type="button"
            onClick={handlePreview}
            className="px-4 py-2 border border-orange-200 bg-orange-50 text-orange-700 rounded-md text-sm font-medium hover:bg-orange-100 transition-colors"
          >
            プレビュー
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
          >
            更新する
          </button>
        </div>
      </form>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>プレビュー</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RequestSummary
              appealPoint={previewData.appeal_point}
              contentMarkdown={previewData.content_markdown}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
