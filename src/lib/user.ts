import { Session } from "next-auth";

/**
 * 管理者かどうかを判定する
 * セッションオブジェクトまたはメールアドレスを直接受け取ることができる
 */
export function isAdministrator(
  input: Session | string | null | undefined,
): boolean {
  if (!input) return false;

  let email: string | null | undefined;

  if (typeof input === "string") {
    email = input;
  } else {
    // セッションオブジェクトの場合
    email = input.user?.email;
    if ((input.user as any)?.isAdmin === true) {
      return true;
    }
  }

  if (!email) return false;
  return email === process.env.ADMINISTRATOR_MAIL;
}
