import { auth } from "@/auth";
import RequestsList from "@/components/pages/requests/requests_list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "依頼一覧 | ChoitameLab",
};

export default async function RequestsPage() {
  const session = await auth();

  return <RequestsList hasSession={!!session} userId={session?.user?.id} />;
}
