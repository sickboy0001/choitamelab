"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, ArrowLeft } from "lucide-react";

interface HelpProps {
  currentSlug: string;
  files: string[];
  fileContent: string;
}

export default function Help({ currentSlug, files, fileContent }: HelpProps) {
  return (
    <div className="container py-8 px-4 max-w-5xl mx-auto space-y-10">
      {/* Quick Links Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#000080] font-black uppercase tracking-widest text-xs">
          <BookOpen size={16} />
          Help Topics
        </div>
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <Link key={file} href={`/help/${encodeURIComponent(file)}`}>
              <div
                className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all flex items-center gap-1 ${
                  file === currentSlug
                    ? "bg-[#000080] border-[#000080] text-white shadow-md"
                    : "bg-white border-slate-100 text-slate-500 hover:border-[#000080]/30 hover:text-[#000080]"
                }`}
              >
                {file}
                {file === currentSlug && <ChevronRight size={14} />}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <Card className="border-2 border-[#000080]/10 shadow-xl bg-white overflow-hidden rounded-2xl">
        <CardContent className="p-8 md:p-12">
          <article className="prose prose-slate prose-blue max-w-none prose-headings:text-[#000080] prose-headings:font-black prose-a:text-blue-600 prose-strong:text-slate-900 prose-code:text-pink-600 prose-pre:bg-slate-900 prose-img:rounded-xl">
            <ReactMarkdown>{fileContent}</ReactMarkdown>
          </article>
        </CardContent>
      </Card>

      {/* Footer Nav */}
      <div className="flex justify-center pt-8">
        <Link href="/qpposts">
          <Button
            variant="ghost"
            className="font-bold text-slate-400 hover:text-[#000080] gap-2"
          >
            <ArrowLeft size={16} />
            Back to Gallery
          </Button>
        </Link>
      </div>
    </div>
  );
}
