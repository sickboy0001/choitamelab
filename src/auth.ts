import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "./lib/db";
import bcrypt from "bcryptjs";
import { isAdministrator } from "./lib/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "メールアドレス",
      credentials: {
        email: {
          label: "メールアドレス",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          // ユーザーの取得
          const userRes = await query(
            "SELECT id, email, display_name, is_admin FROM users WHERE email = ?",
            [email],
          );

          if (userRes.rows.length === 0) {
            // 新規ユーザーの場合：パスワードがメールアドレスと一致すれば作成
            if (password === email) {
              const id = crypto.randomUUID();
              const displayName = email.split("@")[0];
              await query(
                "INSERT INTO users (id, email, display_name) VALUES (?, ?, ?)",
                [id, email, displayName],
              );
              const hashedPassword = await bcrypt.hash(password, 10);
              await query(
                "INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)",
                [id, hashedPassword],
              );
              return { id, email, name: displayName, isAdmin: false };
            }
            return null;
          }

          const user = userRes.rows[0];
          const userId = user.id as string;
          const isAdmin = !!user.is_admin;

          // パスワードの取得
          const passRes = await query(
            "SELECT password_hash FROM user_passwords WHERE user_id = ?",
            [userId],
          );

          if (passRes.rows.length === 0) {
            // パスワード未設定（既存のGoogleユーザーなど）の場合：
            // 入力パスワードがメールアドレスと一致すれば登録してログイン
            if (password === email) {
              const hashedPassword = await bcrypt.hash(password, 10);
              await query(
                "INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)",
                [userId, hashedPassword],
              );
              return {
                id: userId,
                email: user.email as string,
                name: user.display_name as string,
                isAdmin: isAdmin,
              };
            }
            return null;
          }

          // パスワード照合
          const isValid = await bcrypt.compare(
            password,
            passRes.rows[0].password_hash as string,
          );
          if (isValid) {
            return {
              id: userId,
              email: user.email as string,
              name: user.display_name as string,
              isAdmin: isAdmin,
            };
          }

          return null;
        } catch (error) {
          console.error("Credentials error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (user.email) {
        try {
          // ユーザーが存在するか確認
          const res = await query(
            "SELECT id, is_admin FROM users WHERE email = ?",
            [user.email],
          );
          let userId: string;

          if (res.rows.length === 0) {
            // 新規登録
            userId = crypto.randomUUID();
            const displayName = user.email.split("@")[0];
            await query(
              "INSERT INTO users (id, email, display_name) VALUES (?, ?, ?)",
              [userId, user.email, displayName],
            );
            user.id = userId;
            (user as any).isAdmin = false;
          } else {
            userId = res.rows[0].id as string;
            user.id = userId;
            (user as any).isAdmin = !!res.rows[0].is_admin;
          }

          // Googleログイン等の場合も、パスワードテーブルが未設定なら初期パスワード（email）を設定
          const passRes = await query(
            "SELECT user_id FROM user_passwords WHERE user_id = ?",
            [userId],
          );
          if (passRes.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(user.email, 10);
            await query(
              "INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)",
              [userId, hashedPassword],
            );
          }
          return true;
        } catch (error) {
          console.error("Error during signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // ログイン時のみ実行
        try {
          const email = user.email;
          const res = await query(
            "SELECT id, is_admin FROM users WHERE email = ?",
            [email],
          );
          if (res.rows.length > 0) {
            token.id = res.rows[0].id;
            token.isAdmin = !!res.rows[0].is_admin || isAdministrator(email);
            console.log(
              `JWT Callback: Found user in DB. Email: ${email}, ID: ${token.id}, IsAdmin: ${token.isAdmin}`,
            );
          } else {
            // signIn callback で作成されているはずだが、念のため
            token.id = user.id;
            token.isAdmin = (user as any).isAdmin || isAdministrator(email);
            console.warn(
              `JWT Callback: User NOT found in DB. Email: ${email}, using provider ID: ${token.id}`,
            );
          }
        } catch (e) {
          console.error("JWT Callback Error:", e);
          token.id = user.id;
          token.isAdmin = (user as any).isAdmin || isAdministrator(user.email);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
});
