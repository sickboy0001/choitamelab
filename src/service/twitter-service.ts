import { query } from "@/lib/db";
import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || "",
  appSecret: process.env.TWITTER_API_SECRET || "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
  accessSecret: process.env.TWITTER_ACCESS_SECRET || "",
});

export async function sendTweet(text: string) {
  if (process.env.TWITTER_DISABLED === "true") {
    console.log("--- TWITTER MOCK MODE ---");
    console.log("Text:", text);
    console.log("-------------------------");
    return {
      data: {
        id: "mock_id_" + Date.now(),
        text: text,
      },
      mock: true,
    };
  }

  try {
    const result = await client.v2.tweet(text);
    return result;
  } catch (error: any) {
    let errorTitle = "Twitter API Error";
    let errorDetail = error.message;

    if (error.data) {
      errorTitle = error.data.title || errorTitle;
      errorDetail = error.data.detail || errorDetail;
      console.error(
        "Twitter API Error Detail:",
        JSON.stringify(error.data, null, 2),
      );
    }

    console.error("Twitter API error:", error);

    // クレジット不足やレートリミットなどの特定のエラーに対するカスタムハンドリング
    if (error.code === 402 || errorTitle === "CreditsDepleted") {
      const customError = new Error(
        `Twitter API Credits Depleted: ${errorDetail}`,
      );
      (customError as any).code = 402;
      (customError as any).title = "CreditsDepleted";
      throw customError;
    }

    if (error.code === 403) {
      const customError = new Error(`Twitter API Forbidden: ${errorDetail}`);
      (customError as any).code = 403;
      (customError as any).title = errorTitle;
      throw customError;
    }

    if (error.code === 401) {
      const customError = new Error(
        `Twitter API Unauthorized: ${errorDetail}. 認証情報（API Key, Tokens）が正しくないか、無効になっています。`,
      );
      (customError as any).code = 401;
      (customError as any).title = errorTitle;
      throw customError;
    }

    throw error;
  }
}

export async function postTweet(requestId: string) {
  const result = await query(
    "SELECT id, title, appeal_point FROM cit_requests WHERE id = ?",
    [requestId],
  );
  const request = result.rows[0] as any;
  if (!request) return;

  const url = `https://choitamelab.vercel.app/requests/${request.id}`;
  const text = `「${request.title}」\n${request.appeal_point}\n\n${url}\n\n#ChoitameLab #検証依頼`;

  console.log("Tweeting:", text);

  return await sendTweet(text);
}

export async function cronDailyTweet() {
  // 1日1回、最新の依頼などをランダムまたは順番に1件ピックアップしてツイートするロジック
  const result = await query(
    "SELECT id, title FROM cit_requests WHERE is_active = 1 AND is_public = 1 ORDER BY RANDOM() LIMIT 1",
  );
  const request = result.rows[0] as any;
  if (request) {
    const tweetResult = await postTweet(request.id);
    return {
      success: true,
      request_id: request.id,
      title: request.title,
      tweetResult,
    };
  }
  return { success: false, message: "No request found to tweet" };
}
