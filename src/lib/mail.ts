import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Resend APIを使用してメールを送信する共通関数
 */
async function sendResendEmail({
  to,
  subject,
  html,
  from = "ChoitameLab <noreply@stockprofit10.net>",
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend Error:", error);

      // 開発環境でのフォールバック表示
      if (process.env.NODE_ENV === "development") {
        console.log("--- DEVELOPMENT FALLBACK ---");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`HTML Content:\n${html}`);
        console.log("----------------------------");
      }

      throw new Error("メールの送信に失敗しました。");
    }

    return data;
  } catch (err) {
    console.error("Email sending failed:", err);

    if (process.env.NODE_ENV === "development") {
      console.log("--- DEVELOPMENT FALLBACK (Exception) ---");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML Content:\n${html}`);
      console.log("---------------------------------------");
    }

    throw err;
  }
}

export async function sendVerificationEmail(to: string, url: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4d4db2; text-align: center;">ChoitameLabへようこそ！</h2>
      <p>ChoitameLab へのご登録ありがとうございます。</p>
      <p>以下のボタンをクリックして、アカウントの登録を完了させてください。</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #4d4db2; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
          アカウントを承認する
        </a>
      </div>
      <p style="font-size: 12px; color: #64748b;">
        このメールに心当たりがない場合は、お手数ですが破棄してください。<br>
        ボタンが正しく動作しない場合は、以下のURLをブラウザに貼り付けてください：<br>
        ${url}
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} ChoitameLab 
      </p>
    </div>
  `;

  return sendResendEmail({
    to,
    subject: "【ChoitameLab】アカウント登録の確認",
    html,
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4d4db2; text-align: center;">パスワード再設定</h2>
      <p>ChoitameLabをご利用いただきありがとうございます。</p>
      <p>パスワードの再設定リクエストを受け付けました。以下のボタンをクリックして新しいパスワードを設定してください。</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #4d4db2; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
          パスワードを再設定する
        </a>
      </div>
      <p style="font-size: 12px; color: #64748b;">
        このメールに心当たりがない場合は、お手数ですが破棄してください。パスワードが変更されることはありません。<br>
        ボタンが正しく動作しない場合は、以下のURLをブラウザに貼り付けてください：<br>
        ${url}
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} ChoitameLab
      </p>
    </div>
  `;

  return sendResendEmail({
    to,
    subject: "【ChoitameLab】パスワード再設定のご案内",
    html,
  });
}
