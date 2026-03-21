import { auth } from "@/auth";
import RequestsList from "@/components/pages/requests/requests_list";

export default async function RequestsPage() {
  const session = await auth();

  return <RequestsList hasSession={!!session} userId={session?.user?.id} />;
}
