export interface MarkdownSection {
  title: string;
  content: string;
}

export function parseMarkdownSections(markdown: string): MarkdownSection[] {
  if (!markdown) return [];

  // ## で分割。最初の ## の前にあるテキストも考慮する。
  // 各セクションは ## から始まるように調整
  const parts = markdown.split(/(?=##\s+)/);

  return parts
    .map((part) => {
      const lines = part.trim().split("\n");
      if (lines[0].startsWith("##")) {
        const title = lines[0].replace(/^##\s+/, "").trim();
        const content = lines.slice(1).join("\n").trim();
        return { title, content };
      }
      return { title: "", content: part.trim() };
    })
    .filter((section) => section.title || section.content);
}
