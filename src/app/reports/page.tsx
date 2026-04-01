import ReportsList from "../../components/pages/reports/reports_list";
import { auth } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "報告一覧 | ChoitameLab",
};

export default async function ReportsPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="container mx-auto py-8">
      <ReportsList isLoggedIn={isLoggedIn} />
    </div>
  );
}
