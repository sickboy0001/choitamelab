"use server";

import {
  getLatestReportsPerRequest,
  getMyReports,
} from "@/service/report-service";

export async function getLatestReportsAction() {
  return await getLatestReportsPerRequest();
}

export async function getMyReportsAction() {
  return await getMyReports();
}
