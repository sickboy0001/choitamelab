import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getRequestDetail,
  createReport,
  getRequestTitleDetail,
} from "@/service/report-service";
import ReportNew from "@/components/pages/reports/report_new";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const request = await getRequestTitleDetail(id);
  return {
    title: `報告作成: ${request?.title || "依頼"} | ChoitameLab`,
  };
}

export default async function NewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: requestId } = await params;
  const session = await auth();
  if (!session) redirect("/");

  const request = await getRequestDetail(requestId);
  if (!request) notFound();

  async function action(formData: FormData) {
    "use server";
    const content_markdown = formData.get("content_markdown") as string;
    const is_active = formData.get("is_active") === "on";
    const is_public = formData.get("is_public") === "on";

    await createReport({
      requestId,
      content_markdown,
      is_active,
      is_public,
    });

    redirect(`/requests/${requestId}`);
  }

  return (
    <ReportNew
      requestId={requestId}
      requestTitle={request.title}
      requestAppealPoint={request.appeal_point}
      requestContentMarkdown={request.content_markdown}
      isRequestActive={request.is_active}
      isRequestPublic={request.is_public}
      action={action}
    />
  );
}
