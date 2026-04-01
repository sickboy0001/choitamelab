import { redirect } from "next/navigation";
import { getUserProfile, updateUserProfile } from "@/service/user-service";
import Profile from "@/components/pages/profile/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プロフィール | ChoitameLab",
};

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/auth/signin");
  }

  const updateAction = async (data: {
    display_name: string;
    self_intro_markdown?: string;
  }) => {
    "use server";
    await updateUserProfile(data);
  };

  return <Profile user={user as any} updateAction={updateAction} />;
}
