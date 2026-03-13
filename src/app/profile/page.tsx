import { redirect } from "next/navigation";
import { getUserProfile, updateUserProfile } from "@/service/user-service";
import Profile from "@/components/pages/profile/profile";

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/auth/signin");
  }

  const updateAction = async (data: {
    display_name: string;
    twitter_account?: string;
  }) => {
    "use server";
    await updateUserProfile(data);
  };

  return <Profile user={user as any} updateAction={updateAction} />;
}
