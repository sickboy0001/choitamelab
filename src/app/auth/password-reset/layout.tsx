import { Metadata } from "next";

export const metadata: Metadata = {
  title: "パスワード再設定 | ChoitameLab",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
