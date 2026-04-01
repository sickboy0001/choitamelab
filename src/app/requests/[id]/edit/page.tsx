import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getRequestDetail,
  getRequestTitleDetail,
} from "@/service/report-service";
import { updateRequest } from "@/service/request-service";
import { isAdministrator } from "@/lib/user";
import RequestEdit from "@/components/pages/requests/request_edit";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const request = await getRequestTitleDetail(id);
  return {
    title: `編集: ${request?.title || "依頼"} | ChoitameLab`,
  };
}

export default async function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/");

  const request = await getRequestDetail(id);
  if (!request) notFound();

  // 権限チェック：作成者本人か管理者のみ
  const isAuthor = session.user?.id === request.user_id;
  const isAdmin = isAdministrator(session);

  if (!isAuthor && !isAdmin) {
    redirect(`/requests/${id}`);
  }

  async function updateAction(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const appeal_point = formData.get("appeal_point") as string;
    const content_markdown = formData.get("content_markdown") as string;
    const max_reports_val = formData.get("max_reports") as string;
    const max_reports = parseInt(max_reports_val) || 0;
    const is_active = formData.get("is_active") === "on";
    const is_public = formData.get("is_public") === "on";

    // バリデーション
    if (title.length + appeal_point.length > 300) {
      throw new Error(
        "タイトルとアピールポイントの合計は300文字以内にする必要があります。",
      );
    }

    await updateRequest(id, {
      title,
      appeal_point,
      content_markdown,
      max_reports,
      is_active,
      is_public,
    });

    redirect(`/requests/${id}`);
  }

  return (
    <RequestEdit
      id={id}
      request={request}
      isAdmin={isAdmin}
      isAuthor={isAuthor}
      updateAction={updateAction}
    />
  );
}
