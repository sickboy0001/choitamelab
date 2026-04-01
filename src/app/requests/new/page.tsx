import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createRequest } from "@/service/request-service";
import RequestNew from "@/components/pages/requests/request_new";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "新規依頼作成 | ChoitameLab",
};

export default async function NewRequestPage() {
  const session = await auth();
  if (!session) redirect("/");

  async function action(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const appeal_point = formData.get("appeal_point") as string;
    const content_markdown = formData.get("content_markdown") as string;
    const max_reports = parseInt(formData.get("max_reports") as string) || 0;
    const is_active = formData.get("is_active") === "on";
    const is_public = formData.get("is_public") === "on";

    // バリデーション
    if (title.length + appeal_point.length > 300) {
      throw new Error(
        "タイトルとアピールポイントの合計は300文字以内にする必要があります。",
      );
    }

    await createRequest({
      title,
      appeal_point,
      content_markdown,
      max_reports,
      is_active,
      is_public,
    });

    redirect("/requests");
  }

  return <RequestNew createAction={action} />;
}
