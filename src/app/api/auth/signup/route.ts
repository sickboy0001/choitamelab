import { query } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 },
      );
    }

    // ユーザーの存在確認
    const existingUser = await query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const userId = nanoid();
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー作成 (トランザクションが理想だが簡易版)
    await query(
      "INSERT INTO users (id, email, display_name) VALUES (?, ?, ?)",
      [userId, email, displayName || email.split("@")[0]],
    );

    await query(
      "INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)",
      [userId, hashedPassword],
    );

    // 承認トークンの生成
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24時間

    // トークン保存
    await query(
      "INSERT OR REPLACE INTO email_verify_tokens (email, token_hash, expires_at) VALUES (?, ?, ?)",
      [email, tokenHash, expiresAt],
    );

    // メール送信
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
    await sendVerificationEmail(email, confirmLink);

    return NextResponse.json({
      message: "User registered. Please check your email.",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
