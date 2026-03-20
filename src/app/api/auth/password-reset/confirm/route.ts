import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password" },
        { status: 400 },
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // トークンの検索
    const res = await query(
      "SELECT email, expires_at FROM password_reset_tokens WHERE token_hash = ?",
      [tokenHash],
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const { email, expires_at } = res.rows[0] as any;

    if (new Date(expires_at) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // ユーザーIDの取得
    const userRes = await query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = (userRes.rows[0] as any).id;

    // パスワードのハッシュ化と更新
    const hashedPassword = await bcrypt.hash(password, 10);
    await query(
      "UPDATE user_passwords SET password_hash = ? WHERE user_id = ?",
      [hashedPassword, userId],
    );

    // トークンの削除
    await query("DELETE FROM password_reset_tokens WHERE email = ?", [email]);

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Password confirm error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
