"use client";

import { HelpCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { markdownHelpContent } from "@/contents/markdownHelp";

export function MarkdownHelpSheet() {
  return (
    <Sheet>
      <SheetTrigger
        type="button"
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <HelpCircle size={18} />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Markdown ライティングガイド</SheetTitle>
          <SheetDescription>
            利用可能な記法とヒントを紹介します。
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <div className="prose prose-slate prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownHelpContent}
            </ReactMarkdown>
          </div>
        </div>
        <SheetFooter className="mt-6 border-t pt-4">
          <SheetClose render={<Button variant="outline" className="w-full" />}>
            閉じる
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
