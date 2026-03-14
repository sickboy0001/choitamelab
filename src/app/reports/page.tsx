import {
  getLatestReportsPerRequest,
  getMyReports,
} from "@/service/report-service";
import ReportsList from "../../components/pages/reports/reports_list";
import { auth } from "@/auth";

export default async function ReportsPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const [reports, myReports] = await Promise.all([
    getLatestReportsPerRequest(),
    isLoggedIn ? getMyReports() : Promise.resolve([]),
  ]);

  return (
    <div className="container mx-auto py-8">
      <ReportsList
        reports={reports as any}
        myReports={myReports as any}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
