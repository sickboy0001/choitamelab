import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * ReactMarkdownをラップしたコンポーネント
 * リンクの場合は別タブで開くアイコンを表示します。
 */
export function Markdown({
  content,
  className = "prose prose-slate prose-sm max-w-none",
}: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => {
            // リンクがない場合は通常のaタグ
            if (!props.href) return <a {...props} />;

            return (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 hover:underline"
              >
                {props.children}
                <ExternalLink className="w-3.5 h-3.5 mb-0.5 inline-block" />
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
