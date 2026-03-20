import { query } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // トークンの検索
    const res = await query(
      "SELECT email, expires_at FROM email_verify_tokens WHERE token_hash = ?",
      [tokenHash],
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const { email, expires_at } = res.rows[0] as any;

    if (new Date(expires_at) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // 承認状態の更新
    await query("UPDATE users SET email_verified = ? WHERE email = ?", [
      new Date().toISOString(),
      email,
    ]);

    // トークンの削除
    await query("DELETE FROM email_verify_tokens WHERE email = ?", [email]);

    // 承認完了画面へリダイレクト
    return NextResponse.redirect(new URL("/auth/verify?success=true", req.url));
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
