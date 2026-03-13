import { getRequests } from "@/service/post-service";
import { auth } from "@/auth";
import RequestsList from "@/components/pages/requests/requests_list";

export default async function RequestsPage() {
  const requests = await getRequests();
  const session = await auth();

  return (
    <RequestsList
      requests={requests as any}
      hasSession={!!session}
      userId={session?.user?.id}
    />
  );
}
