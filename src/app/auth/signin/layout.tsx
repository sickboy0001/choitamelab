import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン | ChoitameLab",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
