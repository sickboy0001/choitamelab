"use server";

import { getRequests } from "@/service/request-service";

export async function getRequestsAction() {
  return await getRequests();
}
