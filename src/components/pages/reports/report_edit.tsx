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

interface ReportEditProps {
  reportId: string;
  requestId: string;
  requestTitle: string;
  requestAppealPoint: string;
  requestContentMarkdown: string;
  isRequestActive: boolean;
  isRequestPublic: boolean;
  initialContentMarkdown: string;
  initialIsActive: boolean;
  initialIsPublic: boolean;
  updateAction: (formData: FormData) => Promise<void>;
}

export default function ReportEdit({
  requestId,
  requestTitle,
  requestAppealPoint,
  requestContentMarkdown,
  isRequestActive,
  isRequestPublic,
  initialContentMarkdown,
  initialIsActive,
  initialIsPublic,
  updateAction,
}: ReportEditProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMarkdown, setPreviewMarkdown] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handlePreview = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      setPreviewMarkdown((formData.get("content_markdown") as string) || "");
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-800">
          報告を編集する: {requestTitle}
        </h1>
      </div>

      <RequestSummary
        appealPoint={requestAppealPoint}
        contentMarkdown={requestContentMarkdown}
      />

      <form ref={formRef} action={updateAction} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">
              報告内容 (Markdown)
            </label>
            <MarkdownHelpSheet />
          </div>
          <textarea
            name="content_markdown"
            required
            defaultValue={initialContentMarkdown}
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
                defaultChecked={initialIsActive}
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
                defaultChecked={initialIsPublic}
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
            type="button"
            onClick={handlePreview}
            className="px-4 py-2 border border-orange-200 bg-orange-50 text-orange-700 rounded-md text-sm font-medium hover:bg-orange-100 transition-colors"
          >
            プレビュー
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700"
          >
            変更を保存
          </button>
        </div>
      </form>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>報告内容のプレビュー</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RequestSummary
              appealPoint={requestAppealPoint}
              contentMarkdown={previewMarkdown}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
