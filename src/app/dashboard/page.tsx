import { auth } from "@/auth";
import Dashboard from "@/components/pages/dashboard/dashboard";
import { isAdministrator } from "@/lib/user";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ダッシュボード | ChoitameLab",
};

export default async function DashboardPage() {
  const session = await auth();

  // ログインしていなくても表示できるようにリダイレクトを削除
  return (
    <Dashboard
      userId={session?.user?.id}
      userName={session?.user?.name}
      isAdmin={isAdministrator(session?.user?.email)}
      isLoggedIn={!!session}
    />
  );
}
