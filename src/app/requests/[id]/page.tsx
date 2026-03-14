import { getRequestDetail } from "@/service/report-service";
import { getReportsByRequestId } from "@/service/report-service";
import { getComments } from "@/service/comment-service";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import RequestView from "@/components/pages/requests/request_view";
import { isAdministrator } from "@/lib/user";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getRequestDetail(id);
  if (!request) notFound();

  const reports = await getReportsByRequestId(id);

  // 依頼に対するコメントを取得
  const requestComments = await getComments("request", id);

  // 各報告に対してコメントを取得してマッピング
  const reportsWithComments = await Promise.all(
    reports.map(async (report: any) => {
      const comments = await getComments("report", report.id);
      return { ...report, comments };
    }),
  );

  const session = await auth();
  const isAuthor = session?.user?.id === request.user_id;
  const isAdmin = isAdministrator(session);

  return (
    <RequestView
      id={id}
      request={request}
      reports={reportsWithComments}
      requestComments={requestComments}
      isAuthor={isAuthor}
      isAdmin={isAdmin}
      isLoggedIn={!!session}
      userId={session?.user?.id}
    />
  );
}
