"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseMarkdownSections } from "@/lib/markdown";

interface RequestSummaryProps {
  appealPoint: string;
  contentMarkdown: string;
}

export function RequestSummary({
  appealPoint,
  contentMarkdown,
}: RequestSummaryProps) {
  const sections = parseMarkdownSections(contentMarkdown);

  return (
    <div className="space-y-8">
      <div className="p-6 bg-orange-50 border border-orange-100 rounded-lg">
        <h2 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-2">
          アピールポイント
        </h2>
        <p className="text-slate-800">{appealPoint}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
          >
            {section.title && (
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">
                {section.title}
              </h3>
            )}
            <div className="prose prose-slate prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
