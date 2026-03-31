import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { loadDefaultJapaneseParser } from "budoux";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

const parser = loadDefaultJapaneseParser();

// 句読点で改行を優先するためのヘルパー
const parseWithPunctuation = (text: string) => {
  // 1. まず、2 連続以上の改行を 1 つの改行に置換する
  const normalizedText = text.replace(/\n{2,}/g, "\n");

  // 2. 句読点の後ろに改行コードを挿入
  // ただし、閉じ括弧（」』）】）などの前では改行しないように制御
  const processedText = normalizedText.replace(
    /([、。！？])(?![、。！？\n」』）】])/g,
    "$1\n",
  );

  // 3. 改行コードで分割し、空行を除外してそれぞれの行に対して BudouX を適用
  return processedText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => parser.parse(line));
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "ChoitameLab";
  let appealPoint = searchParams.get("appealPoint") || "";
  const author = searchParams.get("author") || "";
  const size = searchParams.get("size") || "1200x630";

  // サイズパラメータをパース（例："1200x630", "600x315", "300x158"）
  const [widthStr, heightStr] = size.split("x");
  const width = parseInt(widthStr, 10) || 1200;
  const height = parseInt(heightStr, 10) || 630;

  // サイズに応じたスケーリング
  const scale = width / 1200;

  // 画像をベース 64 で埋め込み（ローカル環境でも動作させるため）
  const faviconPath = join(process.cwd(), "public", "og", "favicon_192.png");
  const faviconImage = readFileSync(faviconPath);
  const faviconUrl = `data:image/png;base64,${faviconImage.toString("base64")}`;

  // 90 文字制限と「...」付与（サイズに応じて調整）
  const maxAppealLength = Math.max(30, 90);
  if (appealPoint.length > maxAppealLength) {
    appealPoint = appealPoint.substring(0, maxAppealLength) + "...";
  }

  // 日本語の改行位置を自然にするために BudouX と句読点ベースの分割を併用
  const titleLines = parseWithPunctuation(title);
  const appealLines = parseWithPunctuation(appealPoint);

  // Satori は oklch() をパースできないため、Hex を使用。
  const borderColor = "#ea580c";
  const textColor = "#222222";
  const bgColor = "#ffffff";

  // サイズに応じたスタイル値
  const fontSize = Math.floor(72 * scale);
  const appealFontSize = Math.floor(38 * scale);
  const authorFontSize = Math.floor(48 * scale);
  const faviconSize = Math.floor(38.4 * scale);
  const faviconMargin = Math.floor(9.6 * scale);
  const paddingY = Math.floor(30 * scale);
  const paddingX = Math.floor(80 * scale);
  const borderRightWidth = Math.floor(24 * scale);
  const marginBottom = Math.floor(40 * scale);
  const paddingAp = Math.floor(20 * scale);
  const bottomPos = Math.floor(15 * scale);
  const leftPos = Math.floor(40 * scale);
  const rightPos = Math.floor(30 * scale);
  const textShadowOffset = 0.5 * scale;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        // 右側の枠線のみ設定（Satori が double をサポートしていないため手動で構築）
        borderRight: `${borderRightWidth}px solid ${borderColor}`,
        padding: `${paddingY}px ${paddingX}px`,
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* 左側の二重線（手動構築） */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          width: `${48 * scale}px`,
        }}
      >
        <div
          style={{
            width: `${16 * scale}px`,
            height: "100%",
            backgroundColor: borderColor,
          }}
        />
        <div
          style={{
            width: `${8 * scale}px`,
            height: "100%",
            backgroundColor: "transparent",
          }}
        />
        <div
          style={{
            width: `${4 * scale}px`,
            height: "100%",
            backgroundColor: borderColor,
          }}
        />
      </div>

      {/* タイトル表示 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: fontSize,
          fontWeight: "bold",
          color: textColor,
          lineHeight: 1.2,
          textAlign: "center",
          marginBottom: `${marginBottom}px`,
          width: "100%",
        }}
      >
        {titleLines.map((segments, lineIndex) => (
          <div
            key={lineIndex}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {segments.map((segment, segIndex) => (
              <span key={segIndex}>{segment}</span>
            ))}
          </div>
        ))}
      </div>

      {/* アピールポイント表示 */}
      {appealPoint && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: appealFontSize,
            color: "#444444",
            lineHeight: 1.5,
            textAlign: "center",
            width: "100%",
            padding: `0 ${paddingAp}px`,
          }}
        >
          {appealLines.map((segments, lineIndex) => (
            <div
              key={lineIndex}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {segments.map((segment, segIndex) => (
                <span key={segIndex}>{segment}</span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 左下に投稿者名を配置 */}
      {author && (
        <div
          style={{
            position: "absolute",
            bottom: `${bottomPos}px`,
            left: `${leftPos}px`,
            fontSize: authorFontSize,
            fontWeight: 900,
            color: "#444444",
            fontFamily: "sans-serif",
          }}
        >
          {author}
        </div>
      )}

      {/* 右下に ChoitameLab を配置 */}
      <div
        style={{
          position: "absolute",
          bottom: `${bottomPos}px`,
          right: `${rightPos}px`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: authorFontSize,
            fontWeight: 900,
            color: borderColor,
            letterSpacing: "-0.05em",
            fontFamily: "sans-serif",
            textShadow: `${textShadowOffset}px 0 ${borderColor}, -${textShadowOffset}px 0 ${borderColor}`,
          }}
        >
          ChoitameLab
        </div>
        <img
          src={faviconUrl}
          style={{
            width: faviconSize,
            height: faviconSize,
            marginLeft: faviconMargin,
          }}
        />
      </div>
    </div>,
    {
      width,
      height,
    },
  );
}
