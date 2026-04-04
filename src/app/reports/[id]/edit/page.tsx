import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getRequestDetail,
  getReportDetail,
  updateReport,
  deleteReport,
  getRequestTitleDetail,
} from "@/service/report-service";
import ReportEdit from "@/components/pages/reports/report_edit";
import { isAdministrator } from "@/lib/user";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: reportId } = await params;
  const report = await getReportDetail(reportId);
  if (!report) return { title: "報告編集 | ChoitameLab" };

  const request = await getRequestTitleDetail(report.request_id);
  return {
    title: `報告編集: ${request?.title || "依頼"} | ChoitameLab`,
  };
}

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

  async function deleteAction() {
    "use server";
    await deleteReport(reportId);
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
      deleteAction={deleteAction}
    />
  );
}
