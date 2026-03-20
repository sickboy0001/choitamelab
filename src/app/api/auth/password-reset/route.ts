import { query } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // ユーザーの存在確認
    const res = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (res.rows.length === 0) {
      // ユーザーが存在しなくても、セキュリティ上の理由で成功を返す（メールは送らない）
      // あるいは、明確に「ユーザーが見つからない」と返してもプロジェクトの要件次第
      return NextResponse.json({
        message: "If your email is registered, you will receive a reset link.",
      });
    }

    // パスワードリセットトークンの生成
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(); // 1時間

    // トークン保存
    await query(
      "INSERT OR REPLACE INTO password_reset_tokens (email, token_hash, expires_at) VALUES (?, ?, ?)",
      [email, tokenHash, expiresAt],
    );

    // メール送信
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/password-reset/new?token=${token}`;
    await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json({
      message: "If your email is registered, you will receive a reset link.",
    });
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
