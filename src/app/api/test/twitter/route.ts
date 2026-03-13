import { NextResponse } from "next/server";
import { sendTweet } from "@/service/twitter-service";
import { auth } from "@/auth";
import { isAdministrator } from "@/lib/user";

export async function POST(request: Request) {
  const session = await auth();

  // テスト用なので管理者のみに制限
  if (!isAdministrator(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await sendTweet(text);
    return NextResponse.json({
      success: true,
      result,
      message: (result as any).mock
        ? "【検証モード】ツイートは送信されませんでした（ログを確認してください）"
        : "ツイートを送信しました",
    });
  } catch (error: any) {
    console.error("Test Tweet Error:", error);

    // 特定のエラーに対するレスポンス
    if (error.code === 402 || error.title === "CreditsDepleted") {
      return NextResponse.json(
        {
          error:
            "Twitter APIのクレジットが不足しています。プランをアップグレードするか、制限が解除されるまでお待ちください。",
          detail: error.message,
        },
        { status: 402 },
      );
    }

    if (error.code === 403) {
      return NextResponse.json(
        {
          error:
            "Twitter APIへのアクセスが拒否されました。APIの権限設定（Read and Write）や、アプリの認証情報、またはツイートの重複を確認してください。",
          detail: error.message,
        },
        { status: 403 },
      );
    }

    if (error.code === 401) {
      return NextResponse.json(
        {
          error:
            "Twitter APIの認証に失敗しました。API Key や Access Token が正しいか、または有効期限が切れていないか確認してください。",
          detail: error.message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: error.message || "ツイートの送信に失敗しました。" },
      { status: 500 },
    );
  }
}
