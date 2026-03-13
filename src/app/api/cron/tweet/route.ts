import { cronDailyTweet } from "@/service/twitter-service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // セキュリティチェック（GITHUB_TOKENやカスタムAPIキーの確認）
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await cronDailyTweet();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
