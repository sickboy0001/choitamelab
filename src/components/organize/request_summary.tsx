"use client";

import { Markdown } from "@/components/ui/markdown";
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
  console.log("appealPoint:", appealPoint);

  return (
    <div className="space-y-8">
      <div className="p-6 bg-orange-50 border border-orange-100 rounded-lg">
        <h2 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-2">
          アピールポイント
        </h2>
        <p style={{ whiteSpace: "pre-line" }} className="text-slate-800">
          {appealPoint}
        </p>
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
            <Markdown content={section.content} />
          </div>
        ))}
      </div>
    </div>
  );
}
