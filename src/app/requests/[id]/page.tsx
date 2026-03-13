import { getRequestDetail } from "@/service/report-service";
import { getReportsByRequestId } from "@/service/report-service";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import RequestView from "@/components/pages/requests/request_view";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getRequestDetail(id);
  if (!request) notFound();

  const reports = await getReportsByRequestId(id);
  const session = await auth();
  const isAuthor = session?.user?.id === request.user_id;

  return (
    <RequestView
      id={id}
      request={request}
      reports={reports}
      isAuthor={isAuthor}
      isLoggedIn={!!session}
    />
  );
}
