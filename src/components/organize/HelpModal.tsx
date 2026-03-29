"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 表示名とファイル名のマッピング
const HELP_FILES = [
  { slug: "00_index", label: "トップ" },
  { slug: "01_quickstart", label: "クイックスタート" },
  { slug: "05_markdown", label: "Markdown" },
  { slug: "90_terms", label: "利用規約" },
];

export function HelpModal({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string>("00_index");
  const [cache, setCache] = useState<Record<string, string>>({});
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadAllContent = useCallback(async () => {
    if (Object.keys(cache).length === HELP_FILES.length) return;

    setIsPreloading(true);
    try {
      const results = await Promise.all(
        HELP_FILES.map(async (file) => {
          const res = await fetch(`/api/help/${encodeURIComponent(file.slug)}`);
          if (res.ok) {
            const data = await res.json();
            return { slug: file.slug, content: data.content };
          }
          return null;
        }),
      );

      const newCache: Record<string, string> = {};
      results.forEach((item) => {
        if (item) newCache[item.slug] = item.content;
      });

      setCache(newCache);
    } catch (error) {
      console.error("Failed to preload help content", error);
    } finally {
      setIsPreloading(false);
    }
  }, [cache]);

  useEffect(() => {
    if (isOpen) {
      preloadAllContent();
    }
  }, [isOpen, preloadAllContent]);

  const currentContent = cache[currentSlug] || "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          (children as React.ReactElement) || (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-slate-400 hover:text-orange-600 font-bold"
            >
              <HelpCircle size={16} />
              ヘルプ
            </Button>
          )
        }
      />

      <DialogContent className="sm:!max-w-[2200px] w-[98vw] max-h-[95vh] h-full flex flex-col p-0 overflow-hidden sm:!rounded-none border-none shadow-2xl bg-white fixed">
        {/* Top Accent Line (LP style) */}
        <div className="h-2 w-full bg-orange-600 shrink-0" />

        <DialogHeader className="px-8 py-8 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl md:text-4xl font-black text-orange-600 uppercase flex items-center gap-4 tracking-tighter">
              <BookOpen size={40} strokeWidth={3} className="text-orange-600" />
              Help & Docs
            </DialogTitle>
          </div>
          <nav className="flex gap-2 overflow-x-auto mt-8 pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {HELP_FILES.map((file) => (
              <button
                key={file.slug}
                onClick={() => setCurrentSlug(file.slug)}
                className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                  file.slug === currentSlug
                    ? "bg-orange-600 border-orange-600 text-white shadow-xl translate-y-[-2px]"
                    : "bg-transparent border-slate-200 text-slate-400 hover:border-orange-600/30 hover:text-orange-600 hover:bg-orange-600/5"
                }`}
              >
                {file.label}
              </button>
            ))}
          </nav>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 min-h-0">
          <div className="py-12 px-4 md:px-12">
            <div className="bg-white mx-auto max-w-[1800px] min-h-[60vh] rounded-[2rem] border-2 border-orange-600/5 shadow-2xl overflow-hidden relative">
              {/* Decorative circle like LP */}
              <div className="absolute top-[-5%] right-[-5%] w-32 h-32 border-[10px] border-orange-600/5 rounded-full pointer-events-none" />

              <div className="p-8 md:p-16 relative z-10">
                {!currentContent && isPreloading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                  </div>
                ) : (
                  <article
                    className="prose prose-slate prose-orange max-w-none 
                    prose-headings:text-orange-600 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                    prose-p:text-slate-600 prose-p:font-bold prose-p:leading-relaxed
                    prose-th:bg-orange-600 prose-th:text-white prose-th:px-6 prose-th:py-4 prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:text-xs prose-th:border-none
                    prose-td:px-6 prose-td:py-5 prose-td:font-bold prose-td:border-b prose-td:border-slate-100
                    prose-table:border-none prose-table:shadow-xl prose-table:rounded-xl prose-table:overflow-hidden
                    prose-img:rounded-3xl prose-img:shadow-2xl
                    prose-code:bg-slate-100 prose-code:text-orange-600 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-bold"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentContent}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer style matching LP theme */}
        <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
          <div className="text-[10px] font-black text-orange-600/30 uppercase tracking-[0.3em]">
            &copy; 2026 ChoitameLab / Documentation
          </div>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-600/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-600/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-600/40" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
