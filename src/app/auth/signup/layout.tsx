import { Metadata } from "next";

export const metadata: Metadata = {
  title: "新規登録 | ChoitameLab",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
