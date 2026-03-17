"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Markdown } from "@/components/ui/markdown";
import { getPublicUserProfile } from "@/service/user-actions";
import { Loader2 } from "lucide-react";

interface UserTooltipProps {
  userId: string;
  name: string;
}

interface UserProfile {
  display_name: string;
  self_intro_markdown: string | null;
}

export function UserTooltip({ userId, name }: UserTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 300); // 300ms の猶予を持たせる
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isVisible && !profile && !isLoading && userId) {
      const fetchProfile = async () => {
        setIsLoading(true);
        const data = await getPublicUserProfile(userId);
        if (data) {
          setProfile({
            display_name: data.display_name,
            self_intro_markdown: data.self_intro_markdown,
          });
        }
        setIsLoading(false);
      };
      fetchProfile();
    }
  }, [isVisible, profile, isLoading, userId]);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
      });
    }
  }, [isVisible]);

  return (
    <>
      <span
        ref={triggerRef}
        className="font-bold text-slate-700 cursor-help hover:text-orange-600 transition-colors underline decoration-dotted decoration-slate-300"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {name}
      </span>

      {isVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] -translate-x-1/2 -translate-y-full mb-2 pointer-events-none"
            style={{
              top: coords.top - 8,
              left: coords.left + (triggerRef.current?.offsetWidth || 0) / 2,
            }}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
          >
            <div className="w-72 p-4 bg-white border border-slate-200 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                </div>
              ) : profile ? (
                <div className="space-y-3">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    {profile.display_name}
                  </div>

                  {profile.self_intro_markdown && (
                    <Markdown
                      content={profile.self_intro_markdown}
                      className="prose prose-slate prose-sm max-w-none pt-1 border-t border-slate-50"
                    />
                  )}

                  {!profile.self_intro_markdown && (
                    <p className="text-xs text-slate-400 italic">
                      自己紹介はありません
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  プロフィールを取得できませんでした
                </div>
              )}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-white drop-shadow-sm" />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
