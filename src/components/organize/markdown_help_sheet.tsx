"use client";

import { HelpCircle } from "lucide-react";
import { Markdown } from "@/components/ui/markdown";
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
      <SheetContent
        side="right"
        className="data-[side=right]:w-full data-[side=right]:sm:max-w-4xl overflow-y-auto"
      >
        <SheetHeader className="px-6">
          <SheetTitle>Markdown ライティングガイド</SheetTitle>
          <SheetDescription>
            利用可能な記法とヒントを紹介します。
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 px-6">
          <Markdown content={markdownHelpContent} />
        </div>
        <SheetFooter className="mt-6 border-t pt-4 px-6 pb-6">
          <SheetClose render={<Button variant="outline" className="w-full" />}>
            閉じる
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
