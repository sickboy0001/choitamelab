import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getRequestDetail,
  getReportDetail,
  updateReport,
} from "@/service/report-service";
import ReportEdit from "@/components/pages/reports/report_edit";
import { isAdministrator } from "@/lib/user";

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reportId } = await params;
  const session = await auth();
  if (!session) redirect("/");

  const report = await getReportDetail(reportId);
  if (!report) notFound();

  // 権限チェック
  const isAuthor = session.user?.id === report.user_id;
  const isAdmin = isAdministrator(session);
  if (!isAuthor && !isAdmin) {
    redirect(`/requests/${report.request_id}`);
  }

  const request = await getRequestDetail(report.request_id);
  if (!request) notFound();

  async function updateAction(formData: FormData) {
    "use server";
    const content_markdown = formData.get("content_markdown") as string;
    const is_active = formData.get("is_active") === "on";
    const is_public = formData.get("is_public") === "on";

    await updateReport(reportId, {
      content_markdown,
      is_active,
      is_public,
    });

    redirect(`/requests/${report.request_id}`);
  }

  return (
    <ReportEdit
      reportId={reportId}
      requestId={report.request_id}
      requestTitle={request.title}
      requestAppealPoint={request.appeal_point}
      requestContentMarkdown={request.content_markdown}
      isRequestActive={request.is_active}
      isRequestPublic={request.is_public}
      initialContentMarkdown={report.content_markdown}
      initialIsActive={report.is_active === 1}
      initialIsPublic={report.is_public === 1}
      updateAction={updateAction}
    />
  );
}
