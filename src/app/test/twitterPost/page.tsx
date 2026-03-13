import { auth } from "@/auth";
import { isAdministrator } from "@/lib/user";
import { redirect } from "next/navigation";
import TwitterTestClient from "./TwitterTestClient";

export default async function TwitterTestPage() {
  const session = await auth();

  if (!isAdministrator(session?.user?.email)) {
    redirect("/");
  }

  return <TwitterTestClient />;
}
