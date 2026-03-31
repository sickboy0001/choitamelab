"use client";

import { useEffect, useState } from "react";
import { getRequestsAction } from "@/app/requests/actions";

interface RequestItem {
  id: string;
  title: string;
  appeal_point: string;
  author?: string;
  author_name?: string;
}

export function OgPreview() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const fetched = await getRequestsAction();
        setRequests(fetched as any);
        if (fetched && fetched.length > 0) {
          setSelectedRequest(fetched[0] as any);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getOgUrl = (size: string = "1200x630") => {
    if (!selectedRequest) return "/api/og";
    return `/api/og?title=${encodeURIComponent(
      selectedRequest.title,
    )}&appealPoint=${encodeURIComponent(
      selectedRequest.appeal_point,
    )}&author=${encodeURIComponent(
      selectedRequest.author_name || selectedRequest.author || "",
    )}&size=${size}`;
  };

  return (
    <div className="p-4 animate-in fade-in duration-500">
      <h3 className="text-lg font-semibold mb-6">Vercel OG Preview</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側：依頼一覧 (1 カラム) */}
        <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
          <p className="text-sm font-medium text-gray-500 mb-3">依頼を選択</p>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg w-full" />
              ))}
            </div>
          ) : (
            requests.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                  selectedRequest?.id === req.id
                    ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm"
                    : "bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="line-clamp-1">{req.title}</span>
              </button>
            ))
          )}
        </div>

        {/* 右側：プレビュー (2 カラム) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl p-6 bg-gray-50/50 text-center">
            <p className="text-sm font-medium text-gray-500 mb-4">
              プレビュー画像
            </p>
            {selectedRequest ? (
              <div className="space-y-6 flex flex-col items-center">
                {/* 大きい OG (1200x630) */}
                <div className="relative w-[600px] h-[315px] overflow-hidden rounded-lg shadow-lg border border-white bg-white">
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10">
                    Original (1200x630)
                  </div>
                  <img
                    src={getOgUrl("1200x630")}
                    alt="OG Preview Original"
                    className="w-full h-full"
                    style={{ objectFit: "contain" }}
                    key={`${getOgUrl("1200x630")}-original`}
                  />
                </div>

                {/* 半分サイズ OG (600x315) */}
                <div className="relative w-[300px] h-[158px] overflow-hidden rounded-lg shadow-lg border border-white bg-white">
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10">
                    1/2 Size (600x315)
                  </div>
                  <img
                    src={getOgUrl("600x315")}
                    alt="OG Preview 1/2"
                    className="w-full h-full"
                    style={{ objectFit: "contain" }}
                    key={`${getOgUrl("600x315")}-half`}
                  />
                </div>

                {/* 1/4 サイズ OG (300x158) */}
                <div className="relative w-[150px] h-[79px] overflow-hidden rounded-lg shadow-lg border border-white bg-white">
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10">
                    1/4 Size (300x158)
                  </div>
                  <img
                    src={getOgUrl("300x158")}
                    alt="OG Preview 1/4"
                    className="w-full h-full"
                    style={{ objectFit: "contain" }}
                    key={`${getOgUrl("300x158")}-quarter`}
                  />
                </div>

                <div className="text-left bg-white p-4 rounded-lg border border-gray-100 text-xs text-gray-500 font-mono break-all w-full max-w-[600px]">
                  {getOgUrl("1200x630")}
                </div>
              </div>
            ) : (
              <div className="aspect-[1200/630] flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
                依頼を選択してください
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
