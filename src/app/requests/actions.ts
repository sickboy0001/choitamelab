"use server";

import { getRequests, deleteRequest } from "@/service/request-service";

export async function getRequestsAction() {
  return await getRequests();
}

export async function deleteRequestAction(id: string) {
  return await deleteRequest(id);
}
