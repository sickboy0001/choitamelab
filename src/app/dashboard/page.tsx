import { auth } from "@/auth";
import Dashboard from "@/components/pages/dashboard/dashboard";
import { isAdministrator } from "@/lib/user";

export default async function DashboardPage() {
  const session = await auth();

  // ログインしていなくても表示できるようにリダイレクトを削除
  return (
    <Dashboard
      userName={session?.user?.name}
      isAdmin={isAdministrator(session?.user?.email)}
      isLoggedIn={!!session}
    />
  );
}
